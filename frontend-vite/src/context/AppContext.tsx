import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppState, GeneratorType } from '../lib/types';

// Initial state
const initialState: AppState = {
  currentGenerator: null,
  currentStep: 0,
  resumeFile: null,
  resumeText: '',
  jobDescriptionInput: '',
  jobDescriptionJSON: '',
  contactInfo: '',
  generatedContent: null,
  resumeReview: null,
  isLoading: false,
  error: null,
};

// Action types
export type AppAction =
  | { type: 'SET_GENERATOR'; payload: GeneratorType }
  | { type: 'SET_STEP'; payload: number }
  | { type: 'SET_RESUME_FILE'; payload: File }
  | { type: 'SET_RESUME_TEXT'; payload: string }
  | { type: 'SET_JOB_DESCRIPTION_INPUT'; payload: string }
  | { type: 'SET_JOB_DESCRIPTION_JSON'; payload: string }
  | { type: 'SET_CONTACT_INFO'; payload: string }
  | { type: 'SET_GENERATED_CONTENT'; payload: any }
  | { type: 'SET_RESUME_REVIEW'; payload: any }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_STATE' }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' };

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_GENERATOR':
      return { ...state, currentGenerator: action.payload, currentStep: 1 };
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    case 'SET_RESUME_FILE':
      return { ...state, resumeFile: action.payload };
    case 'SET_RESUME_TEXT':
      return { ...state, resumeText: action.payload };
    case 'SET_JOB_DESCRIPTION_INPUT':
      return { ...state, jobDescriptionInput: action.payload };
    case 'SET_JOB_DESCRIPTION_JSON':
      return { ...state, jobDescriptionJSON: action.payload };
    case 'SET_CONTACT_INFO':
      return { ...state, contactInfo: action.payload };
    case 'SET_GENERATED_CONTENT':
      return { ...state, generatedContent: action.payload };
    case 'SET_RESUME_REVIEW':
      return { ...state, resumeReview: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'NEXT_STEP':
      return { ...state, currentStep: state.currentStep + 1 };
    case 'PREV_STEP':
      return { ...state, currentStep: Math.max(0, state.currentStep - 1) };
    case 'RESET_STATE':
      return initialState;
    default:
      return state;
  }
}

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}