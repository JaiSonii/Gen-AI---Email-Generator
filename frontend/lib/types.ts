
export interface Email {
  subject : string
  greeting : string
  body : string
  closing : string
  signature : string
}

export interface KeywordAnalysis{
  keyword: string
  present_in_resume : boolean
  suggestion : string
}

export interface Review {
  overall_summary : string
  strengths : string[]
  areas_for_improvement : string[]
  keyword_analysis : KeywordAnalysis[]
}