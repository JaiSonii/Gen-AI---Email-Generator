from langchain_brightdata import BrightDataWebScraperAPI
from dotenv import load_dotenv
import os
from typing import Dict
import json

load_dotenv()

class LinkedIn:
    def __init__(self):
        self.wrapper: BrightDataWebScraperAPI | None = self.__get_wrapper()
        
    
    def __get_wrapper(self) -> BrightDataWebScraperAPI | None:
        key = os.getenv('BRIGHT_DATA_API_KEY')
        if not key:
            return None
        from pydantic import SecretStr
        return BrightDataWebScraperAPI(bright_data_api_key=SecretStr(key))
        
    def search(self, profile_link : str):
        """Fetch the details of the linkedIN profile and extract important information for LLM"""
        if not self.wrapper or not profile_link:
            print(f"Cant Search , Wrapper {self.wrapper}, profile_url : {profile_link}")
            return
        args = {
            "url": profile_link,
            "dataset_type": "linkedin_person_profile",
        }
        try:
            linkedin_results = self.wrapper.invoke(args)
            # with open('result.json' , 'w') as f:
            #     f.write(json.dumps(linkedin_results))
            # f.close()
            summary = self._compile_summary(linkedin_results)
            return summary
        except Exception as e:
            print(f'Error Occuered while searching for linkedIN profile : {e}')
            return {}
    
    def _compile_summary(self, summary: Dict):
        if not summary:
            return None

        experiences = summary.get('experience', [])
        current_experience = experiences[0] if experiences else {}

        final_summary = {
            "name": summary.get('name'),
            "profile_heading": summary.get('position'),
            "location": summary.get('location'),
            "about": summary.get('about'),
            "current_company": current_experience.get('company_name'),
            "current_role": current_experience.get('position'),
            # Adding enhanced fields
            "education": summary.get('education', []), # List of educational institutions
            "recent_activity": summary.get('posts', [])[:2], # Get the 2 most recent posts
            "past_companies": [exp.get('company_name') for exp in experiences[1:]] # List of previous companies
        }
        
        return {k: v for k, v in final_summary.items() if v}
          
if __name__ == "__main__":
    url =  "https://www.linkedin.com/in/jai-soni-879764257/"
    serach_tool = LinkedIn()
    linked_res = None
    with open('result.json', 'r') as f:
        linked_res = json.loads(f.read())
    f.close()
    res = serach_tool._compile_summary(linked_res)
    print(res)