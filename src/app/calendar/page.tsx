'use client'

import { useState, useEffect } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { getDiaryEntriesByDate, getAllDiaryEntries } from '@/app/actions/diary-actions'
import { DiaryEntry } from '@/types/diary'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Loader2, CalendarDays, AlertCircle } from 'lucide-react'

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [entriesForDate, setEntriesForDate] = useState<DiaryEntry[]>([])
  const [allEntryDates, setAllEntryDates] = useState<Date[]>([])
  const [isLoadingEntries, setIsLoadingEntries] = useState(false)
  const [isLoadingAllDates, setIsLoadingAllDates] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAllEntryDates() {
      setIsLoadingAllDates(true)
      try {
        const allEntries = await getAllDiaryEntries()
        const dates = allEntries.map(entry => new Date(entry.date))
        setAllEntryDates(dates)
      } catch (err) {
        console.error('Failed to load all entry dates:', err)
        setError('Não foi possível carregar as datas das entradas.')
      } finally {
        setIsLoadingAllDates(false)
      }
    }
    fetchAllEntryDates()
  }, [])

  useEffect(() => {
    if (selectedDate) {
      async function fetchEntries() {
        setIsLoadingEntries(true)
        setError(null)
        try {
          const entries = await getDiaryEntriesByDate(selectedDate!)
          setEntriesForDate(entries)
        } catch (err) {
          console.error('Failed to load entries for date:', err)
          setError('Não foi possível carregar as entradas para esta data.')
          setEntriesForDate([])
        } finally {
          setIsLoadingEntries(false)
        }
      }
      fetchEntries()
    } else {
      setEntriesForDate([])
    }
  }, [selectedDate])

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
  }

  const dayHasEntry = (day: Date): boolean => {
    return allEntryDates.some(entryDate =>
      entryDate.getDate() === day.getDate() &&
        entryDate.getMonth() === day.getMonth() &&
        entryDate.getFullYear() === day.getFullYear()
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Calendário de Entradas</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Selecione uma Data</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              {!isLoadingAllDates && (
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  className="rounded-md border"
                  locale={ptBR}
                  modifiers={{
                    hasEntry: dayHasEntry,
                  }}
                />
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <h2 className="text-2xl font-semibold mb-4">
            {selectedDate
              ? `Entradas para ${format(selectedDate, 'PPP', { locale: ptBR })}`
              : 'Selecione uma data para ver as entradas'}
          </h2>
          {isLoadingEntries
            ? (
              <div className="flex items-center justify-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
              )
            : error
              ? (
                <div className="text-red-500 flex items-center bg-red-100 dark:bg-red-900/30 p-4 rounded-md">
                  <AlertCircle className="h-5 w-5 mr-2" /> {error}
                </div>
                )
              : selectedDate && entriesForDate.length === 0
                ? (
                  <div className="text-center py-10 bg-muted/30 rounded-md">
                    <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Nenhuma entrada encontrada para esta data.</p>
                  </div>
                  )
                : (
                  <div className="space-y-4">
                    {entriesForDate.map((entry) => (
                      <Card key={entry.id}>
                        <CardHeader>
                          <CardTitle className="truncate hover:text-primary transition-colors">
                            <Link href={`/entry/${entry.id}`}>{entry.title}</Link>
                          </CardTitle>
                          <CardDescription className="text-sm text-muted-foreground">
                            {format(new Date(entry.date), 'PPP', { locale: ptBR })}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="line-clamp-2 text-sm text-muted-foreground">
                            {entry.content?.substring(0, 100)}
                            {entry.content && entry.content.length > 100 ? '...' : ''}
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
      </div>
    </div>
  )
}
