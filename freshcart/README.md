# FreshCart 🥦

A retail e-commerce web app for browsing and ordering fresh fruits, vegetables, and herbs. Shoppers can search and filter produce, manage a cart, check out, view order history, and leave product reviews — all backed by a local JSON Server mock REST API.

---

## Team Members

- 672110132 Godchagorn Kitima
- 672110166 Anmanya Khongmee

---

## Live URL

> **[https://freshcart-your-project.vercel.app](https://freshcart-your-project.vercel.app)**
> _(replace with your actual Vercel deployment URL after deploying)_

---

## Main Features

- **Browse produce** — grid/list view with real-time search, category filter (fruits / vegetables / herbs), sort (name, price, rating), and in-stock toggle
- **Product detail** — image, description, origin, stock status, quantity stepper, add-to-cart
- **Cart management** — update quantities, remove items (with confirmation dialog), live order summary with free-shipping threshold and VAT
- **Checkout** — full validated form (name, email, phone, address, payment method), cash or mock card payment
- **Order history** — chronological list with status badges (pending / confirmed / delivered)
- **Order detail** — full item snapshot, delivery info, and payment breakdown
- **Product reviews** — create, read, edit, and delete reviews with star rating and character-limited body
- **Toast notifications** and global confirm dialog wired through Redux UI slice
- **Responsive layout** — works on mobile, tablet, and desktop

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite |
| State management | Redux Toolkit (configureStore, createSlice, createSelector) |
| Data fetching | RTK Query (productsApi, cartApi, ordersApi, reviewsApi) |
| Routing | React Router v6 |
| Styling | CSS Modules (*.module.css) |
| Date formatting | date-fns |
| Mock API | JSON Server 0.17 (local) |
| Hosting | Vercel |
| Linting | ESLint + Prettier |

---

## Project Structure

```
FreshCart/
├── frontend/          # React + Vite app (deployed to Vercel)
│   ├── src/
│   ├── public/
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
├── backend/           # JSON Server mock API
│   ├── server.cjs
│   ├── db.json
│   └── package.json
└── README.md
```

---

## Local Setup

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd FreshCart

# 2. Install frontend dependencies
cd frontend
npm install

# 3. Configure environment
cp .env.example .env
# .env is already empty — Vite proxy forwards API calls to the backend automatically

# 4. Install backend dependencies
cd ../backend
npm install

# 5a. Start backend (Terminal 1) — API server on http://localhost:3001
npm start

# 5b. Start frontend (Terminal 2) — Vite dev server on http://localhost:5173
cd ../frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

> **Note:** JSON Server writes live data back to `db.json`. To reset to the original seed data run:
> ```bash
> cd backend
> npm run reset-db
> ```

To build for production:

```bash
cd frontend
npm run build
npm run preview
```

---

## API

**Base URL** (set in `frontend/.env` for production):
```
VITE_API_URL=https://your-backend-url.railway.app
```

JSON Server reads from `db.json` and exposes a full REST API automatically.

| Resource | Endpoint | Operations |
|---|---|---|
| Products | `/products` | GET all, GET `/products/:id` |
| Cart items | `/cartItems` | GET, POST, PUT `/cartItems/:id`, DELETE `/cartItems/:id` |
| Orders | `/orders` | GET all, GET `/orders/:id`, POST |
| Reviews | `/reviews?productId=:id` | GET (filtered), POST, PUT `/reviews/:id`, DELETE `/reviews/:id` |

`db.json` ships with **20 seeded products** (8 fruits, 8 vegetables, 4 herbs) and 5 sample reviews. `cartItems` and `orders` start empty and are populated by the app.

---

## Redux State Shape

```
RootState
├── filters        — search, category, sortBy, inStockOnly, viewMode (filtersSlice)
├── ui             — confirmDialog, toast, isCartDrawerOpen (uiSlice)
├── productsApi    — RTK Query cache
├── cartApi        — RTK Query cache (full CRUD)
├── ordersApi      — RTK Query cache
└── reviewsApi     — RTK Query cache (full CRUD)
```

---

## Deployment Notes

1. Push the repo to GitHub
2. Deploy **backend/** to [Railway](https://railway.app) or [Render](https://render.com)
3. Import **frontend/** in [Vercel](https://vercel.com) — set Root Directory to `frontend/`
4. Set `VITE_API_URL` in **Vercel → Project Settings → Environment Variables** to the backend URL
5. Vercel auto-deploys on every push to `main`
6. The `vercel.json` SPA rewrite ensures deep links (e.g. `/products/123`) work on refresh
