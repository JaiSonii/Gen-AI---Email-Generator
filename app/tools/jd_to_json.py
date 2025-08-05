from app.tools.jd_scraper import Scraper
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv
import os

SYSTEM_MESSAGE=""""""
HUMAN_MESSAGE=""""""

class JD2JSON():
    def __init__(self, system_msg_str : str) -> None:
        load_dotenv()
        self.__llm = ChatGoogleGenerativeAI(model='gemini-1.5-flash', google_api_key=os.getenv('GOOGLE_API_KEY'))
        self.__prompt_template: ChatPromptTemplate | None = None
        self._system_message_str = system_msg_str
        self.__chain = None
        
    def _create_prompt(self, system_message: str, human_message: str) -> ChatPromptTemplate:
        return ChatPromptTemplate(
            [
                ('system', system_message),
                ('human', human_message)
            ]
        )
        
    def __generate_chain(self, llm : ChatGoogleGenerativeAI, prompt: ChatPromptTemplate):
        chain = prompt | llm
        return chain
            
    def convert(self, jd : str):
        self.__prompt_template = self._create_prompt(self._system_message_str, jd)
        self.__chain = self.__generate_chain(self.__llm, self.__prompt_template)
        