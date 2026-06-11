'use client';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-10 flex flex-col items-center justify-center">
      <div className="text-center max-w-3xl">
        <h1 className="text-6xl font-bold tracking-tighter text-[#15803d] mb-6">
          WealthForge
        </h1>
        <p className="text-2xl text-zinc-400 mb-4">
          Africa's Creative + Financial Wealth Operating System
        </p>
        <p className="text-lg text-zinc-500 mb-12">
          Built for South Africa. Practical systems to build wealth in volatile markets.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
          <Link 
            href="/dashboard"
            className="px-8 py-4 bg-[#15803d] hover:bg-[#166534] rounded-lg font-semibold transition-colors"
          >
            Portfolio Dashboard
          </Link>
          <Link 
            href="/academy"
            className="px-8 py-4 bg-zinc-800 hover:bg-zinc-700 rounded-lg font-semibold transition-colors"
          >
            Academy
          </Link>
        </div>

        <div className="bg-zinc-900 p-8 rounded-lg border border-zinc-800">
          <h2 className="text-2xl font-bold mb-4 text-[#15803d]">🚀 Ready to Start?</h2>
          <p className="text-zinc-400 mb-4">
            View your portfolio performance, explore wealth-building courses, and manage your subscription all in one place.
          </p>
          <p className="text-sm text-zinc-500">
            Powered by Next.js, Prisma, and built for South Africa's unique wealth challenges.
          </p>
        </div>
      </div>
    </div>
  );
}
