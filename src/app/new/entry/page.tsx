import { EntryForm } from '@/components/entry-form'
import { createDiaryEntry } from '@/app/actions/diary-actions'

export default function NewEntryPage() {
  return (
    <EntryForm
      action={createDiaryEntry}
      formTitle="Nova Entrada no Diário"
      formDescription="Crie uma nova entrada para registrar seus pensamentos e experiências."
      submitButtonText="Criar Entrada"
    />
  )
}
