# FreshCart

A retail e-commerce SPA for browsing and ordering fresh fruits, vegetables, and herbs. Shoppers can search and filter produce, manage a cart, check out, view order history, and leave product reviews.

---

## Team Members

- 672110132 Godchagorn Kitima
- 672110166 Anmanya Khongmee

---

## Live URL

[https://freshcart-mu-seven.vercel.app](https://freshcart-mu-seven.vercel.app)

---

## Main Features

- Browse produce with real-time search, category filter, sort, and in-stock toggle
- Product detail page with image, description, origin, stock status, and add-to-cart
- Cart management — update quantities, remove items, live order summary with free-shipping threshold and VAT
- Checkout with full validated form and cash / mock card payment
- Order history with status badges and full order detail view
- Product reviews — create, read, edit, and delete with star rating
- Toast notifications and global confirm dialog via Redux UI slice
- Responsive layout for mobile, tablet, and desktop

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 19 + TypeScript |
| State management | Redux Toolkit (configureStore, createSlice, createSelector) |
| Data fetching | RTK Query |
| Routing | React Router v6 |
| Styling | CSS Modules |
| Mock API | JSON Server (hosted on Render) |
| Hosting | Vercel |

---

## How to Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/Godchagornn/Project-Advanced_JS.git
cd Project-Advanced_JS/freshcart

# 2. Start the backend
cd backend
npm install
npm start          # API runs at http://localhost:10000

# 3. Start the frontend (new terminal)
cd ../frontend
npm install
cp .env.example .env
# Edit .env — set VITE_API_URL=http://localhost:10000
npm run dev        # App runs at http://localhost:5173
```

---

## API

**Base URL:** `https://project-advanced-js.onrender.com`

| Resource | Endpoint | Operations |
|---|---|---|
| Products | `/products` | GET all, GET `/products/:id` |
| Cart items | `/cartItems` | GET, POST, PUT `/cartItems/:id`, DELETE `/cartItems/:id` |
| Orders | `/orders` | GET all, GET `/orders/:id`, POST |
| Reviews | `/reviews?productId=:id` | GET (filtered), POST, PUT `/reviews/:id`, DELETE `/reviews/:id` |
