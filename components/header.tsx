"use client";

import Link from 'next/link';

export function Header() {
  return (
    <header className="border-b bg-slate-50">
      <div className="container mx-auto px-6 sm:px-8 flex h-16 items-center justify-start py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="text-2xl font-bold text-blue-600">Insee</span>
          <span className="text-xl font-medium text-slate-700 border-l pl-3">Salaires et revenus en France</span>
        </Link>
      </div>
    </header>
  );
} 