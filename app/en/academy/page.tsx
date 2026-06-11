
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

  // Sample 6-month performance data (ZAR)
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

      {/* Equity Overview */}
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

      {/* Performance Trend Chart */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader><CardTitle>6-Month Performance Trend</CardTitle></CardHeader>
        <CardContent className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="month" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', border: 'none', color: '#fff' }} 
                formatter={(value) => [`R ${value.toLocaleString()}`, 'Portfolio Value']}
              />
              <Line 
                type="natural" 
                dataKey="value" 
                stroke="#15803d" 
                strokeWidth={3} 
                dot={{ fill: '#15803d', r: 5 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}git add .
git commit -m "feat: success page + subscription status in dashboard + subscription API"
git push

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { assets: true },
  });

  const totalValue = user?.assets.reduce((sum, asset) => sum + asset.value, 0) || 0;

  return NextResponse.json({
    ...user,
    totalValue,
  });
}

'use client';
import { useState } from 'react';

export default function AddAssetForm({ onAssetAdded }: { onAssetAdded: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    value: '',
    type: 'Investment',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/assets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        value: parseFloat(formData.value),
      }),
    });
    onAssetAdded();
    setFormData({ name: '', value: '', type: 'Investment' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-zinc-900 p-6 rounded-xl">
      <input
        type="text"
        placeholder="Asset Name (e.g. S&P 500 ETF)"
        className="w-full bg-zinc-800 p-3 rounded-xl"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <input
        type="number"
        placeholder="Value in Rands"
        className="w-full bg-zinc-800 p-3 rounded-xl"
        value={formData.value}
        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
        required
      />
      <select
        className="w-full bg-zinc-800 p-3 rounded-xl"
        value={formData.type}
        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
      >
        <option>Investment</option>
        <option>Property</option>
        <option>Cash</option>
        <option>Retirement</option>
        <option>Other</option>
      </select>
      <button type="submit" className="w-full bg-[#15803d] py-3 rounded-xl font-medium">
        Add Asset
      </button>
    </form>
  );
}

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, value, type } = await req.json();
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });

  await prisma.asset.create({
    data: { name, value, type, userId: user!.id },
  });

  return NextResponse.json({ success: true });
}
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await getServerSession();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.user.update({
    where: { email: session.user.email },
    data: {
      subscriptionStatus: "cancelled",
      subscriptionUpdatedAt: new Date(),
    },
  });

  return NextResponse.json({ success: true });
}
// In layout.tsx or globals.css
body {
  -webkit-font-smoothing: antialiased;
}
export default function AcademyPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold tracking-tighter text-[#15803d]">WealthForge Academy</h1>
          <p className="text-xl text-zinc-400 mt-3">Practical systems to build wealth in South Africa</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Course Cards */}
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl">
            <h3 className="text-2xl font-semibold mb-4">Debt-to-Wealth Blueprint</h3>
            <p className="text-zinc-400 mb-6">How I cleared R250k in debt while earning an average salary in Centurion.</p>
            <div className="text-sm text-[#15803d] font-medium">Included in Inner Circle</div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl">
            <h3 className="text-2xl font-semibold mb-4">AI Wealth Systems 2026</h3>
            <p className="text-zinc-400 mb-6">Learn how to use AI tools to build wealth faster in volatile markets.</p>
            <div className="text-sm text-[#15803d] font-medium">Included in Inner Circle</div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-zinc-400">Full Academy access is available to Inner Circle members.</p>
          <a href="/en/pricing" className="inline-block mt-4 text-[#15803d] hover:underline">Upgrade to Inner Circle →</a>
        </div>
      </div>
    </div>
  );
}
