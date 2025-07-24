import { EntryForm } from '@/components/entry-form'
import { getDiaryEntryById, updateDiaryEntry } from '@/app/actions/diary-actions'
import { notFound } from 'next/navigation'

type EditEntryPageProps = {
  params: {
    id: string;
  };
}

export default async function EditEntryPage({ params }: EditEntryPageProps) {
  const entry = await getDiaryEntryById(params.id)

  if (!entry) {
    notFound()
  }

  const updateEntryWithId = updateDiaryEntry.bind(null, params.id)

  return (
    <EntryForm
      action={updateEntryWithId}
      initialData={entry}
      formTitle="Editar Entrada do Diário"
      formDescription="Modifique sua entrada existente no diário."
      submitButtonText="Salvar Alterações"
    />
  )
}
