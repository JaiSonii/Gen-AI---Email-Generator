import subprocess
import tempfile
import os
import json
import re
import shutil
from app.core.models.resume import Resume
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv


def escape_latex(text: str) -> str:
    """Escape special LaTeX characters in text."""
    if not text:
        return ""
    replacements = {
        "&": r"\&",
        "%": r"\%",
        "$": r"\$",
        "#": r"\#",
        "_": r"\_",
        "{": r"\{",
        "}": r"\}",
        "~": r"\textasciitilde{}",
        "^": r"\textasciicircum{}",
        "\\": r"\textbackslash{}",
        "–": r"--",  # en dash
        "—": r"---",  # em dash
    }
    # Important: Only apply replacements if the text isn't already escaped
    # This is a simple check; the prompt fix is more robust.
    for old, new in replacements.items():
        # Avoid double-escaping backslashes
        if old == "\\" and new in text:
            continue
        text = text.replace(old, new)
    return text


def render_resume(resume: Resume) -> dict:
    """Convert Resume object into LaTeX-safe dict for template placeholders."""

    # --- Helper function for creating hyperlinks (CORRECTED) ---
    def create_hyperlink(url: str, text: str, icon: str, protocol: str = 'https://') -> str:
        if not url:
            return ""
        if "\\href" in url:
            return url
        
        full_url = url
        if not re.match(r'^\w+:', full_url):
            full_url = protocol + full_url
        
        # CRITICAL FIX: The URL itself (full_url) should NOT be escaped.
        # The hyperref package handles URL encoding internally.
        # Only the visible text needs escaping.
        return f"\\href{{{full_url}}}{{\\raisebox{{0.0\\height}}{{\\{icon}}}\ {escape_latex(text)}}}"

    # --- Render sections to match the LaTeX template's custom commands ---

    skills_block = (
        "\\resumeItemListStart\n" +
        "\n".join([f"\\item {escape_latex(skill)}" for skill in resume.skills]) +
        "\n\\resumeItemListEnd"
    )

    experience_block = ""
    for exp in resume.experience:
        experience_block += f"\\resumeSubheading{{{escape_latex(exp.role)}}}{{{escape_latex(exp.date)}}}{{{escape_latex(exp.company)}}}{{}}\n"
        experience_block += "\\resumeItemListStart\n" + "\n".join([f"\\item {escape_latex(b)}" for b in exp.bullets]) + "\n\\resumeItemListEnd\n"

    project_block = ""
    for p in resume.projects:
        project_title = f"{escape_latex(p.title)} -- {escape_latex(p.subtitle)}"
        project_block += f"\\resumeSubheading{{{project_title}}}{{{escape_latex(p.date)}}}{{}}{{}}\n"
        project_block += "\\resumeItemListStart\n" + "\n".join([f"\\item {escape_latex(b)}" for b in p.bullets]) + "\n\\resumeItemListEnd\n"
        
    education_block = ""
    for e in resume.education:
        degree_line = f"{escape_latex(e.degree)} | CGPA: {escape_latex(e.grade)}"
        education_block += f"\\resumeSubheading{{{escape_latex(e.institution)}}}{{{escape_latex(e.date)}}}{{{degree_line}}}{{}}\n"

    return {
        "NAME": escape_latex(resume.name),
        "PHONE": f"\\faPhone\ {escape_latex(resume.phone)}",
        "EMAIL": create_hyperlink(resume.email, resume.email, icon='faEnvelope', protocol='mailto:'),
        "GITHUB": create_hyperlink(resume.github, 'GitHub', icon='faGithub'),
        "LINKEDIN": create_hyperlink(resume.linkedin, 'LinkedIn', icon='faLinkedin'),
        "LEETCODE": create_hyperlink(resume.leetcode, 'Leetcode', icon='faLink'),
        "SUMMARY": escape_latex(resume.summary),
        "SKILLS": skills_block,
        "EXPERIENCE": experience_block,
        "PROJECTS": project_block,
        "EDUCATION": education_block,
    }
