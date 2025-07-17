import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Navigation from './components/common/Navigation';
import HomePage from './pages/HomePage';
import PlanetsPage from './pages/PlanetsPage';
import JourneyPage from './pages/JourneyPage';
import LoveTimerPage from './pages/LoveTimerPage';
import AdminMessagesPage from './pages/AdminMessagesPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import MemoryWallPage from './pages/MemoryWallPage';
import CoupleGoalsPage from './pages/CoupleGoalsPage';
import EnhancedBackground from './components/common/EnhancedBackground';

// ScrollToTop component to ensure page scrolls to top on route changes
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Tạm sử dụng một trang đơn giản cho các route còn lại
const PersonalityPage = () => (
  <div className="flex flex-col h-screen pt-16 pb-16">
    <div className="flex-grow relative">
      <div className="absolute inset-0" style={{ zIndex: 10 }}>
        <iframe
          src="https://taoanhdep.com/love/?b=eyJ0IjpbIk1pbyB4aW5oIHF1w7NvbyIsIk1pbyB4aW5oIMSR4bq5cHAiLCJBbmggbmjhu5sgZW1tbW0iLCJBbmggecOqdSBlbSIsIllhbWluIGl1dXUgTWlvb28iLCJNdeG7kW4gw7RtIGVtbSIsIkkgbWlzcyB1Il0sImEiOiJwbSJ9"
          width="100%"
          height="100%"
          style={{
            border: 'none',
            marginTop: '-200px', // Điều chỉnh để chỉ hiển thị tên "Văn Bảo Ngọc"
            pointerEvents: 'auto'
          }}
          title="Love Look"
        />
      </div>
      {/* Transparent overlay to ensure navigation is clickable */}
      <div className="fixed bottom-0 left-0 right-0 h-16" style={{ zIndex: 20 }}></div>
    </div>
  </div>
);

const CombinePage = () => (
  <div className="container py-10 text-center">
    <h1 className="text-3xl font-display font-bold mb-4 text-gradient">Văn Bảo Ngọc</h1>
    <p className="text-overlay content-backdrop">Mio - 2/10/2002</p>
    <p className="mt-6 text-overlay content-backdrop">Tính năng Kết Hợp đang được phát triển...</p>
  </div>
);

const ArchivePage = () => (
  <div className="container py-10 text-center">
    <h1 className="text-3xl font-display font-bold mb-4 text-gradient">Văn Bảo Ngọc</h1>
    <p className="text-overlay content-backdrop">Mio - 2/10/2002</p>
    <p className="mt-6 text-overlay content-backdrop">Tính năng Lưu Trữ đang được phát triển...</p>
  </div>
);

// Wrapper component để handle location changes
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/journey" element={<JourneyPage />} />
        <Route path="/planets" element={<PlanetsPage />} />
        <Route path="/personality" element={<PersonalityPage />} />
        <Route path="/insights" element={<CombinePage />} />
        <Route path="/archive" element={<ArchivePage />} />
        <Route path="/love-timer" element={<LoveTimerPage />} />
        <Route path="/memory-wall" element={<MemoryWallPage />} />
        <Route path="/couple-goals" element={<CoupleGoalsPage />} />
        <Route path="/admin/messages" element={<AdminMessagesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const [showNavigation, setShowNavigation] = useState(true);
  const [showHeader, setShowHeader] = useState(true);
  const [showFooter, setShowFooter] = useState(true);
  const [showBackground, setShowBackground] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Hide navigation, header, footer and custom background on the journey page
    if (location.pathname === '/journey') {
      setShowNavigation(false);
      setShowHeader(false);
      setShowFooter(false);
      setShowBackground(false);
    } else {
      // Đảm bảo các thành phần UI được hiển thị lại khi chuyển từ trang hành trình sang trang khác
      setTimeout(() => {
        setShowNavigation(true);
        setShowHeader(true);
        setShowFooter(true);
        setShowBackground(true);
      }, 0);
    }
  }, [location.pathname]);

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <EnhancedBackground intensity="medium" />
        <div className="relative z-10 text-center">
          <div className="w-8 h-8 border-2 border-[#1A1033] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#1A1033] opacity-70">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLogin={() => window.location.reload()} />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Add ScrollToTop component to handle scrolling on route changes */}
      <ScrollToTop />

      {showBackground && <EnhancedBackground intensity="medium" />}

      {showHeader && <Header />}

      <main>
        <AnimatedRoutes />
      </main>

      {showNavigation && <Navigation />}
      {showFooter && <Footer />}
    </div>
  );
}

// Wrapper to provide location context and auth
const AppWithRouter = () => {
  return (
    <AuthProvider>
      <Router>
        <App />
      </Router>
    </AuthProvider>
  );
};

export default AppWithRouter;
