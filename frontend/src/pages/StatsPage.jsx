import { useEffect, useState } from "react";

export default function StatsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await fetch("/api/stats");
        if (!response.ok) {
          throw new Error("Nie udało się pobrać statystyk.");
        }

        const data = await response.json();
        setStats(data);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Statystyki API</h2>
        <p>Informacje o stanie backendu i katalogu produktów.</p>
      </div>

      {loading && <p className="feedback">Ładowanie statystyk...</p>}
      {error && <p className="feedback error">{error}</p>}

      {!loading && stats && (
        <div className="stats-grid">
          <article className="metric">
            <h3>Liczba produktów</h3>
            <strong>{stats.totalProducts}</strong>
          </article>
          <article className="metric">
            <h3>Instancja backendu</h3>
            <strong>{stats.instanceId}</strong>
          </article>
        </div>
      )}
    </section>
  );
}