class ResumeGenerator:
    def __init__(self, template_path: str):
        load_dotenv()
        if not os.path.exists(template_path):
            raise FileNotFoundError(f"Template file not found at: {template_path}")
        self.template_path = template_path
        self.__resume_parser = JsonOutputParser(pydantic_object=Resume)
        self.__llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash")

    def get_data(self, resume_text: str, review: dict) -> Resume:
        """Generate structured Resume object from raw text and review."""
        prompt = ChatPromptTemplate.from_messages([
            (
                "system",
                "You are an expert career assistant and resume builder. "
                "Given the resume text and resume review JSON, "
                "create a new refined resume structured in the required format. "
                # MODIFIED PROMPT: Instruct the LLM to provide raw text to prevent double-escaping
                "IMPORTANT: Provide all text content as plain, raw strings without any LaTeX escaping. The system will handle all escaping."
            ),
            (
                "human",
                "{format_instructions}\n\n"
                "resume text : \n{resume_text}\n\n"
                "review json : \n{review}"
            )
        ])

        input_data = {
            "resume_text": resume_text,
            "review": review,
            "format_instructions": self.__resume_parser.get_format_instructions(),
        }

        chain = prompt | self.__llm | self.__resume_parser
        result = chain.invoke(input_data)
        return Resume(**result)

    def generate_resume(self, resume: Resume) -> str:
        """Fill LaTeX template with user data and return PDF path."""
        # This is just a placeholder template for the code to run.
        # The actual template is loaded from the file path.
        tex_template = """
        \\documentclass[a4paper,11pt]{article}
        % ... Your full template preamble here ...
        \\begin{document}
        \\begin{tabularx}{\\linewidth}{@{}L r@{}}
          \\textbf{\\huge <NAME>} &
          \\footnotesize{<PHONE> \\quad|\\quad <EMAIL> \\quad|\\quad <GITHUB> \\quad|\\quad <LINKEDIN> \\quad|\\quad <LEETCODE>}
        \\end{tabularx}
        
        \\section{Summary}
        <SUMMARY>

        \\section{Technical Skills}
        <SKILLS>

        \\section{Experience}
        \\resumeSubHeadingListStart
        <EXPERIENCE>
        \\resumeSubHeadingListEnd

        \\section{Projects}
        \\resumeSubHeadingListStart
        <PROJECTS>
        \\resumeSubHeadingListEnd

        \\section{Education}
        \\resumeSubHeadingListStart
        <EDUCATION>
        \\resumeSubHeadingListEnd

        \\end{document}
        """

        with open(self.template_path, "r", encoding="utf-8") as f:
            tex_template = f.read()

        latex_dict = render_resume(resume)

        filled_tex = tex_template
        for key, value in latex_dict.items():
            # Use a more robust replacement to avoid replacing substrings
            filled_tex = filled_tex.replace(f"<{key}>", value or "")

        with tempfile.TemporaryDirectory() as tmpdir:
            tex_path = os.path.join(tmpdir, "resume.tex")
            with open(tex_path, "w", encoding="utf-8") as f:
                f.write(filled_tex)

            for _ in range(2):
                proc = subprocess.run(
                    ["pdflatex", "-interaction=nonstopmode", tex_path],
                    cwd=tmpdir, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True
                )

            if proc.returncode != 0:
                print("--- LaTeX Compilation Failed ---")
                print("STDOUT:\n", proc.stdout)
                print("\nSTDERR:\n", proc.stderr)
                with open("failed_resume.tex", "w", encoding="utf-8") as f:
                    f.write(filled_tex)
                print("\nProblematic .tex file saved as 'failed_resume.tex'")
                raise RuntimeError("PDF generation failed due to a LaTeX error.")

            pdf_path = os.path.join(tmpdir, "resume.pdf")
            if os.path.exists(pdf_path):
                final_path = os.path.abspath("generated_resume.pdf")
                shutil.move(pdf_path, final_path)
                return final_path
            else:
                raise RuntimeError("PDF file was not generated by LaTeX.")

