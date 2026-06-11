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