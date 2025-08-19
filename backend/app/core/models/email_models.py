from pydantic import BaseModel, Field
from typing import List, Union

class StructuredEmail(BaseModel):
    """Defines the structure for a professional email."""
    subject: str = Field(description="A compelling and professional subject line for the email.")
    greeting: str = Field(description="A professional greeting, personalized with the recruiter's name if available (e.g., 'Dear Mr. Somaiah,').")
    body: str = Field(description="The main content of the email. It should be a single string with paragraphs separated by newline characters (\\n).")
    closing: str = Field(description="A professional closing phrase, such as 'Sincerely' or 'Best regards'.")
    signature: str = Field(description="The candidate's full name.")

class KeywordAnalysis(BaseModel):
    """Analyzes the presence of a specific keyword in the resume."""
    keyword: str = Field(description="A key skill or qualification mentioned in the job description.")
    present_in_resume: bool = Field(description="A boolean indicating if the keyword is found in the resume.")
    suggestion: str = Field(description="Actionable advice on how to incorporate the keyword if missing, or how to better highlight it if present.")

class StructuredReview(BaseModel):
    """Defines the structure for a comprehensive resume review."""
    overall_summary: str = Field(description="A brief, high-level summary of the resume's alignment with the job description.")
    strengths: List[str] = Field(description="A list of specific positive aspects of the resume concerning the job role.")
    areas_for_improvement: List[str] = Field(description="A list of actionable suggestions for enhancing the resume's impact.")
    keyword_analysis: List[KeywordAnalysis] = Field(description="A detailed analysis of crucial keywords from the job description against the resume.")

class StructuredLinkedInMessage(BaseModel):
    """Defines the structure for a professional LinkedIn message."""
    greeting: str = Field(description="A professional greeting for a direct message, personalized if the recipient's name is available (e.g., 'Hi Mr. Somaiah,').")
    body: str = Field(description="The main content of the message. It should be a single string with paragraphs separated by newline characters (\\n).")
    closing: str = Field(description="A professional closing phrase, such as 'Best regards' or 'Thank you'.")
    signature: str = Field(description="The candidate's full name.")

class EmailAndReview(BaseModel):
    """The main Pydantic model to structure the final JSON output."""
    email: StructuredEmail = Field(description="The crafted professional email, broken down into its components.")
    review: StructuredReview = Field(description="A structured review of the resume with actionable suggestions to improve it for the job description.")

class ReferralAndReview(BaseModel):
    """The main Pydantic model to structure the final JSON output."""
    referral_message: Union[StructuredEmail, StructuredLinkedInMessage] = Field(
        description="The crafted professional referral message. Use the StructuredEmail format if the request is for an 'email', and use the StructuredLinkedInMessage format if the request is for a 'linkedin message'."
    )
    review: StructuredReview = Field(description="A structured review of the resume with actionable suggestions to improve it for the job description.")