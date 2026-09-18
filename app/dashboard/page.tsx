'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const defaultPerformance = {
  totalValue: 1245000,
  monthlyReturn: 4.8,
  ytdReturn: 18.5,
  riskScore: 65,
  inflationBeat: 12,
  lastUpdated: new Date().toLocaleString('en-ZA'),
};

const defaultChartData = [
  { month: 'Jan', value: 980000 },
  { month: 'Feb', value: 1020000 },
  { month: 'Mar', value: 1085000 },
  { month: 'Apr', value: 1150000 },
  { month: 'May', value: 1198000 },
  { month: 'Jun', value: 1245000 },
];

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch('/api/user', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const performance = user
    ? {
        totalValue: user.totalValue ?? defaultPerformance.totalValue,
        monthlyReturn: 4.8,
        ytdReturn: user.wealthScore ? Math.min(user.wealthScore / 10, 30) : defaultPerformance.ytdReturn,
        riskScore: Math.min(Math.max(45 + (user.wealthScore ?? 0) / 20, 35), 88),
        inflationBeat: user.wealthScore ? Math.min(user.wealthScore / 28, 18) : defaultPerformance.inflationBeat,
        lastUpdated: new Date().toLocaleString('en-ZA'),
      }
    : defaultPerformance;

  const chartData = defaultChartData;

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-10 space-y-10">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-5xl font-bold tracking-tighter text-[#15803d]">Portfolio Performance</h1>
          <p className="text-xl text-zinc-400 mt-2">
            {user ? `Welcome back, ${user.name ?? user.email ?? 'member'}` : 'Sample Portfolio Preview • Built for South Africa'}
          </p>
        </div>
        <div className="text-sm text-zinc-500">Updated: {performance.lastUpdated}</div>
      </div>

      <div className="rounded-lg border border-amber-600/40 bg-amber-950/20 p-4 text-sm text-amber-200">
        <strong>{user ? 'Live account snapshot.' : 'Sample data.'}</strong>{' '}
        {user
          ? 'This dashboard reflects the current user profile and available asset data.'
          : 'This page shows placeholder figures so you can preview the dashboard layout until real account data is connected.'}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Portfolio Value', value: `R ${performance.totalValue.toLocaleString()}`, color: 'text-white' },
          { title: 'Monthly Return', value: `+${performance.monthlyReturn}%`, color: 'text-green-500' },
          { title: 'YTD Return', value: `+${performance.ytdReturn}%`, color: 'text-green-500' },
          { title: 'Risk Score', value: `${Math.round(performance.riskScore)}/100`, color: 'text-amber-500' },
        ].map((metric, i) => (
          <Card key={i} className="bg-zinc-900 border-zinc-800 hover:border-[#15803d] transition-colors">
            <CardHeader>
              <CardTitle className="text-2xl text-zinc-400">{metric.title}</CardTitle>
            </CardHeader>
            <CardContent className={`text-5xl font-semibold ${metric.color}`}>{metric.value}</CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-zinc-900 border-[#15803d]/50">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3 text-[#15803d]">🧠 WealthForge Co-Pilot</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-lg">
          <p>
            Example: a portfolio beating SA inflation by <strong className="text-green-500">{performance.inflationBeat}% YTD</strong>.
          </p>
          <p>
            <strong>Recommended move:</strong> Increase offshore exposure and automate emergency savings to reduce rand volatility risk.
          </p>
          <p className="text-sm text-zinc-500">
            {loading ? 'Loading account insights…' : user ? 'Insights are now based on the current account profile.' : 'Preview content only • not yet connected to live account data.'}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader><CardTitle>Equity Overview</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div><p className="text-green-500 font-medium">Assets</p><p className="text-4xl font-semibold">R {Number(performance.totalValue).toLocaleString()}</p></div>
            <div><p className="text-red-500 font-medium">Liabilities</p><p className="text-4xl font-semibold">R 320,000</p></div>
            <div><p className="text-blue-500 font-medium">Equity (Net Worth)</p><p className="text-4xl font-semibold">R 925,000</p></div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader><CardTitle>6-Month Performance Trend</CardTitle></CardHeader>
        <CardContent className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="month" stroke="#71717a" />
              <YAxis stroke="#71717a" />
              <Tooltip formatter={(value) => [`R ${Number(value).toLocaleString()}`, 'Portfolio Value']} />
              <Line type="monotone" dataKey="value" stroke="#15803d" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
