'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const courses = [
  {
    title: 'Debt-to-Wealth Blueprint',
    description: 'How to clear debt faster while building predictable wealth habits in a real-world South African context.',
    level: 'Beginner',
    duration: '4 weeks',
    featured: true,
  },
  {
    title: 'AI Wealth Systems 2026',
    description: 'Use AI workflows to improve research, decision-making, and project execution for your money and business.',
    level: 'Intermediate',
    duration: '6 weeks',
    featured: true,
  },
  {
    title: 'Rand Volatility Survival Kit',
    description: 'Protect your income and wealth during currency shocks, market volatility, and unstable local conditions.',
    level: 'Intermediate',
    duration: '3 weeks',
    featured: false,
  },
];

export default function AcademyPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold tracking-tighter text-[#15803d] mb-4">WealthForge Academy</h1>
        <p className="text-xl text-zinc-400 mb-10">Practical education for ambitious South Africans.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <Card key={index} className="bg-zinc-900 border border-zinc-800 p-0 overflow-hidden">
              <CardHeader className="border-b border-zinc-800">
                <div className="text-sm text-[#15803d] mb-2">
                  {course.level} • {course.duration}
                </div>
                <CardTitle className="text-2xl">{course.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-zinc-400 mb-6">{course.description}</p>
                <button className="w-full bg-zinc-800 hover:bg-zinc-700 py-3 rounded-xl text-sm transition-colors">
                  {course.featured ? 'Start Course' : 'Preview Module'}
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
