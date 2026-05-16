import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import HomePage from './pages/HomePage'
import ProductsListPage from './features/products/ProductsListPage'
import ProductDetailPage from './features/products/ProductDetailPage'
import CartPage from './features/cart/CartPage'
import CheckoutPage from './features/orders/CheckoutPage'
import OrderHistoryPage from './features/orders/OrderHistoryPage'
import OrderDetailPage from './features/orders/OrderDetailPage'

function Placeholder({ name }: { name: string }) {
  return <div style={{ padding: 40, fontSize: '1.2rem' }}>{name} — coming soon</div>
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsListPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrderHistoryPage />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />
          <Route path="*" element={<Placeholder name="404 Not Found" />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
