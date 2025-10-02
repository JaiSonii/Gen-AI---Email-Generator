EmailCraft AI - AI-Powered Job Search Outreach

EmailCraft AI is a full-stack web application designed to revolutionize the job search process. It leverages the power of Generative AI to analyze a user's resume against a specific job description, generating personalized and effective outreach content such as cold emails, LinkedIn messages, and referral requests.

✨ Key Features

    AI-Powered Content Generation: Creates compelling cold emails, LinkedIn messages, and referral requests tailored to a specific job role.

    Resume Analysis: Parses PDF resumes to extract key skills, experiences, and achievements.

    Job Description Parsing: Scrapes and analyzes job descriptions from URLs or raw text to identify key requirements and keywords.

    In-depth Resume Review: Provides an ATS compatibility score, keyword analysis (matched vs. missing), and actionable recommendations to improve the user's resume for the target role.

    Interactive Workflow: A seamless, multi-step user interface guides the user through the process of uploading their resume, providing job details, and receiving the generated content.

    Futuristic & Responsive UI: A modern, responsive frontend built with React, TypeScript, and Tailwind CSS for a great user experience on any device.

🛠️ Technology Stack

The project is a monorepo with a separate frontend and backend.
Area	Technology
Frontend	React, Vite, TypeScript, Tailwind CSS, shadcn/ui, TanStack Query
Backend	Python, FastAPI, LangChain, Google Gemini, Selenium, BeautifulSoup
Deployment	Uvicorn (for backend), Static Hosting (for frontend)

🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

Prerequisites

    Node.js and npm (or yarn/pnpm)

    Python 3.9+ and pip

    Google Chrome (for Selenium)

1. Clone the Repository

Bash

git clone <your-repository-url>
cd <your-repository-folder>

2. Backend Setup

First, navigate to the backend directory (assuming it's named backend).
Bash

cd backend

    Create a Virtual Environment:
    Bash

python -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`

Install Dependencies:
Bash

pip install -r requirements.txt

Set Up Environment Variables:
Create a .env file in the backend directory by copying the example:
Bash

cp .env.example .env

Now, edit the .env file and add your API keys:

SERPAPI_API_KEY="Your key"
BRIGHT_DATA_API_KEY="Your key"
GOOGLE_API_KEY="Your Google Gemini API Key"

Run the Backend Server:
Bash

    uvicorn app.main:create_app --host 127.0.0.1 --port 5000 --reload

    The backend API will now be running at http://127.0.0.1:5000.

3. Frontend Setup

In a new terminal, navigate to the frontend directory (assuming it's named frontend).
Bash

cd frontend

    Install Dependencies:
    Bash

npm install

Set Up Environment Variables:
Create a .env.local file in the frontend root directory. Add the following line to point to your running backend API:

VITE_API_URL=http://127.0.0.1:5000/api

Run the Frontend Development Server:
Bash

npm run dev

The application will be available at http://localhost:8080 (or another port if 8080 is busy).