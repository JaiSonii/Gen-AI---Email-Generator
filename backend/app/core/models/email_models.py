from pydantic import BaseModel, Field
from typing import List, Union, Dict

# --- Core Data Structures ---

class StructuredEmail(BaseModel):
    """Defines the structure for a professional email."""
    subject: str = Field(description="A compelling and professional subject line for the email.")
    greeting: str = Field(description="A professional greeting, personalized with the recruiter's name if available (e.g., 'Dear Mr. Somaiah,').")
    body: str = Field(description="The main content of the email. It should be a single string with paragraphs separated by newline characters (\\n).")
    closing: str = Field(description="A professional closing phrase, such as 'Sincerely' or 'Best regards'.")
    signature: str = Field(description="The candidate's full name.")

class StructuredLinkedInMessage(BaseModel):
    """Defines the structure for a professional LinkedIn message."""
    greeting: str = Field(description="A professional greeting for a direct message, personalized if the recipient's name is available (e.g., 'Hi Mr. Somaiah,').")
    body: str = Field(description="The main content of the message. It should be a single string with paragraphs separated by newline characters (\\n).")
    closing: str = Field(description="A professional closing phrase, such as 'Best regards' or 'Thank you'.")
    signature: str = Field(description="The candidate's full name.")

# --- Updated Review and Keyword Analysis Models ---

class KeywordAnalysis(BaseModel):
    """
    Provides a detailed analysis of keywords from the job description
    against the resume.
    """
    matched_keywords: List[str] = Field(description="A list of keywords from the job description that were found in the resume.")
    missing_keywords: List[str] = Field(description="A list of important keywords from the job description that were not found in the resume.")
    keyword_suggestions: Dict[str, str] = Field(description="A dictionary where keys are missing keywords and values are suggestions on how to incorporate them.")
    match_percentage: float = Field(description="The percentage of job description keywords found in the resume.")


class StructuredReview(BaseModel):
    """Defines the structure for a comprehensive resume review based on a job description."""
    overall_summary: str = Field(description="A brief, high-level summary of the resume's alignment with the job description.")
    strengths: List[str] = Field(description="A list of specific positive aspects of the resume concerning the job role.")
    areas_for_improvement: List[str] = Field(description="A list of actionable suggestions for enhancing the resume's impact.")
    keyword_analysis: KeywordAnalysis = Field(description="A detailed analysis of crucial keywords from the job description against the resume.")
    ats_score: int = Field(description="An estimated Applicant Tracking System (ATS) compatibility score out of 100.", ge=0, le=100)
    recommendations: List[str] = Field(description="A list of concrete next-step recommendations for the candidate.")


# --- Main Response Schemas ---

class EmailAndReview(BaseModel):
    """The main Pydantic model to structure the final JSON output for email generation."""
    email: StructuredEmail = Field(description="The crafted professional email, broken down into its components.")
    review: StructuredReview = Field(description="A structured review of the resume with actionable suggestions to improve it for the job description.")

class ReferralAndReview(BaseModel):
    """The main Pydantic model to structure the final JSON output for referral messages."""
    referral_message: Union[StructuredEmail, StructuredLinkedInMessage] = Field(
        description="The crafted professional referral message. Use StructuredEmail for 'email' requests and StructuredLinkedInMessage for 'linkedin message' requests."
    )
    review: StructuredReview = Field(description="A structured review of the resume with actionable suggestions to improve it for the job description.")

