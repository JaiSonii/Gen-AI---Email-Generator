EmailCraft AI - Frontend

This directory contains the frontend code for the EmailCraft AI application, built with Vite, React, and TypeScript. It provides a modern, responsive, and interactive user interface for generating AI-powered job outreach content.

✨ Features

    Step-by-Step Workflow: A guided, multi-step process for a smooth user experience.

    Futuristic UI: A unique and engaging user interface with custom animations and a dark, neon theme.

    Drag-and-Drop File Upload: Easy resume uploading.

    Dynamic Content Display: Renders generated emails, messages, and detailed resume analysis in a clear and organized manner.

    State Management with Context API: Centralized and predictable state management using React's useReducer and Context API.

    Client-Side Data Caching: Uses TanStack Query to manage API loading states and caching.

    Responsive Design: Fully responsive layout built with Tailwind CSS, ensuring usability across all devices.

🛠️ Tech Stack

    Framework: React

    Build Tool: Vite

    Language: TypeScript

    Styling: Tailwind CSS

    UI Components: shadcn/ui

    Routing: React Router

    State Management: React Context API (useReducer)

    Data Fetching: TanStack Query

    Linting: ESLint

🚀 Getting Started

Prerequisites

    Node.js and npm (or equivalent package manager)

    A running instance of the EmailCraft AI backend.

Installation & Setup

    Navigate to the frontend directory:
    Bash

cd frontend

Install dependencies:
Bash

npm install

Configure Environment Variables:
Create a .env.local file in the project root and specify the URL of the backend API.
Code snippet

    VITE_API_URL=http://localhost:5000/api

Available Scripts

    Run the development server:
    Bash

npm run dev

Build for production:
Bash

npm run build

Lint the codebase:
Bash

    npm run lint

📁 Project Structure

src
├── api/              # Functions for making API calls to the backend
├── components/       # Reusable UI components
│   ├── ui/           # shadcn/ui components
│   ├── WorkflowSteps/ # Components for each step of the user flow
│   └── ...
├── context/          # AppState management via React Context
├── hooks/            # Custom hooks (e.g., useToast)
├── lib/              # Utilities and type definitions
├── pages/            # Top-level page components
├── App.tsx           # Main application component with routing
└── main.tsx          # Application entry point

