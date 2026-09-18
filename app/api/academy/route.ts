export async function GET() {
  return Response.json({
    courses: [
      {
        id: 'debt-to-wealth-blueprint',
        title: 'Debt-to-Wealth Blueprint',
        description: 'Build a realistic roadmap to clear debt and create sustainable wealth in South Africa.',
        level: 'Beginner',
        duration: '4 weeks',
        featured: true,
      },
      {
        id: 'ai-wealth-systems-2026',
        title: 'AI Wealth Systems 2026',
        description: 'Use AI tools to make better financial decisions, automate research, and speed up execution.',
        level: 'Intermediate',
        duration: '6 weeks',
        featured: true,
      },
      {
        id: 'rand-volatility-survival-kit',
        title: 'Rand Volatility Survival Kit',
        description: 'Protect your income and wealth using practical hedging, savings, and investment strategies.',
        level: 'Intermediate',
        duration: '3 weeks',
        featured: false,
      },
    ],
  });
}
