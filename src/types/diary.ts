export interface DiaryEntry {
  id: string
  title: string
  content: string | null
  date: string // ISO date string
  createdAt: string // ISO date string
  updatedAt: string // ISO date string
}

export interface DiaryData {
  entries: DiaryEntry[]
}
