import { useState } from 'react';

export default function PricingPage() {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout-session', { method: 'POST' });
      const data = await res.json();
      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        alert('Failed to create checkout session');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-3xl font-bold mb-4">WealthForge Pro</h1>
      <p className="mb-6">Unlock premium features and insights with a monthly subscription.</p>

      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold">Monthly — R300</h2>
        <p className="text-sm text-gray-600 mb-4">Billed monthly. Cancel anytime.</p>
        <button
          onClick={handleSubscribe}
          className="px-6 py-3 bg-blue-600 text-white rounded-md"
          disabled={loading}
        >
          {loading ? 'Redirecting...' : 'Subscribe — R300 / month'}
        </button>
      </div>
    </main>
  );
}
