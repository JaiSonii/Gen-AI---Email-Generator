from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from dotenv import load_dotenv
import os


from pydantic import BaseModel, Field
from typing import Literal

class JobListing(BaseModel):
    title: str = Field(..., description="The title of the job position.")
    level: Literal["Entry", "Mid", "Senior"] = Field(..., description="Seniority level of the job.")
    location: str = Field(..., description="The job's location.")
    description: str = Field(..., description="Overview of the role and company.")
    key_qualifications: str = Field(..., description="Required skills and experience.")
    preferred_qualifications: str = Field(..., description="Optional but desired qualifications.")
    responsibilities: str = Field(..., description="Primary duties and responsibilities.")
    company: str = Field(..., description="Name of the hiring company.")

SYSTEM_MESSAGE = """
You are an expert job description parser.

You will be provided with a raw job description as input. Your task is to extract key structured information and convert it into a strict JSON format following the specified schema.

Here is what each field means:
- title: The full title of the position (e.g., "Software Engineer", "Generative AI Specialist").
- level: The seniority level. Choose only one of: "Entry", "Mid", or "Senior". Guess based on years of experience and responsibility level.
- location: The primary location of the job (city, state, country).
- description: A high-level summary about the job and company.
- key_qualifications: All required experience, skills, and educational background.
- preferred_qualifications: Optional but preferred experience or skills.
- responsibilities: Key responsibilities or duties expected in this role.
- company: The name of the company hiring for this role.

Make sure:
- The JSON is strictly valid and fully conforms to the schema.
- All fields are filled accurately based on available content.
- If a field is not present in the job description, infer it intelligently or leave it empty.
- Do not include any extra commentary — just the JSON.

Respond only with the JSON object.
"""
""

class JD2JSON():
    def __init__(self, system_msg_str: str = SYSTEM_MESSAGE) -> None:
        load_dotenv()
        self.__llm = ChatGoogleGenerativeAI(model='gemini-2.0-flash', google_api_key=os.getenv('GOOGLE_API_KEY'))
        self._system_message_str = system_msg_str
        self.__parser = JsonOutputParser(pydantic_object=JobListing)
        self.__prompt_template: ChatPromptTemplate | None = None
        self.__chain = None

    def _create_prompt(self, system_message: str, human_message: str) -> ChatPromptTemplate:
        safe_format_instructions = self.__parser.get_format_instructions().replace("{", "{{").replace("}", "}}")
        
        return ChatPromptTemplate.from_messages(
            [
                ("system", system_message + "\n\n" + safe_format_instructions),
                ("human", human_message)
            ]
        )


    def __generate_chain(self, llm: ChatGoogleGenerativeAI, prompt: ChatPromptTemplate):
        return prompt | llm | self.__parser

    def convert(self, jd: str) -> JobListing:
        self.__prompt_template = self._create_prompt(self._system_message_str, jd)
        self.__chain = self.__generate_chain(self.__llm, self.__prompt_template)
        return self.__chain.invoke({})
    
