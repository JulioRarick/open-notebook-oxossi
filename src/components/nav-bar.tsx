'use client'

import Link from 'next/link'
import { BookText, CalendarDays, Home, PlusCircle } from 'lucide-react'

export function NavBar() {
  return (
    <header className="sticky top-0 px-20 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <BookText className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block">TCC - OXOSSI - juliorarick</span>
        </Link>
        <nav className="flex items-center space-x-4 lg:space-x-6 flex-1">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <Home className="inline-block mr-1 h-4 w-4" />
            Início
          </Link>
          <Link
            href="/new/entry"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <PlusCircle className="inline-block mr-1 h-4 w-4" />
            Nova Entrada
          </Link>
          <Link
            href="/calendar"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <CalendarDays className="inline-block mr-1 h-4 w-4" />
            Calendário
          </Link>
        </nav>
      </div>
    </header>
  )
}
