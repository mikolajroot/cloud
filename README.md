# Product Dashboard

Pełne rozwiązanie aplikacji Product Dashboard składające się z:

- Frontendu: React + React Router + Vite
- Backendu: Node.js + Express

## Funkcjonalności

- Routing po stronie klienta z trzema widokami:
	- Strona główna
	- Lista produktów
	- Statystyki
- Widok produktów:
	- Pobiera dane z API (`GET /items`)
	- Umożliwia dodanie produktu przez formularz (`POST /items`)
- Widok statystyk:
	- Pokazuje liczbę wszystkich produktów
	- Pokazuje identyfikator instancji backendu obsługującej żądanie
- Backend udostępnia endpointy:
	- `GET /items`
	- `POST /items`
	- `GET /stats`

## Struktura projektu

```
.
├── backend
│   ├── package.json
│   └── src
│       └── server.js
├── frontend
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src
│       ├── App.jsx
│       ├── main.jsx
│       ├── styles.css
│       └── pages
│           ├── HomePage.jsx
│           ├── ProductsPage.jsx
│           └── StatsPage.jsx
└── .gitignore
```

## Uruchomienie

W dwóch osobnych terminalach:

### 1) Backend

```bash
cd backend
npm install
npm run dev
```

API będzie dostępne pod adresem: `http://localhost:4000`

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Aplikacja będzie dostępna pod adresem: `http://localhost:5173`

Frontend używa proxy Vite (`/api`) do backendu `http://localhost:4000`.

## Przykładowe wywołania API

```bash
curl http://localhost:4000/items
```

```bash
curl -X POST http://localhost:4000/items \
	-H "Content-Type: application/json" \
	-d '{"name":"Mysz Gamingowa","price":249.99}'
```

```bash
curl http://localhost:4000/stats
```