if __name__ == '__main__':
    jd_2_json = JD2JSON(SYSTEM_MESSAGE)
    data = """
Skip to main content Generative AI Engineer Aiqwip Bengaluru, Karnataka, India Apply Generative AI Engineer Aiqwip Bengaluru, Karnataka, India 1 day ago Over 200 applicants See who Aiqwip has hired for this role Apply Save Report this job Job Title: Generative AI Engineer Relevant Experience: 1-3 years Location: Bangalore Job Type: Full-Time on site (5 Days Work From Office) Company Overview At Aiqwip, we are building full-stack applications powered by Agentic AI, multimodal agent frameworks, and real-world business logic. We take pride in building highly modular, elegant frontend systems that work seamlessly with intelligent backends to deliver world-class user experiences. Our focus is on exceptional software design, scalable architectures, and robust AI integrations that turn product visions into reality. With deep experience in analytics, data science, and frontend engineering, our team delivers cutting-edge experiences across enterprise and consumer interfaces. We’re looking for a generative AI engineer with a builder's mindset, ready to prototype quickly, iterate fast, and deliver results in a fast-paced startup environment. Responsibilities Develop, deploy, and maintain end-to-end Generative AI applications. Architect and implement intelligent agents using agentic frameworks. Build, debug, and maintain complex systems using industry best practices Fine-tune LLMs and optimize prompt engineering pipelines. Work closely with clients, internal teams and clients to gather requirements and deliver solutions Conduct code reviews, implement version control workflows, and contribute to DevOps pipelines. Continuously learn and contribute ideas to improve our tech and processes Stay up-to-date with emerging trends in Generative AI and apply them to solve practical problems. Experiment with cutting-edge Generative AI technologies. Must Have Skills Effective communication and collaboration skills Proficient in Python and its ecosystem for backend and AI development. Strong backend engineering using FastAPI or Django. Understanding of WebSocket communication and event-driven architectures. Experience working with LLMs and APIs from OpenAI (ChatGPT, GPT-4/4o), Azure OpenAI, Anthropic Claude, AWS Bedrock, and Groq. Familiarity with embedding models like OpenAI, Cohere Knowledge of LLM observability tools such as LangSmith. Experience with open-source LLMs like Mistral, LLaMA, Falcon, Mixtral, Yi, or Gemma. Strong grasp of Agentic AI architectures and hands-on experience with frameworks like LangChain, LangGraph, CrewAI Expertise in prompt engineering, including prompt chaining, template design (zero-shot, few-shot, chain-of-thought), and system prompts for multi-agent collaboration. Experience building RAG pipelines with vector databases such as Pinecone, Milvus, ChromaDB, FAISS Exposure to LLM fine-tuning, LoRA Proficiency in using Azure AI Services including Azure Document Intelligence and Azure OpenAI Studio. Working knowledge of Docker, Linux (Ubuntu), and remote development using SSH. Proficient with API documentation and testing tools such as Swagger/OpenAPI and Postman. Experience implementing real-world Generative AI use cases such as RAG-based agents, multi-agent Q&A systems, summarization, classification, document parsing, and semantic search. Strong debugging and problem-solving skills. Good to Have Skills Deep understanding of Azure cloud platform is a plus Ability to build simple frontend interfaces using React.js, HTML, CSS, Tailwind, or Next.js. Deployment experience using PM2, NGINX with Uvicorn or Gunicorn. Show more Show less Seniority level Entry level Employment type Full-time Job function Engineering and Information Technology Industries Software Development Referrals increase your chances of interviewing at Aiqwip by 2x See who you know Get notified when a new job is posted. Set alert Sign in to set job alerts for “Generative AI Engineer” roles. Sign in Welcome back "Show" "Show your LinkedIn password" "Hide" "Hide your LinkedIn password" "Please enter an email address or phone number" "Email or phone number must be between 3 to 128 characters" "Email or phone number must be between 3 to 128 characters" "Please enter a password" "The password you provided must have at least 6 characters" "The password you provided must have at most 400 characters" Email or phone Password Show Forgot password? Sign in or By clicking Continue to join or sign in, you agree to LinkedIn’s User Agreement , Privacy Policy , and Cookie Policy . New to LinkedIn? Join now or New to LinkedIn? Join now By clicking Continue to join or sign in, you agree to LinkedIn’s User Agreement , Privacy Policy , and Cookie Policy . "4278200847" "FJ1FlVuOiHi5vc1YAXoyjQ==" "https://www.linkedin.com/signup/cold-join?source=jobs_registration&session_redirect=https%3A%2F%2Fin.linkedin.com%2Fjobs%2Fview%2Fgenerative-ai-engineer-at-aiqwip-4278200847&trk=public_jobs_save-job" Similar jobs Software Engineer (Backend 3-5yrs) Software Engineer (Backend 3-5yrs) PhonePe Bengaluru, Karnataka, India 6 days ago Software Engineer Software Engineer Flipkart Bengaluru, Karnataka, India 6 days ago React JS Developer React JS Developer Infosys Bengaluru East, Karnataka, India 5 days ago Python Developer Python Developer Infosys Bengaluru East, Karnataka, India 5 days ago Node JS Developer Node JS Developer Infosys Bengaluru East, Karnataka, India 5 days ago React Front End Engineer React Front End Engineer Infosys Bengaluru East, Karnataka, India 5 days ago Software Developer Software Developer Oracle Bengaluru, Karnataka, India 1 day ago Easebuzz - Full Stack Developer - Python/React.js Easebuzz - Full Stack Developer - Python/React.js Easebuzz Bengaluru East, Karnataka, India 1 week ago Java Developer Java Developer Infosys Bengaluru East, Karnataka, India 5 days ago Software Engineer III, Full Stack, Google One Software Engineer III, Full Stack, Google One Google Bengaluru, Karnataka, India 4 days ago Java Developer Java Developer Infosys Bengaluru East, Karnataka, India 5 days ago Java Developer Java Developer Infosys Bengaluru East, Karnataka, India 5 days ago Python developer Python developer Infosys Bengaluru East, Karnataka, India 5 days ago Full Stack Engineer - Java & ReactJS Full Stack Engineer - Java & ReactJS Infosys Bengaluru East, Karnataka, India 5 days ago Python Developer Python Developer Infosys Bengaluru East, Karnataka, India 5 days ago Software Engineer (5-8yrs) Software Engineer (5-8yrs) PhonePe Bengaluru, Karnataka, India 1 week ago Java FullStack Developer (React JS) Java FullStack Developer (React JS) Infosys Bengaluru East, Karnataka, India 5 days ago Python Developer_Associate/Director_Software Engineering Python Developer_Associate/Director_Software Engineering Morgan Stanley Bengaluru, Karnataka, India 6 days ago Python Developer Python Developer Infosys Bengaluru East, Karnataka, India 5 days ago Java Developer Java Developer Persistent Systems Bengaluru, Karnataka, India 4 days ago Software Engineer III, Google Cloud Software Engineer III, Google Cloud Google Bengaluru, Karnataka, India 2 days ago Software Development Engineer- I Software Development Engineer- I Amazon Bengaluru, Karnataka, India 5 days ago Node Js Developer Node Js Developer Infosys Bengaluru East, Karnataka, India 5 days ago Java Developer Java Developer Infosys Bengaluru East, Karnataka, India 3 days ago Junior Java Springboot Developer Junior Java Springboot Developer Infosys Bengaluru East, Karnataka, India 5 days ago Software Engineer 2, Backend Software Engineer 2, Backend Intuit Bengaluru, Karnataka, India 1 day ago Software Development Engineer III Software Development Engineer III Flipkart Bengaluru, Karnataka, India 6 days ago Show more jobs like this Show fewer jobs like this People also viewed Frontend developer Intern Frontend developer Intern Flam Bengaluru, Karnataka, India 1 day ago React JS Consultant React JS Consultant Infosys Bengaluru East, Karnataka, India 5 days ago Software Engineer III, Full Stack, Google Cloud Software Engineer III, Full Stack, Google Cloud Google Bengaluru, Karnataka, India 1 day ago Software Engineer 2 Software Engineer 2 Intuit Bengaluru, Karnataka, India 1 week ago Software Developer Software Developer IBM Bengaluru, Karnataka, India 5 days ago PLSQL PLSQL Infosys Bengaluru East, Karnataka, India 5 days ago Node JS + React JS Developer Node JS + React JS Developer Infosys Bengaluru East, Karnataka, India 5 days ago Java Fullstack developer Java Fullstack developer Infosys Bengaluru East, Karnataka, India 5 days ago Java Developer Java Developer Infosys Bengaluru East, Karnataka, India 5 days ago React JS Consultant React JS Consultant Infosys Bengaluru East, Karnataka, India 5 days ago Explore collaborative articles We’re unlocking community knowledge in a new way. Experts add insights directly into each article, started with the help of AI. Explore More LinkedIn Know when new jobs open up Never miss a job alert with the new LinkedIn app for Windows. Get the app Agree & Join LinkedIn By clicking Continue to join or sign in, you agree to LinkedIn’s User Agreement , Privacy Policy , and Cookie Policy . false false false "control" true "en_US" Sign in to see who you already know at Aiqwip Sign in Welcome back "Show" "Show your LinkedIn password" "Hide" "Hide your LinkedIn password" "Please enter an email address or phone number" "Email or phone number must be between 3 to 128 characters" "Email or phone number must be between 3 to 128 characters" "Please enter a password" "The password you provided must have at least 6 characters" "The password you provided must have at most 400 characters" Email or phone Password Show Forgot password? Sign in or By clicking Continue to join or sign in, you agree to LinkedIn’s User Agreement , Privacy Policy , and Cookie Policy . New to LinkedIn? Join now or New to LinkedIn? Join now By clicking Continue to join or sign in, you agree to LinkedIn’s User Agreement , Privacy Policy , and Cookie Policy . LinkedIn LinkedIn is better on the app Don’t have the app? Get it in the Microsoft Store. Open the app false "in" "d_jobs_guest_details"
"""
    result = jd_2_json.convert(data)
    print(result)
        