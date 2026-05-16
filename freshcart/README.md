# FreshCart 🥦

A retail e-commerce web app for browsing and ordering fresh fruits, vegetables, and herbs. Shoppers can search and filter produce, manage a cart, check out, view order history, and leave product reviews — all backed by a live mock REST API.

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
| Framework | React 18 + TypeScript |
| Build tool | Vite |
| State management | Redux Toolkit (configureStore, createSlice, createSelector) |
| Data fetching | RTK Query (productsApi, cartApi, ordersApi, reviewsApi) |
| Routing | React Router v6 |
| Styling | CSS Modules (*.module.css) |
| Date formatting | date-fns |
| Mock API | mockapi.io |
| Hosting | Vercel |
| Linting | ESLint + Prettier |

---

## Local Setup

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd freshcart

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Open .env and set VITE_API_URL to your mockapi.io project URL

# 4. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

To build for production:

```bash
npm run build
npm run preview
```

---

## API

**Base URL** (set in `.env`):
```
VITE_API_URL=https://<your-mockapi-id>.mockapi.io/api/v1
```

| Resource | Endpoint | Operations |
|---|---|---|
| Products | `/products` | GET all, GET by id |
| Cart items | `/cartItems` | GET, POST, PUT, DELETE |
| Orders | `/orders` | GET all, GET by id, POST |
| Reviews | `/reviews?productId=:id` | GET, POST, PUT, DELETE |

Seed your mockapi.io project with at least 20 products (fruits, vegetables, herbs) before running the app. Leave `cartItems`, `orders`, and `reviews` empty — they are populated by the app.

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

Memoized selectors (`createSelector`) in `src/selectors/`:
- `selectCartItemCount`, `selectCartSubtotal`, `selectCartTotal`, `selectCartShipping`, `selectCartTax`, `selectCartByCategory`
- `selectAllProducts`, `selectFilteredProducts`, `selectSortedProducts`, `selectFeaturedProducts`

---

## Screenshot

> _(Add a screenshot or GIF of the live app here after deployment)_
>
> Example:
> ![FreshCart screenshot](./screenshot.png)

---

## Deployment Notes

1. Push the repo to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Set `VITE_API_URL` in **Project Settings → Environment Variables**
4. Vercel auto-deploys on every push to `main`
5. The `vercel.json` SPA rewrite ensures deep links (e.g. `/products/123`) work on refresh
