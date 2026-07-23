'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function DashboardPage() {
  const performance = {
    totalValue: 1245000,
    monthlyReturn: 4.8,
    ytdReturn: 18.5,
    riskScore: 65,
    inflationBeat: 12,
    lastUpdated: new Date().toLocaleString('en-ZA'),
  };

  // Sample 6-month performance data (ZAR) — illustrative only, not tied to any real account
  const chartData = [
    { month: 'Jan', value: 980000 },
    { month: 'Feb', value: 1020000 },
    { month: 'Mar', value: 1085000 },
    { month: 'Apr', value: 1150000 },
    { month: 'May', value: 1198000 },
    { month: 'Jun', value: 1245000 },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-10 space-y-10">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-5xl font-bold tracking-tighter text-[#15803d]">Portfolio Performance</h1>
          <p className="text-xl text-zinc-400 mt-2">Sample Portfolio Preview • Built for South Africa</p>
        </div>
        <div className="text-sm text-zinc-500">Updated: {performance.lastUpdated}</div>
      </div>

      {/* Disclaimer */}
      <div className="rounded-lg border border-amber-600/40 bg-amber-950/20 p-4 text-sm text-amber-200">
        <strong>Sample data.</strong> This page shows placeholder figures so you can preview the dashboard layout. It is not connected to any real account, and nothing on this page is financial, investment, or tax advice.
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Sample Portfolio Value", value: `R ${performance.totalValue.toLocaleString()}`, color: "text-white" },
          { title: "Sample Monthly Return", value: `+${performance.monthlyReturn}%`, color: "text-green-500" },
          { title: "Sample YTD Return", value: `+${performance.ytdReturn}%`, color: "text-green-500" },
          { title: "Sample Risk Score", value: `${performance.riskScore}/100`, color: "text-amber-500" },
        ].map((metric, i) => (
          <Card key={i} className="bg-zinc-900 border-zinc-800 hover:border-[#15803d] transition-colors">
            <CardHeader>
              <CardTitle className="text-2xl text-zinc-400">{metric.title}</CardTitle>
            </CardHeader>
            <CardContent className={`text-5xl font-semibold ${metric.color}`}>{metric.value}</CardContent>
          </Card>
        ))}
      </div>

      {/* AI Co-Pilot */}
      <Card className="bg-zinc-900 border-[#15803d]/50">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3 text-[#15803d]">🧠 Thinking Portfolio Co-Pilot (Preview)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-lg">
          <p>Example: a sample portfolio beating SA inflation by <strong className="text-green-500">{performance.inflationBeat}% YTD</strong>.</p>
          <p><strong>Illustrative example:</strong> Increase offshore exposure (S&P 500 ETFs + Gold) to hedge ZAR volatility and load-shedding impacts — the kind of insight the Co-Pilot will offer once connected to your real portfolio. Not a recommendation for you specifically.</p>
          <p className="text-sm text-zinc-500">Preview content only • not yet connected to live data or a real account</p>
        </CardContent>
      </Card>

      {/* Equity Overview */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader><CardTitle>Sample Equity Overview</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div><p className="text-green-500 font-medium">Assets</p><p className="text-4xl font-semibold">R 1,245,000</p></div>
            <div><p className="text-red-500 font-medium">Liabilities</p><p className="text-4xl font-semibold">R 320,000</p></div>
            <div><p className="text-blue-500 font-medium">Equity (Net Worth)</p><p className="text-4xl font-semibold">R 925,000</p></div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Trend Chart */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader><CardTitle>Sample 6-Month Performance Trend</CardTitle></CardHeader>
        <CardContent className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="month" stroke="#71717a" />
              <YAxis stroke="#71717a" />
              <Tooltip formatter={(value) => [`R ${value.toLocaleString()}`, 'Portfolio Value']} />
              <Line type="monotone" dataKey="value" stroke="#15803d" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
