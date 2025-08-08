from app.tools.jd_scraper import Scraper
from app.tools.jd_to_json import JD2JSON
from app.tools.linkedin import LinkedIn
from app.tools.resume_parser import ResumeParser
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from typing import Optional

from threading import Thread

from app.tools.jd_scraper import Scraper
from app.tools.jd_to_json import JD2JSON
from app.tools.linkedin import LinkedIn
from app.tools.resume_parser import ResumeParser
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from typing import Optional

from threading import Thread

class EmailGenerator:
    def __init__(self):
        self.scraper = Scraper()
        self.jd2json = JD2JSON()
        self.linkedin = LinkedIn()
        self.resume_parser = ResumeParser()
        self.llm = ChatGoogleGenerativeAI(model='gemini-2.5-flash')

    def scrape_jd(self, url: str, result_holder: dict):
        scrape_res = self.scraper.scrape(url)
        jd_json = self.jd2json.convert(scrape_res)
        result_holder['jd_json'] = jd_json

    def scrape_linkedin(self, recruiter_url: str, result_holder: dict):
        recruiter_info = self.linkedin.search(recruiter_url)
        result_holder['recruiter_info'] = recruiter_info

    def parse_resume(self, resume_path: str, result_holder: dict):
        resume_text = self.resume_parser.parse(resume_path)
        result_holder['resume_text'] = resume_text

    def generate(self, url: str, recruiter_url: str, resume_path: str) -> str:
        results = {}

        # Create threads
        jd_thread = Thread(target=self.scrape_jd, args=(url, results))
        linkedin_thread = Thread(target=self.scrape_linkedin, args=(recruiter_url, results))
        resume_thread = Thread(target=self.parse_resume, args=(resume_path, results))

        # Start threads
        jd_thread.start()
        linkedin_thread.start()
        resume_thread.start()

        # Wait for all threads to finish
        jd_thread.join()
        linkedin_thread.join()
        resume_thread.join()

        # Get results
        jd_json = results.get('jd_json', {})
        recruiter_info = results.get('recruiter_info', {})
        resume_text = results.get('resume_text', "")

        # 1. Define the prompt with placeholders, NOT an f-string
        prompt = ChatPromptTemplate.from_messages([
            ("system",
             "You are an expert career assistant. "
             "Given the job description, recruiter profile, and resume, "
             "curate a professional email for the user to send to the recruiter. "
             "The email should be concise, highlight relevant experience, and express interest in the role."),
            ("human",
             "Job Description JSON:\n{jd_json}\n\n"
             "Recruiter Info:\n{recruiter_info}\n\n"
             "Resume:\n{resume_text}\n\n"
             "Generate the email below:")
        ])
        
        chain = prompt | self.llm
        
        # 2. Pass a dictionary with the data to the invoke method
        input_data = {
            "jd_json": jd_json,
            "recruiter_info": recruiter_info,
            "resume_text": resume_text
        }
        result = chain.invoke(input_data)
        
        return result.content if hasattr(result, "content") else result
    

# Example usage:
if __name__ == "__main__":
    eg = EmailGenerator()
    jd_url = "https://www.linkedin.com/jobs/view/4271552272/"
    recruiter_url = "https://www.linkedin.com/in/a-g-somaiah-00146952/"
    resume_path = "C:\\Users\\jaius\\Downloads\\SDE.pdf"
    email = eg.generate(jd_url, recruiter_url, resume_path)
    print(email)