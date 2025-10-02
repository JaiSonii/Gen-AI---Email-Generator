EmailCraft AI - Backend

This directory contains the backend server for EmailCraft AI. It's a powerful API built with Python and FastAPI that leverages LangChain and Google's Gemini Pro model to perform all the core AI-driven tasks.

✨ Features

    RESTful API: A clean and well-documented API built with FastAPI.

    AI-Powered Content Generation: Integrates with Google Gemini via LangChain to craft personalized emails and referral messages.

    Structured AI Output: Uses Pydantic models to ensure the LLM provides reliable, structured JSON output for emails and resume reviews.

    Resume Parsing: Processes uploaded PDF resumes to extract raw text content for analysis.

    Web Scraping:

        Uses BeautifulSoup and Selenium to scrape job description content from URLs.

        Uses BrightData to scrape LinkedIn profile information.

    Asynchronous Processing: Key I/O-bound tasks are handled to improve performance.

🛠️ Tech Stack

    Framework: FastAPI

    Language: Python

    AI/LLM Orchestration: LangChain

    LLM Provider: Google Gemini

    Web Scraping: Selenium, BeautifulSoup, BrightData

    PDF Processing: PyPDF

    Server: Uvicorn

    Data Validation: Pydantic

🚀 Getting Started

Prerequisites

    Python 3.9+ and pip

    A virtual environment tool (like venv)

Installation & Setup

    Navigate to the backend directory:
    Bash

cd backend

Create and activate a virtual environment:
Bash

python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

Install dependencies:
Bash

pip install -r requirements.txt

Configure Environment Variables:
Create a .env file by copying the example file:
Bash

cp .env.example .env

Open the .env file and add your secret API keys:
Code snippet

    SERPAPI_API_KEY="Your SerpAPI key (if needed)"
    BRIGHT_DATA_API_KEY="Your BrightData API key for LinkedIn scraping"
    GOOGLE_API_KEY="Your Google Gemini API Key"

Running the Server

    Start the development server with auto-reload:
    Bash

    uvicorn app.main:create_app --host 127.0.0.1 --port 5000 --reload

    The API will be available at http://127.0.0.1:5000.

    API Documentation:
    Once running, interactive API documentation (Swagger UI) is available at http://127.0.0.1:5000/docs.

📁 API Endpoints

Health Check

    GET /api/health: Checks if the API is running.

Version 1 (v1)

    POST /api/v1/jd-from-url: Scrapes a job description from a URL and returns structured JSON.

    POST /api/v1/jd-from-text: Converts raw job description text to structured JSON.

    POST /api/v1/resume: Parses a PDF resume and returns the extracted text.

    POST /api/v1/generate-referral: Generates a referral message (email or LinkedIn) and a resume review.

    POST /api/v1/linkedin: (Potentially for direct LinkedIn scraping) Searches for a recruiter profile.

    POST /api/v1/generate-email: (Deprecated) An older version of the email generation endpoint.

Version 2 (v2)

    POST /api/v2/generate-email: The primary endpoint for generating a cold outreach email and a detailed resume review. Expects resume text, JD JSON, and optional contact info.