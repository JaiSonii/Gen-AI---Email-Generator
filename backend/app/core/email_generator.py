import json
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser

from app.tools.jd_scraper import Scraper
from app.tools.jd_to_json import JD2JSON
from app.tools.linkedin import LinkedIn
from app.tools.resume_parser import ResumeParser

from app.core.models.email_models import EmailAndReview, ReferralAndReview

from typing import Optional, Dict, List
from threading import Thread


class EmailGenerator:
    def __init__(self):
        self.scraper = Scraper()
        self.jd2json = JD2JSON()
        self.linkedin = LinkedIn()
        self.resume_parser = ResumeParser()
        self.llm = ChatGoogleGenerativeAI(model='gemini-1.5-flash')
        self.__email_parser = JsonOutputParser(pydantic_object=EmailAndReview)
        self.__referral_parser = JsonOutputParser(pydantic_object=ReferralAndReview)

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
    ) -> Dict: # Return a dictionary for easier processing
        """Crafts a professional email and reviews the resume based on the job description."""

        prompt = ChatPromptTemplate.from_messages([
            ("system", 
             "You are an expert career assistant and resume reviewer. "
             "Given the job description, recruiter profile (if any), and resume, "
             "1. Curate a professional and concise email to the recruiter, highlighting the candidate's relevant experience and expressing genuine interest in the role. "
             "2. Review the resume and provide actionable suggestions to improve it for this job, including missing skills, keywords, or experiences that should be highlighted."
             "You must follow the provided JSON format instructions."
             ),
            ("human", 
             "{format_instructions}\n\n"
             "Job Description JSON:\n{jd_json}\n\n"
             "Resume:\n{resume_text}\n\n"
             "{recruiter_block}"
             )
        ])
        
        input_data = {
            "jd_json": job_description,
            "resume_text": resume_text,
            "recruiter_block": f"Recruiter Info:\n{recruiter_info}" if recruiter_info else "",
            "format_instructions": self.__email_parser.get_format_instructions()
        }

        chain = prompt | self.llm | self.__email_parser
        result = chain.invoke(input_data)
        
        return result

    def craft_referral(
        self,
        resume_text: str,
        job_description: str,
        recruiter_info: Optional[str] = None,
        message_type: str = "linkedin message", # or "email"
    ) -> Dict:
        """Crafts a linkedin referral message or email based on the job description and resume, and optionally recruiter info or employee info."""
        
        # (Optional but good practice) Add a helper for grammar
        display_message_type = "an email" if "email" in message_type.lower() else "a LinkedIn message"

        prompt = ChatPromptTemplate.from_messages([
            ("system",
            "You are an expert career assistant helping a job applicant. "
            "Your task is to generate a **referral request** and a resume review based on the provided documents.\n\n"
            
            "⚠️ IMPORTANT CLARIFICATION:\n"
            "- You are **not writing a recommendation letter.**\n"
            "- You are writing a **referral request written BY the applicant, in the first person** (e.g., 'I am reaching out to ask...').\n"
            "- The applicant is politely asking someone else for help with a referral.\n\n"

            "1. **Draft {display_message_type} on behalf of the applicant to send.** "
            "This message MUST be written strictly in the **first person**. "
            "It should be professional, concise, and sound like the applicant is requesting help. "
            "Adhere to the correct format for the message type; for example, an 'email' requires a subject line.\n\n"

            "✅ Example (Correct - first person referral request):\n"
            "  'Hi [Name], I hope you're doing well. I came across a role at [Company] that strongly aligns with my background, "
            "and I wanted to ask if you’d be open to referring me.'\n\n"

            "❌ Example (Incorrect - third person recommendation):\n"
            "  'I am writing to recommend Jai for this position...' (DO NOT write like this.)\n\n"

            "2. **Review the applicant's resume.** Provide detailed, actionable suggestions to better tailor it for this job.\n\n"
            "You must strictly follow the provided JSON format instructions."
            ),
            ("human",
            "{format_instructions}\n\n"
            "Job Description JSON:\n{jd_json}\n\n"
            "Resume:\n{resume_text}\n\n"
            "{recruiter_block}"
            )
        ])
        input_data = {
            "jd_json": job_description,
            "resume_text": resume_text,
            "recruiter_block": f"Contact Info (for referral):\n{recruiter_info}" if recruiter_info else "",
            "format_instructions": self.__referral_parser.get_format_instructions(),
            "display_message_type": display_message_type 
        }

        chain = prompt | self.llm | self.__referral_parser
        result = chain.invoke(input_data)
        return result

    def generate(
        self,
        resume_path: str,
        jd_url: Optional[str] = None,
        jd_text: Optional[str] = None,
        recruiter_url: Optional[str] = None
    ) -> Dict: # Return a dictionary
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

        return self.craft_referral(
            resume_text=resume_text,
            job_description=jd_json,
            recruiter_info=recruiter_info
        )

# Example usage:
if __name__ == "__main__":
    eg = EmailGenerator()
    resume_path = "C:\\Users\\jaius\\Downloads\\SDE.pdf" # Replace with your resume path

    # --- Example: With JD Text and NO Recruiter URL ---
    print("\n--- Generating Email (with JD Text, no Recruiter) ---")
    job_description_text = """
    Job Title: Senior Python Developer
    Company: InnovateTech
    Location: Remote
    We are looking for a Senior Python Developer with 5+ years of experience in building scalable web applications.
    Responsibilities: Design and implement backend services, work with databases, and collaborate with front-end developers.
    Key Qualifications: Proficiency in Python, Django/FastAPI, and PostgreSQL.
    """
    structured_output = eg.generate(
        resume_path=resume_path,
        jd_text=job_description_text
    )
    
    # Use json.dumps to pretty-print the structured JSON output
    print(json.dumps(structured_output, indent=2))