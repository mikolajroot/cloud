import { NavLink, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import StatsPage from "./pages/StatsPage";

const navigationItems = [
  { to: "/", label: "Start" },
  { to: "/products", label: "Produkty" },
  { to: "/stats", label: "Statystyki" }
];

export default function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Product Dashboard</h1>
        <nav>
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="page-wrap">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/stats" element={<StatsPage />} />
        </Routes>
      </main>
    </div>
  );
}
