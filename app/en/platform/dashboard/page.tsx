'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const performance = {
    totalValue: 1245000,
    monthlyReturn: 4.8,
    ytdReturn: 18.5,
    riskScore: 65,
    inflationBeat: 12,
    lastUpdated: new Date().toLocaleString('en-ZA'),
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-10 space-y-10">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-5xl font-bold tracking-tighter text-[#15803d]">Portfolio Performance</h1>
          <p className="text-xl text-zinc-400 mt-2">Thinking Portfolio Co-Pilot • Built for South Africa</p>
        </div>
        <div className="text-sm text-zinc-500">Updated: {performance.lastUpdated}</div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Portfolio Value", value: `R ${performance.totalValue.toLocaleString()}`, color: "text-white" },
          { title: "Monthly Return", value: `+${performance.monthlyReturn}%`, color: "text-green-500" },
          { title: "YTD Return", value: `+${performance.ytdReturn}%`, color: "text-green-500" },
          { title: "Risk Score", value: `${performance.riskScore}/100`, color: "text-amber-500" },
        ].map((metric, i) => (
          <Card key={i} className="bg-zinc-900 border-zinc-800 hover:border-[#15803d] transition-colors">
            <CardHeader><CardTitle className="text-zinc-400">{metric.title}</CardTitle></CardHeader>
            <CardContent className={`text-5xl font-semibold ${metric.color}`}>{metric.value}</CardContent>
          </Card>
        ))}
      </div>

      {/* AI Co-Pilot */}
      <Card className="bg-zinc-900 border-[#15803d]/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-[#15803d]">🧠 Thinking Portfolio Co-Pilot</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-lg">
          <p>Your portfolio is beating SA inflation by <strong className="text-green-500">{performance.inflationBeat}% YTD</strong>.</p>
          <p><strong>Smart Recommendation:</strong> Increase offshore exposure (S&amp;P 500 ETFs + Gold) to hedge ZAR volatility and load-shedding impacts. Local property allocation stable.</p>
          <p className="text-sm text-zinc-500">RAG-powered insight • Next rebalance in 14 days</p>
        </CardContent>
      </Card>

      {/* Equity Section (upgraded) */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader><CardTitle>Equity Overview</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-green-500 font-medium">Assets</p>
              <p className="text-4xl font-semibold">R 1,245,000</p>
            </div>
            <div>
              <p className="text-red-500 font-medium">Liabilities</p>
              <p className="text-4xl font-semibold">R 320,000</p>
            </div>
            <div>
              <p className="text-blue-500 font-medium">Equity (Net Worth)</p>
              <p className="text-4xl font-semibold">R 925,000</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Trend Placeholder */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader><CardTitle>6-Month Performance Trend</CardTitle></CardHeader>
        <CardContent className="h-80 flex items-center justify-center bg-zinc-950 rounded-xl border border-dashed border-zinc-700">
          <p className="text-zinc-500 text-center">📈 Full Recharts Chart Ready — Reply "add chart" to activate</p>
        </CardContent>
      </Card>
    </div>
  );
      }