# --- Test Run ---
if __name__ == "__main__":
    resume_text = """
      Jai Soni ♂phone+91-8085048942 | /envel⌢pejaiusoni2003@gmail.com | /githubGitHub | /linkedinLinkedIn | ὑ7Leetcode
Summary
Computer Science Graduate with experience of 1+ years in product based startups, built and shipped multiple Full
Stack and AI/ML products, created USP features for products increasing sales by 25%
Technical Skills
Languages: Python, JavaScript, TypeScript, SQL, GraphQL
Core: Data Structures Algorithms, OOP, DBMS, OS, Computer Networks
Frameworks: React.js, Next.js, Jest Node.js, Express, Flask, FastAPI
Database: PostgreSQL, MongoDB
DevOps/Cloud: AWS (EC2, S3), GitHub Actions, Vercel, Docker
Tools: Git, VS Code, PyInstaller
Experience
•Software Development Engineer Feb 2025 – Present
ὑ7FOG Technologies, Surat
– Architected a high-performance, multi-threaded video processing system inPython and OpenCV, utilizing shared
memory and concurrent queues to manage multiple real-time camera feeds.
– Designed and built a robust,OOP-based football game engine that was recognized as the 2nd best game on the
platform, directly contributing to user engagement and platform growth.
– Engineered a reusable frontend Pin Authentication module, standardizing security protocols and eliminating code
redundancy across 5+ critical software modules.
– Automated the end-to-end deployment pipeline using a custom launcher andPyInstaller, slashing deployment time
by 90% and significantly enhancing system reliability.
– Spearheaded a company-wide AI adoption initiative, leading training sessions that resulted in a10% increase in
developer productivity.
•Full Stack Developer Jun 2024 - Feb 2025
ὑ7Awajahi, Remote
– Delivered a scalable logistics SaaS platform usingNext.js, Node.js, andPostgreSQL, reducing manual client opera-
tions by25% through system automation.
– Engineered a responsive dashboard with optimized user workflows, reducing new-user onboarding time by40%.
– Automated document processing workflows withPython, cutting manual data entry by80% through intelligent
automation.
– Integrated AWS S3 for scalable cloud storage, streamlining deployment workflows and enabling large-scale file
handling.
– Contributed to a30% increase in team delivery velocity by championing version control best practices within an
Agile framework.
Projects
•GenAI Email & Referral Generator (Full-Stack Langchain Project) Aug 2025 – Present
A tool to generate personalized emails and referral messages for job applications
– Developed a full-stack application using Python/FastAPI for the backend and Next.js/React for the frontend,
leveraging Langchain with Google’sGemini model to generate tailored outreach content.
– Engineered a robust backend API to handle PDF resume parsing, scrape job descriptions from URLs usingBeauti-
fulSoup and Selenium, and process user data to create personalized generation prompts.
– Built a dynamic, multi-step user interface inReact and TypeScript that allows users to upload their resume, input
job details, and receive both a generated message and a detailed resume review.
•PUBG Win Prediction (Machine Learning) Apr 2024 – May 2024
Developed a predictive model to estimate player win probability in PUBG
– Engineered features from a large dataset and trained aCatBoost model with hyperparameter tuning, achieving high
predictive accuracy.
– Utilized Python in a Jupyter Notebook environment, employing libraries such as NumPy, Pandas, Matplotlib, and
Scikit-learn for the end-to-end machine learning workflow.
Education
•Shri Vaishnav Vidyapeeth Vishwavidyalaya, Indore 2021 – 2025
B.Tech in Computer Science Engineering CGPA: 8.0/10
    """
    reviewstr = """
      {
  "review": {
    "overall_summary": "Jai Soni's resume demonstrates relevant experience in software development, AI/ML, and full-stack development, aligning well with the Founding Engineer role at Krazimo.  However, some adjustments can enhance its impact and highlight keywords crucial for Applicant Tracking Systems (ATS).",
    "strengths": [
      "Extensive experience in full-stack development, AI/ML, and relevant technologies (Python, JavaScript, React, Node.js, etc.)",
      "Quantifiable achievements demonstrating impact (e.g., 10% increase in developer productivity, 25% reduction in manual operations)",
      "Strong project portfolio showcasing practical application of skills (GenAI project, PUBG prediction model)",
      "Experience with cloud technologies (AWS S3)"
    ],
    "areas_for_improvement": [
      "Quantify accomplishments further wherever possible.  For example, specify the size of the video processing system or the number of users impacted by the game engine.",
      "Highlight experience with specific AI frameworks or libraries used (TensorFlow, PyTorch, etc.)",
      "Incorporate keywords from the job description more explicitly (e.g., 'scalable AI solutions', 'cross-functional collaboration', 'robust system integration')",
      "Add a dedicated 'Skills' section summarizing key technical proficiencies, using keywords from the job description and adding any missing ones (e.g., specific AI/ML algorithms, experience with specific databases, etc.)",
      "Rework the summary to be more concise and results-oriented.  Focus on the value provided to previous employers.",
      "Tailor the resume to this specific role, emphasizing the aspects most relevant to the job description.",
      "Update contact information to include a professional-looking email address and LinkedIn profile URL.",
      "Add a portfolio link if you have one."
    ],
    "keyword_analysis": {
      "matched_keywords": [
        "Python", "AI", "ML", "full-stack", "scalable", "AWS", "software engineer", "building AI solutions", "cross-functional teams", "system integration", "startup", "rapid development"
      ],
      "missing_keywords": [
        "state-of-the-art", "machine learning algorithms", "deep learning", "natural language processing", "computer vision", "data science", "business solutions", "client projects", "product development", "Agile", "deployment pipelines", "version control", "testing"
      ],
      "keyword_suggestions": {
        "state-of-the-art": "Describe projects using cutting-edge technologies or methodologies.",
        "machine learning algorithms": "Mention specific algorithms used in projects (e.g., linear regression, decision trees, etc.).",
        "deep learning": "If applicable, highlight experience with deep learning frameworks and techniques.",
        "natural language processing": "If relevant, add experience with NLP tasks and libraries.",
        "computer vision": "If applicable, mention experience with computer vision tasks and libraries.",
        "data science": "If relevant, mention experience in data collection, cleaning, analysis, and visualization.",
        "business solutions": "Highlight how your work has solved business problems or improved business processes.",
        "client projects": "Quantify the impact of your work on client projects.",
        "product development": "Describe your contributions to the product development lifecycle, from design to deployment.",
        "Agile": "Mention experience working in Agile environments and using Agile methodologies.",
        "deployment pipelines": "Describe experience setting up and managing deployment pipelines (CI/CD).",
        "version control": "Specify experience with Git, including branching strategies and collaboration techniques.",
        "testing": "Mention experience with different testing methodologies (unit, integration, end-to-end)."
      },
      "match_percentage": 57.89
    },
    "ats_score": 75,
    "recommendations": [
      "Rewrite the resume to incorporate the keyword suggestions and address the areas for improvement.",
      "Create a portfolio website to showcase projects and technical skills.",
      "Network with individuals at Krazimo to learn more about the role and company culture.",
      "Prepare for behavioral interview questions related to teamwork, problem-solving, and adaptability."
    ]
  }
}
    """
    # 1. Clean the raw text to remove problematic characters before sending to the LLM
    cleaned_text = re.sub(r'[♂⌢ὑ]', '', resume_text) # Remove specific unicode artifacts
    cleaned_text = re.sub(r'(\s*)/[a-zA-Z]+\^?[a-zA-Z]+(\s*)', ' ', cleaned_text) # Remove patterns like /githubGitHub
    cleaned_text = cleaned_text.replace('ὑ7', '') # Remove other artifacts

    # 2. Initialize the generator and get structured data
    # Make sure the path to your .tex template is correct
    generator = ResumeGenerator("C:\\Machine Learning\\my-email-generator\\backend\\app\\core\\resume_template.tex")
    
    review_json = json.loads(reviewstr)['review']
    resume_data = generator.get_data(cleaned_text, review_json)
    
    print("--- Structured Resume Data from LLM ---")
    print(resume_data)
    print("---------------------------------------")

    # 3. Generate the PDF
    pdf_path = generator.generate_resume(resume_data)
    print(f"✅ Resume generated successfully at: {pdf_path}")