# 🥦 FreshCart

A retail e-commerce single-page application for browsing and ordering fresh fruits, vegetables, and herbs. Shoppers can search and filter produce, manage a cart, check out, view order history, and leave product reviews — all backed by a JSON Server mock REST API hosted on Render.

---

## 📖 Description

FreshCart is a fully functional e-commerce SPA that simulates a real online grocery store. Users can explore a catalog of 20 Thai-sourced produce items, add them to their cart, and complete a checkout flow with form validation and a mock payment step. All purchases are saved as orders and can be reviewed at any time. A full review system lets shoppers rate and comment on individual products.

---

## 👥 Team Members

- 672110132 Godchagorn Kitima
- 672110166 Anmanya Khongmee

---

## 🌐 Live URL

[https://freshcart-mu-seven.vercel.app](https://freshcart-mu-seven.vercel.app)

---

## ✨ Features

- 🔍 **Browse & Search** — Real-time search, category filter (fruits / vegetables / herbs), sort by name or price or rating, and in-stock toggle
- 🛍️ **Product Detail** — Image, description, origin, stock status, quantity stepper, and add-to-cart
- 🛒 **Cart Management** — Update quantities, remove items with confirm dialog, live order summary with free-shipping threshold and VAT calculation
- 💳 **Checkout** — Fully validated form (name, email, phone, address, postal code), cash or mock card payment
- 📦 **Order History** — Chronological list with status badges (pending / confirmed / delivered)
- 🧾 **Order Detail** — Full item snapshot, delivery info, and payment breakdown
- ⭐ **Product Reviews** — Create, read, edit, and delete reviews with star rating and character-limited body
- 🔔 **Toast Notifications** — Success and error feedback for every user action
- 📱 **Responsive Layout** — Works on mobile, tablet, and desktop

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Frontend Framework | React 19 + TypeScript |
| State Management | Redux Toolkit (configureStore, createSlice, createSelector) |
| Data Fetching | RTK Query (createApi, providesTags / invalidatesTags) |
| Routing | React Router v6 |
| Styling | CSS Modules |
| Mock Backend | JSON Server 0.17 (hosted on Render) |
| Hosting | Vercel |
| Linting | ESLint + Prettier |

---

## 📁 Project Structure

```
Project-Advanced_JS/
├── freshcart/
│   ├── frontend/                   # React + Vite app (deployed to Vercel)
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── store.ts        # configureStore — all reducers
│   │   │   │   └── hooks.ts        # useAppDispatch / useAppSelector
│   │   │   ├── features/
│   │   │   │   ├── products/       # productsApi, ProductsListPage, ProductDetailPage, ProductCard
│   │   │   │   ├── cart/           # cartApi, CartPage, CartBadge
│   │   │   │   ├── orders/         # ordersApi, CheckoutPage, OrderHistoryPage, OrderDetailPage
│   │   │   │   ├── reviews/        # reviewsApi, ReviewList, ReviewForm
│   │   │   │   ├── filters/        # filtersSlice
│   │   │   │   └── ui/             # uiSlice (toast, confirmDialog)
│   │   │   ├── components/         # Shared UI (Button, Input, Spinner, Toast, ConfirmDialog …)
│   │   │   ├── selectors/          # createSelector — cartSelectors, productSelectors
│   │   │   ├── hooks/              # useDebounce
│   │   │   ├── types/              # models.ts
│   │   │   └── utils/              # formatPrice, validators
│   │   ├── .env                    # VITE_API_URL (git-ignored)
│   │   ├── .env.example            # Template
│   │   └── package.json
│   └── backend/                    # JSON Server mock API (deployed to Render)
│       ├── server.cjs              # Custom middleware — UUID IDs, dynamic PORT
│       ├── db.json                 # Seed data — products, cartItems, orders, reviews
│       └── package.json
└── README.md
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js v18 or higher
- npm

### Steps

**1. Clone the repository**
```bash
git clone https://github.com/Godchagornn/Project-Advanced_JS.git
cd Project-Advanced_JS/freshcart
```

**2. Start the backend**
```bash
cd backend
npm install
npm start          # API runs at http://localhost:10000
```

**3. Start the frontend** *(new terminal)*
```bash
cd frontend
npm install
cp .env.example .env
# Open .env and set:  VITE_API_URL=http://localhost:10000
npm run dev        # App runs at http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

> **Reset seed data** (if db.json was modified during testing):
> ```bash
> cd backend
> npm run reset-db
> ```

---

## 🔌 API Reference

**Production Base URL:** `https://project-advanced-js.onrender.com`

| Resource | Endpoint | Operations |
|---|---|---|
| Products | `/products` | GET all, GET `/products/:id` |
| Cart items | `/cartItems` | GET, POST, PUT `/cartItems/:id`, DELETE `/cartItems/:id` |
| Orders | `/orders` | GET all, GET `/orders/:id`, POST |
| Reviews | `/reviews?productId=:id` | GET (filtered), POST, PUT `/reviews/:id`, DELETE `/reviews/:id` |

All POST requests receive a UUID string `id` generated by the custom `server.cjs` middleware, matching the TypeScript `id: string` models.

---

## 🌐 Available Routes

| Route | Page |
|---|---|
| `/` | Home — featured products and hero banner |
| `/products` | Products list — search, filter, sort |
| `/products/:id` | Product detail — info, add-to-cart, reviews |
| `/cart` | Cart — quantities, summary, proceed to checkout |
| `/checkout` | Checkout — delivery form and mock payment |
| `/orders` | Order history — all past orders |
| `/orders/:id` | Order detail — full breakdown |
| `*` | 404 Not Found |

---

## 📜 Available Scripts

### Frontend (`freshcart/frontend/`)

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server on port 5173 |
| `npm run build` | TypeScript check + production build |
| `npm run lint` | Run ESLint + Prettier |
| `npm run preview` | Preview the production build locally |

### Backend (`freshcart/backend/`)

| Command | Description |
|---|---|
| `npm start` | Start JSON Server on `process.env.PORT` or 10000 |
| `npm run reset-db` | Restore `db.json` to original seed data via git |

---

## 🧩 Redux State Shape

```
RootState
├── filters        — search, category, sortBy, inStockOnly, viewMode  (filtersSlice)
├── ui             — confirmDialog, toast, isCartDrawerOpen            (uiSlice)
├── productsApi    — RTK Query cache
├── cartApi        — RTK Query cache (full CRUD)
├── ordersApi      — RTK Query cache
└── reviewsApi     — RTK Query cache (full CRUD)
```

**Memoized selectors** (`createSelector`):
- `selectCartItemCount`, `selectCartSubtotal`, `selectCartShipping`, `selectCartTax`, `selectCartTotal`, `selectCartByCategory`
- `selectAllProducts`, `selectFilteredProducts`, `selectSortedProducts`, `selectFeaturedProducts`


---

## 🙏 Acknowledgments

- [JSON Server](https://github.com/typicode/json-server) for the zero-config mock REST API
- [Redux Toolkit](https://redux-toolkit.js.org) documentation
- [Render](https://render.com) for free Node.js hosting
- [Vercel](https://vercel.com) for free frontend hosting
- Product images sourced from [Pexels](https://www.pexels.com)
