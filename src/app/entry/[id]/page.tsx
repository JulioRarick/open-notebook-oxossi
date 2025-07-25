import { getDiaryEntryById, deleteDiaryEntry } from '@/app/actions/diary-actions'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Button } from '@/components/ui/button'

interface EntryPageProps {
  params: {
    id: string;
  };
}

function DeleteEntryButton({ entryId }: { entryId: string }) {
  return (
    <form action={deleteDiaryEntry}>
      <input type="hidden" name="entryId" value={entryId} />
      <Button disabled variant="destructive" size="sm" type="submit">
        <Trash2 className="mr-2 h-4 w-4" />
        Excluir
      </Button>
    </form>
  )
}

export default async function EntryDetailPage({ params }: EntryPageProps) {
  const entry = await getDiaryEntryById(params.id)

  if (!entry) {
    notFound()
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/" className="inline-flex items-center text-sm text-primary hover:underline mb-6 group">
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Voltar para todas as entradas
      </Link>
      <Card>
        <CardHeader>
          <CardTitle className="text-4xl font-bold">{entry.title}</CardTitle>
          <CardDescription className="text-muted-foreground text-lg">
            {format(new Date(entry.date), 'PPP', { locale: ptBR })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert text-justify max-w-none prose-lg">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {entry.content || ''}
            </ReactMarkdown>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Link href={`/edit/${entry.id}`}>
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </Link>
          <DeleteEntryButton entryId={entry.id} />
        </CardFooter>
      </Card>
    </div>
  )
}
