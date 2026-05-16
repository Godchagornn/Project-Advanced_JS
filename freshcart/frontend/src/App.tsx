import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import HomePage from './pages/HomePage'
import ProductsListPage from './features/products/ProductsListPage'
import ProductDetailPage from './features/products/ProductDetailPage'
import CartPage from './features/cart/CartPage'
import CheckoutPage from './features/orders/CheckoutPage'
import OrderHistoryPage from './features/orders/OrderHistoryPage'
import OrderDetailPage from './features/orders/OrderDetailPage'
import NotFoundPage from './pages/NotFoundPage'

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
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
