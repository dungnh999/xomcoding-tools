export type Pricing = 'free' | 'freemium' | 'paid'

export type Status = 'active' | 'inactive' | 'unknown'

export interface Tool {
  id: string
  name: string
  nameEn?: string
  nameVi?: string
  slug: string
  category: string
  shortDescription: string
  shortDescriptionEn?: string
  shortDescriptionVi?: string
  description: string
  descriptionEn?: string
  descriptionVi?: string
  icon: string
  website: string
  github: string | null
  pricing: Pricing
  openSource: boolean
  status: Status
  lastChecked: string | null
  xomcodingUrl: string | null
  tags: string[]
}

export interface Category {
  id: string
  name: string
  nameEn?: string
  nameVi?: string
  icon: string
  order: number
}

export interface GeneratedStatus {
  status: Status
  lastChecked: string | null
  httpStatus: number | null
}

export type GeneratedStatusMap = Record<string, GeneratedStatus>
