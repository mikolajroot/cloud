import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <section className="panel hero">
      <p className="eyebrow">Panel operacyjny</p>
      <h2>Zarządzaj katalogiem produktów w jednym miejscu</h2>
      <p>
        To demo łączy frontend React i backend Express. Przejdź do listy produktów,
        aby pobrać dane z API i dodać nowe pozycje przez formularz.
      </p>
      <div className="hero-actions">
        <Link className="button primary" to="/products">
          Otwórz listę produktów
        </Link>
        <Link className="button" to="/stats">
          Zobacz statystyki API
        </Link>
      </div>
    </section>
  );
}
