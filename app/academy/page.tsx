'use client';

export default function AcademyPage() {
  const courses = [
    {
      title: "Debt-to-Wealth Blueprint",
      description: "How I cleared R250k debt on an average salary in Centurion. Includes the exact systems I used.",
      level: "Beginner",
      duration: "4 weeks",
    },
    {
      title: "AI Wealth Systems 2026",
      description: "How to use AI tools to accelerate wealth building in volatile South African markets.",
      level: "Intermediate",
      duration: "6 weeks",
    },
    {
      title: "Rand Volatility Survival Kit",
      description: "Practical strategies to protect and grow wealth during currency crashes and load-shedding.",
      level: "Intermediate",
      duration: "3 weeks",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold tracking-tighter text-[#15803d] mb-4">WealthForge Academy</h1>
        <p className="text-xl text-zinc-400 mb-10">Practical education for ambitious South Africans.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <div key={index} className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl">
              <div className="text-sm text-[#15803d] mb-2">{course.level} • {course.duration}</div>
              <h3 className="text-2xl font-semibold mb-4">{course.title}</h3>
              <p className="text-zinc-400 mb-6">{course.description}</p>
              <button className="w-full bg-zinc-800 hover:bg-zinc-700 py-3 rounded-xl text-sm">
                Start Course (Inner Circle)
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}