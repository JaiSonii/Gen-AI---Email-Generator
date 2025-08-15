from app.tools.jd_scraper import Scraper
from app.tools.jd_to_json import JD2JSON
from app.tools.linkedin import LinkedIn
from app.tools.resume_parser import ResumeParser
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from typing import Optional, Dict
from threading import Thread

class EmailGenerator:
    def __init__(self):
        self.scraper = Scraper()
        self.jd2json = JD2JSON()
        self.linkedin = LinkedIn()
        self.resume_parser = ResumeParser()
        self.llm = ChatGoogleGenerativeAI(model='gemini-1.5-flash')

    def _get_jd_json(self, jd_url: Optional[str], jd_text: Optional[str], result_holder: dict):
        """Processes either a JD URL or raw text to get JSON."""
        jd_content = None
        if jd_url:
            jd_content = self.scraper.scrape(jd_url)
        elif jd_text:
            jd_content = jd_text
        
        if jd_content:
            result_holder['jd_json'] = self.jd2json.convert(jd_content)
        else:
            result_holder['jd_json'] = {}

    def _scrape_linkedin(self, recruiter_url: str, result_holder: dict):
        """Scrapes LinkedIn profile."""
        recruiter_info = self.linkedin.search(recruiter_url)
        result_holder['recruiter_info'] = recruiter_info if recruiter_info else {}

    def _parse_resume(self, resume_path: str, result_holder: dict):
        """Parses the resume file."""
        resume_text = self.resume_parser.parse(resume_path)
        result_holder['resume_text'] = resume_text if resume_text else ""

    def craft_email(
        self,
        resume_text: str,
        job_description: str,
        recruiter_info: Optional[str] = None
    ) ->str:
        system_prompt = (
            "You are an expert career assistant. Given the provided context, "
            "curate a professional and concise email to the recruiter. "
            "Highlight the candidate's relevant experience from their resume "
            "and express genuine interest in the role."
        )
        
        human_prompt_parts = [
            "Job Description JSON:\n{jd_json}",
            "Resume:\n{resume_text}"
        ]
        
        input_data = {
            "jd_json": job_description,
            "resume_text": resume_text
        }

        if recruiter_info:
            human_prompt_parts.insert(1, "Recruiter Info:\n{recruiter_info}")
            input_data["recruiter_info"] = recruiter_info
        
        human_prompt = "\n\n".join(human_prompt_parts) + "\n\nGenerate the email below:"

        prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("human", human_prompt)
        ])
        
        chain = prompt | self.llm
        
        result = chain.invoke(input_data)
        
        return result.content if hasattr(result, "content") else str(result)

    def generate(
        self,
        resume_path: str,
        jd_url: Optional[str] = None,
        jd_text: Optional[str] = None,
        recruiter_url: Optional[str] = None
    ) -> str:
        if not jd_url and not jd_text:
            raise ValueError("Either a job description URL or text must be provided.")

        results = {}
        threads = []

        # Setup and start threads based on provided inputs
        jd_thread = Thread(target=self._get_jd_json, args=(jd_url, jd_text, results))
        threads.append(jd_thread)

        resume_thread = Thread(target=self._parse_resume, args=(resume_path, results))
        threads.append(resume_thread)

        if recruiter_url:
            linkedin_thread = Thread(target=self._scrape_linkedin, args=(recruiter_url, results))
            threads.append(linkedin_thread)
        
        for thread in threads:
            thread.start()

        for thread in threads:
            thread.join()

        # Get results, with defaults for missing data
        jd_json = results.get('jd_json', {})
        recruiter_info = results.get('recruiter_info', {})
        resume_text = results.get('resume_text', "")

        return self.craft_email(
            resume_text=resume_text,
            job_description=jd_json,
            recruiter_info=recruiter_info
        )

# Example usage:
if __name__ == "__main__":
    eg = EmailGenerator()
    resume_path = "C:\\Users\\jaius\\Downloads\\SDE.pdf" # Replace with your resume path

    # --- Example 1: With JD URL and Recruiter URL ---
    print("--- Generating Email (with JD URL and Recruiter URL) ---")
    email_1 = eg.generate(
        resume_path=resume_path,
        jd_url="https://www.linkedin.com/jobs/view/4271552272/",
        recruiter_url="https://www.linkedin.com/in/a-g-somaiah-00146952/"
    )
    print(email_1)

    # --- Example 2: With JD Text and NO Recruiter URL ---
    print("\n--- Generating Email (with JD Text, no Recruiter) ---")
    job_description_text = """
    Job Title: Senior Python Developer
    Company: InnovateTech
    Location: Remote
    We are looking for a Senior Python Developer with 5+ years of experience in building scalable web applications.
    Responsibilities: Design and implement backend services, work with databases, and collaborate with front-end developers.
    Key Qualifications: Proficiency in Python, Django/FastAPI, and PostgreSQL.
    """
    email_2 = eg.generate(
        resume_path=resume_path,
        jd_text=job_description_text
    )
    print(email_2)