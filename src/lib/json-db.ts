import fs from 'fs/promises'
import path from 'path'
import { DiaryEntry, DiaryData } from '@/types/diary'

const DATA_FILE_PATH = path.join(process.cwd(), 'src/data/diary-entries.json')

// Função para gerar IDs únicos simples
function generateId(): string {
  return `entry-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
}

// Ler dados do arquivo JSON
export async function readData(): Promise<DiaryData> {
  try {
    const fileContent = await fs.readFile(DATA_FILE_PATH, 'utf-8')
    return JSON.parse(fileContent)
  } catch (error) {
    console.error('Error reading data:', error)
    // Se o arquivo não existir, retorna estrutura vazia
    return { entries: [] }
  }
}

// Escrever dados no arquivo JSON
export async function writeData(data: DiaryData): Promise<void> {
  try {
    // Garante que o diretório existe
    await fs.mkdir(path.dirname(DATA_FILE_PATH), { recursive: true })
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8')
  } catch (error) {
    console.error('Erro ao escrever dados:', error)
    throw error
  }
}

// Buscar todas as entradas
export async function getAllEntries(): Promise<DiaryEntry[]> {
  const data = await readData()
  return data.entries.sort((a, b) => new Date(b.date)
    .getTime() - new Date(a.date).getTime())
}

// Buscar entrada por ID
export async function getEntryById(id: string): Promise<DiaryEntry | null> {
  const data = await readData()
  return data.entries.find(entry => entry.id === id) || null
}

// Buscar entradas por data
export async function getEntriesByDate(date: Date): Promise<DiaryEntry[]> {
  const data = await readData()
  const targetDateStr = date.toISOString().split('T')[0] // YYYY-MM-DD

  return data.entries
    .filter(entry => {
      const entryDateStr = new Date(entry.date).toISOString().split('T')[0]
      return entryDateStr === targetDateStr
    })
    .sort((a, b) => new Date(b.createdAt)
      .getTime() - new Date(a.createdAt).getTime())
}

// Criar nova entrada
export async function createEntry(entryData: Omit<DiaryEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<DiaryEntry> {
  const data = await readData()
  const now = new Date().toISOString()

  const newEntry: DiaryEntry = {
    id: generateId(),
    ...entryData,
    createdAt: now,
    updatedAt: now
  }

  data.entries.push(newEntry)
  await writeData(data)

  return newEntry
}

// Atualizar entrada existente
export async function updateEntry(id: string, entryData: Partial<Omit<DiaryEntry, 'id' | 'createdAt'>>): Promise<DiaryEntry | null> {
  const data = await readData()
  const entryIndex = data.entries.findIndex(entry => entry.id === id)

  if (entryIndex === -1) {
    return null
  }

  const updatedEntry: DiaryEntry = {
    ...data.entries[entryIndex],
    ...entryData,
    updatedAt: new Date().toISOString()
  }

  data.entries[entryIndex] = updatedEntry
  await writeData(data)

  return updatedEntry
}

// Deletar entrada
export async function deleteEntry(id: string): Promise<boolean> {
  const data = await readData()
  const entryIndex = data.entries.findIndex(entry => entry.id === id)

  if (entryIndex === -1) {
    return false
  }

  data.entries.splice(entryIndex, 1)
  await writeData(data)

  return true
}
