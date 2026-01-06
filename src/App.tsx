import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useCart } from './hooks/useCart';
import Header from './components/Header';
import Menu from './components/Menu';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderTracking from './components/OrderTracking';
import FloatingCartButton from './components/FloatingCartButton';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import ProtectedRoute from './components/ProtectedRoute';
import { useMenu } from './hooks/useMenu';
import { AuthProvider } from './contexts/AuthContext';
import { CustomerAuthProvider } from './contexts/CustomerAuthContext';
import { useCustomerAuth } from './hooks/useCustomerAuth';
import CustomerLogin from './components/CustomerLogin';

function MainApp() {
  const cart = useCart();
  const { menuItems } = useMenu();
  const { logout, customer } = useCustomerAuth();
  const [currentView, setCurrentView] = React.useState<'menu' | 'cart' | 'checkout' | 'orderTracking'>('menu');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');

  const handleViewChange = (view: 'menu' | 'cart' | 'checkout' | 'orderTracking') => {
    setCurrentView(view);
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  // Filter menu items based on selected category
  const filteredMenuItems = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-cream-50 font-inter">
      <Header
        cartItemsCount={cart.getTotalItems()}
        onCartClick={() => handleViewChange('cart')}
        onMenuClick={() => handleViewChange('menu')}
        onOrderTrackingClick={() => handleViewChange('orderTracking')}
        onCategoryClick={handleCategoryClick}
        selectedCategory={selectedCategory}
      />

      <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center border-b border-branding-yellow bg-branding-yellow/10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-branding-primary/70">Branch: <span className="text-branding-red font-bold">{customer?.branch_name}</span></span>
        </div>
        <button
          onClick={logout}
          className="text-xs font-bold text-branding-primary/50 hover:text-branding-red transition-colors flex items-center gap-1 uppercase tracking-tighter"
        >
          Logout Session ({customer?.username})
        </button>
      </div>

      {currentView === 'menu' && (
        <Menu
          menuItems={filteredMenuItems}
          addToCart={cart.addToCart}
          cartItems={cart.cartItems}
          updateQuantity={cart.updateQuantity}
        />
      )}

      {/* ... (rest of the views) ... */}
      {currentView === 'cart' && (
        <Cart
          cartItems={cart.cartItems}
          updateQuantity={cart.updateQuantity}
          removeFromCart={cart.removeFromCart}
          clearCart={cart.clearCart}
          getTotalPrice={cart.getTotalPrice}
          onContinueShopping={() => handleViewChange('menu')}
          onCheckout={() => handleViewChange('checkout')}
        />
      )}

      {currentView === 'checkout' && (
        <Checkout
          cartItems={cart.cartItems}
          totalPrice={cart.getTotalPrice()}
          onBack={() => handleViewChange('cart')}
        />
      )}

      {currentView === 'orderTracking' && (
        <OrderTracking
          onBack={() => handleViewChange('menu')}
        />
      )}

      {currentView === 'menu' && (
        <FloatingCartButton
          itemCount={cart.getTotalItems()}
          onCartClick={() => handleViewChange('cart')}
        />
      )}
    </div>
  );
}

function ProtectedCustomerRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useCustomerAuth();

  if (!isAuthenticated) {
    return <CustomerLogin />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <CustomerAuthProvider>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedCustomerRoute>
                  <MainApp />
                </ProtectedCustomerRoute>
              }
            />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </CustomerAuthProvider>
    </AuthProvider>
  );
}

export default App;