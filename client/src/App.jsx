import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileActionBar from './components/MobileActionBar';
import MiniCartDrawer from './components/MiniCartDrawer';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import EnquiryCartPage from './pages/EnquiryCartPage';
import AdminPage from './pages/AdminPage';

// Scroll to top on every route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-stone-50 text-zinc-900 pb-16 md:pb-0 selection:bg-zinc-200">
        <ScrollToTop />
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/enquiry-cart" element={<EnquiryCartPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
        <Footer />
        <MobileActionBar />
        {/* Global Floating Mini-Cart Drawer */}
        <MiniCartDrawer />
      </div>
    </BrowserRouter>
  );
}
