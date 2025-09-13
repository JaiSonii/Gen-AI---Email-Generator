from typing import List, Optional
from pydantic import BaseModel, HttpUrl, EmailStr, Field


class ExperienceItem(BaseModel):
    role: str = Field(..., description="Job title or role, e.g., 'Software Engineer'")
    company: str = Field(..., description="Company name, e.g., 'FOG Technologies'")
    link: Optional[HttpUrl] = Field(None, description="Company or project link")
    location: Optional[str] = Field(None, description="Location of the job")
    date: str = Field(..., description="Date range, e.g., 'Feb 2025 -- Present'")
    bullets: List[str] = Field(..., description="List of achievements/responsibilities")


class ProjectItem(BaseModel):
    title: str = Field(..., description="Project title, e.g., 'GenAI Email Generator'")
    subtitle: Optional[str] = Field(None, description="One-line project description")
    date: Optional[str] = Field(None, description="Date range")
    bullets: List[str] = Field(..., description="Key contributions/achievements")


class EducationItem(BaseModel):
    institution: str = Field(..., description="Institution name")
    degree: str = Field(..., description="Degree obtained")
    grade: Optional[str] = Field(None, description="GPA or percentage")
    date: str = Field(..., description="Date range, e.g., '2021 -- 2025'")


class Resume(BaseModel):
    """
    Schema for structured resume generation.

    ⚡ NOTE: No raw LaTeX here.
    We'll render LaTeX later from this structured data.
    """

    # --- Header Section ---
    name: str = Field(..., description="Full name of the candidate. Maps to <NAME>.")
    phone: str = Field(..., description="Phone number. Maps to <PHONE>.")
    email: EmailStr = Field(..., description="Email address. Maps to <EMAIL>.")
    github: Optional[str] = Field(None, description="GitHub profile URL. Maps to <GITHUB>.")
    linkedin: Optional[str] = Field(None, description="LinkedIn profile URL. Maps to <LINKEDIN>.")
    leetcode: Optional[str] = Field(None, description="LeetCode profile URL. Maps to <LEETCODE>.")

    # --- Summary ---
    summary: str = Field(..., description="One or two line professional summary. Maps to <SUMMARY>.")

    # --- Skills Section ---
    skills: List[str] = Field(..., description="List of technical skills (plain text, not LaTeX).")

    # --- Experience Section ---
    experience: List[ExperienceItem] = Field(..., description="Work experience entries.")

    # --- Projects Section ---
    projects: List[ProjectItem] = Field(..., description="Project entries.")

    # --- Education Section ---
    education: List[EducationItem] = Field(..., description="Education entries.")
