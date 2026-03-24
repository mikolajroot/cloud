import { useEffect, useMemo, useState } from "react";

const defaultForm = { name: "", price: "" };

export default function ProductsPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const formattedTotal = useMemo(() => {
    const sum = items.reduce((acc, item) => acc + Number(item.price || 0), 0);
    return new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
      maximumFractionDigits: 2
    }).format(sum);
  }, [items]);

  async function loadItems() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/items");
      if (!response.ok) {
        throw new Error("Nie udało się pobrać listy produktów.");
      }

      const data = await response.json();
      setItems(data);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: form.name,
          price: Number(form.price)
        })
      });

      if (!response.ok) {
        const problem = await response.json();
        throw new Error(problem.message || "Nie udało się dodać produktu.");
      }

      const created = await response.json();
      setItems((current) => [created, ...current]);
      setForm(defaultForm);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Lista produktów</h2>
        <p>Wartość katalogu: {formattedTotal}</p>
      </div>

      <form className="product-form" onSubmit={handleSubmit}>
        <label>
          Nazwa produktu
          <input
            type="text"
            minLength={2}
            required
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="np. Klawiatura Mechaniczna"
          />
        </label>

        <label>
          Cena (PLN)
          <input
            type="number"
            min="0"
            step="0.01"
            required
            value={form.price}
            onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
            placeholder="np. 399.99"
          />
        </label>

        <button className="button primary" type="submit" disabled={submitting}>
          {submitting ? "Dodawanie..." : "Dodaj produkt"}
        </button>
      </form>

      {error && <p className="feedback error">{error}</p>}

      {loading ? (
        <p className="feedback">Ładowanie produktów...</p>
      ) : (
        <ul className="items-grid">
          {items.map((item) => (
            <li key={item.id} className="item-card">
              <h3>{item.name}</h3>
              <p>
                {new Intl.NumberFormat("pl-PL", {
                  style: "currency",
                  currency: "PLN"
                }).format(item.price)}
              </p>
              <small>ID: {item.id}</small>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
