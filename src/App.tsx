
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CatalogProvider } from "./contexts/CatalogContext";

// Layout Components
import Header from "./components/Header";
import Footer from "./components/Footer";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import CatalogPage from "./pages/CatalogPage";
import PricingPage from "./pages/PricingPage";
import NotFoundPage from "./pages/NotFound";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";

const queryClient = new QueryClient();

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <div className="flex-1">{children}</div>
    <Footer />
  </div>
);

const NoHeaderLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    {children}
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CatalogProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout><HomePage /></Layout>} />
              <Route path="/login" element={<NoHeaderLayout><LoginPage /></NoHeaderLayout>} />
              <Route path="/register" element={<NoHeaderLayout><RegisterPage /></NoHeaderLayout>} />
              <Route path="/dashboard" element={<Layout><DashboardPage /></Layout>} />
              <Route path="/catalogo/:id" element={<NoHeaderLayout><CatalogPage /></NoHeaderLayout>} />
              <Route path="/planos" element={<Layout><PricingPage /></Layout>} />
              <Route path="/termos" element={<Layout><TermsPage /></Layout>} />
              <Route path="/privacidade" element={<Layout><PrivacyPage /></Layout>} />
              <Route path="*" element={<NoHeaderLayout><NotFoundPage /></NoHeaderLayout>} />
            </Routes>
          </BrowserRouter>
        </CatalogProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
