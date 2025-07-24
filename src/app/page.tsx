import { getAllDiaryEntries } from '@/app/actions/diary-actions'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { PlusCircle, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default async function HomePage() {
  const entries = await getAllDiaryEntries()

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center flex-row w-full px-20 mb-8">
        <h1 className="text-4xl font-bold"> Diário - desenvolvimento Projeto Oxossi
        </h1>
        <Link href="/new/entry">
          <Button>
            <PlusCircle className="mr-2 h-5 w-5" />
            Nova Entrada
          </Button>
        </Link>
      </div>

      {entries.length === 0
        ? (
          <div className="text-center py-10">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Nenhuma entrada ainda</h2>
            <p className="text-muted-foreground mb-4">
              Clique em "Nova Entrada" para começar a escrever.
            </p>
          </div>
          )
        : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {entries.map((entry) => (
              <Card key={entry.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="truncate hover:text-primary transition-colors">
                    <Link href={`/entry/${entry.id}`}>{entry.title}</Link>
                  </CardTitle>
                  <CardDescription>
                    {format(new Date(entry.date), 'PPP', { locale: ptBR })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="line-clamp-3 text-sm text-muted-foreground">
                    {entry.content?.substring(0, 150)}
                    {entry.content && entry.content.length > 150 ? '...' : ''}
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href={`/entry/${entry.id}`} className="w-full">
                    <Button variant="outline" className="w-full">
                      Ler Mais
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
          )}
    </div>
  )
}

export const revalidate = 3600
