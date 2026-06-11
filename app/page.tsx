export default function Home() {
  return (
    <main style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        WealthForge
      </h1>
      <p style={{ fontSize: '1.25rem', color: '#666', textAlign: 'center' }}>
        Africa&apos;s Creative + Financial Wealth Operating System
      </p>
    </main>
  );
}
