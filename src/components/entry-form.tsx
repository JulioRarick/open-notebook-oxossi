'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { CalendarIcon, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChangeEvent, useActionState, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import type { FormState } from '@/app/actions/diary-actions'
import type { DiaryEntry } from '@/types/diary'
import { useForm } from 'react-hook-form'
import { useFormStatus } from 'react-dom'

const formSchema = z.object({
  title: z.string().min(3, { message: 'O título deve ter pelo menos 3 caracteres.' }).max(100),
  content: z.string().min(1, { message: 'O conteúdo não pode estar vazio.' }),
  date: z.date({ required_error: 'Por favor, selecione uma data.' }),
})

type EntryFormProps = {
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
  initialData?: DiaryEntry | null;
  submitButtonText?: string;
  formTitle: string;
  formDescription: string;
}

export function EntryForm({
  action,
  initialData,
  submitButtonText = 'Salvar Entrada',
  formTitle,
  formDescription
}: EntryFormProps) {
  const router = useRouter()

  const [state, formAction] = useActionState(action, { message: '', success: false, errors: undefined, id: undefined })
  const { pending } = useFormStatus()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || '',
      content: initialData?.content || '',
      date: initialData?.date ? new Date(initialData.date) : new Date(),
    },
  })

  useEffect(() => {
    if (state?.message) {
      if (state.success) {
        toast.success(state.message)
        if (state.id) {
          router.push(`/entry/${state.id}`)
        } else if (initialData?.id) {
          router.push(`/entry/${initialData.id}`)
        } else {
          router.push('/')
        }
      } else {
        toast.error(state.message, {
          description: state.errors
            ? Object.values(state.errors).flat().join('\n')
            : undefined,
        })
        if (state.errors) {
          (Object.keys(state.errors) as
            Array<keyof z.infer<typeof formSchema>>)
            .forEach((key) => {
              if (state.errors && state.errors[key]) {
                form.setError(key, { type: 'server', message: state.errors[key]?.join(', ') })
              }
            })
        }
      }
    }
  }, [state, router, initialData, form])

  function onSubmit(data: z.infer<typeof formSchema>) {
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('content', data.content)
    formData.append('date', data.date.toISOString())
    if (initialData?.id) {
      formData.append('id', initialData.id)
    }
    formAction(formData)
  }

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        form.setValue('content', text, { shouldValidate: true })

        const fileNameWithoutExtension = file.name.split('.').slice(0, -1).join('.')
        if (fileNameWithoutExtension && !form.getValues('title')) {
          form.setValue('title', fileNameWithoutExtension.replace(/_/g, ' ').replace(/-/g, ' '))
        }
        toast.success(`Conteúdo de "${file.name}" carregado! Revise e adicione um título/data se necessário.`)
      }
      reader.onerror = () => {
        toast.error('Erro ao ler o arquivo.')
      }
      reader.readAsText(file)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Form {...form}>
        <h1 className="text-3xl font-bold mb-2">{formTitle}</h1>
        <p className="text-muted-foreground mb-6">{formDescription}</p>
        <div className="mb-6 flex items-center justify-center flex-col">
          <FormLabel htmlFor="markdown-upload">Carregar conteúdo de arquivo Markdown</FormLabel>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Input
              id="markdown-upload"
              type="file"
              accept=".md,.markdown,text/markdown"
              onChange={handleFileUpload}
              className="w-80 text-sm h-fit p-0 flex items-center justify-start text-slate-600 dark:text-slate-300
                file:py-1 file:px-2
                file:mr-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-primary/10 file:text-primary
                hover:file:bg-primary/20
                cursor-pointer"
              ref={fileInputRef}
            />
          </div>
          <FormDescription className="mt-1 text-xs">
            Selecione um arquivo .md para preencher o campo "Conteúdo" abaixo.
          </FormDescription>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl>
                  <Input placeholder="Título da sua entrada no diário" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => {
              const handleDateSelect = field.onChange
              return (
                <FormItem className="flex flex-col">
                  <FormLabel>Data</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-[240px] pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value
                            ? (
                                format(field.value, 'PPP', { locale: ptBR })
                              )
                            : (
                              <span>Escolha uma data</span>
                              )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={handleDateSelect}
                        disabled={(date: Date) =>
                          date > new Date() || date < new Date('1900-01-01')}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Conteúdo (Markdown suportado)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Escreva seus pensamentos aqui ou carregue um arquivo .md acima."
                    className="min-h-[200px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Você pode usar Markdown para formatar seu texto.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={pending || form.formState.isSubmitting}>
            {pending || form.formState.isSubmitting
              ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
                )
              : (
                  submitButtonText
                )}
          </Button>
        </form>
      </Form>
    </div>
  )
}
