'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { redirect } from 'next/navigation'
import {
  getAllEntries,
  getEntryById,
  getEntriesByDate,
  createEntry,
  updateEntry,
  deleteEntry
} from '@/lib/json-db'
import { DiaryEntry } from '@/types/diary'

const DiaryEntrySchema = z.object({
  title: z.string().min(3, { message: 'O título deve ter pelo menos 3 caracteres.' }).max(100),
  content: z.string().min(10, { message: 'O conteúdo deve ter pelo menos 10 caracteres.' }),
  date: z.date({ required_error: 'Por favor, selecione uma data.' }),
})

export type FormState = {
  message: string;
  errors?: Record<string, string[] | undefined>;
  success: boolean;
  id?: string;
} | null

export async function createDiaryEntry(prevState: FormState,
  formData: FormData): Promise<FormState> {
  const rawFormData = {
    title: formData.get('title'),
    content: formData.get('content'),
    date: formData.get('date') ? new Date(formData.get('date') as string) : undefined,
  }

  const validatedFields = DiaryEntrySchema.safeParse(rawFormData)

  if (!validatedFields.success) {
    console.error('Validation Errors:', validatedFields.error.flatten().fieldErrors)
    return {
      message: 'Falha na validação. Por favor, corrija os erros.',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    }
  }

  const { title, content, date } = validatedFields.data

  try {
    const newEntry = await createEntry({
      title,
      content,
      date: date.toISOString(),
    })

    revalidatePath('/')
    revalidatePath('/calendar')
    revalidatePath(`/entry/${newEntry.id}`)

    return { message: 'Entrada criada com sucesso!', success: true, id: newEntry.id }
  } catch (error) {
    console.error('Database Error:', error)
    return { message: 'Erro no servidor ao criar a entrada.', success: false }
  }
}

export async function getAllDiaryEntries(): Promise<DiaryEntry[]> {
  try {
    const entries = await getAllEntries()
    return entries
  } catch (error) {
    console.error('Database Error:', error)
    return []
  }
}

export async function getDiaryEntryById(
  id: string
): Promise<DiaryEntry | null> {
  try {
    const entry = await getEntryById(id)
    return entry
  } catch (error) {
    console.error('Error fetching diary entry:', error)
    return null
  }
}

export async function getDiaryEntriesByDate(date: Date): Promise<DiaryEntry[]> {
  try {
    const entries = await getEntriesByDate(date)
    return entries
  } catch (error) {
    console.error('Database Error fetching entries by date:', error)
    return []
  }
}

export async function updateDiaryEntry(id: string,
  prevState: FormState, formData: FormData): Promise<FormState> {
  const rawFormData = {
    title: formData.get('title'),
    content: formData.get('content'),
    date: formData.get('date') ? new Date(formData.get('date') as string) : undefined,
  }

  const validatedFields = DiaryEntrySchema.safeParse(rawFormData)

  if (!validatedFields.success) {
    console.error('Validation Errors:', validatedFields.error.flatten().fieldErrors)
    return {
      message: 'Falha na validação. Por favor, corrija os erros.',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    }
  }

  const { title, content, date } = validatedFields.data

  try {
    const updatedEntry = await updateEntry(id, {
      title,
      content,
      date: date.toISOString(),
    })

    if (!updatedEntry) {
      return { message: 'Entrada não encontrada.', success: false }
    }

    revalidatePath('/')
    revalidatePath('/calendar')
    revalidatePath(`/entry/${id}`)
    revalidatePath(`/edit/${id}`)
    return { message: 'Entrada atualizada com sucesso!', success: true, id }
  } catch (error) {
    console.error('Database Error:', error)
    return { message: 'Erro no servidor ao atualizar a entrada.', success: false }
  }
}

export async function deleteDiaryEntry(formData: FormData) {
  const entryId = formData.get('entryId') as string

  if (!entryId) {
    console.error('Entry ID not found in form data for deletion.')
    return
  }

  try {
    const deleted = await deleteEntry(entryId)

    if (!deleted) {
      console.error(`Entry with ID ${entryId} not found for deletion.`)
      return
    }

    console.log(`Successfully deleted entry with ID: ${entryId}`)
    redirect('/')
  } catch (error) {
    console.error(`Error deleting entry with ID ${entryId}:`, error)
  }
}
