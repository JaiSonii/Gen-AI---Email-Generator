from langchain_community.document_loaders import PyPDFLoader

class ResumeParser:
    def __init__(self):
        pass
    
    def parse(self, path: str)->str | None:
        if not path:
            print("No Path specifided cannot parse")
            return None
        loader = PyPDFLoader(path)
        pages = loader.load()
        resume_content = ""
        for page in pages:
            resume_content += page.page_content
        return resume_content