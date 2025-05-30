export interface ResearchPaper {
  id: number
  title: string
  abstract: string
  year: number
  authors: string
  journal: string
  highlighted?: boolean
}

export interface InnovationReport {
  methodologyInnovation: {
    score: number
    description: string
  }
  theoreticalInnovation: {
    score: number
    description: string
  }
  applicationInnovation: {
    score: number
    description: string
  }
  overallInnovation: {
    score: number
    description: string
  }
} 