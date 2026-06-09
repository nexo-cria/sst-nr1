import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Landing Page Components
import Header from './components/Header';
import Hero from './components/Hero';

import Features from './components/Features';
import Compliance from './components/Compliance';
import HowItWorks from './components/HowItWorks';
import Pricing from './components/Pricing';

import FAQ from './components/FAQ';
import CTA from './components/CTA';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import WhatsAppButton from './components/WhatsAppButton';

// Auth & Dashboard
import Login from './pages/Login';
import CadastroConvite from './pages/CadastroConvite';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/dashboard/DashboardLayout';
import Dashboard from './pages/dashboard/Dashboard';
import Empresas from './pages/dashboard/Empresas';
import Funcionarios from './pages/dashboard/Funcionarios';
import Convites from './pages/dashboard/Convites';
import Documentos from './pages/dashboard/Documentos';
import Treinamentos from './pages/dashboard/Treinamentos';
import EPIs from './pages/dashboard/EPIs';
import CheckinDiario from './pages/dashboard/CheckinDiario';
import GestaoCheckins from './pages/dashboard/GestaoCheckins';
import GestaoUsuarios from './pages/dashboard/GestaoUsuarios';
import Assinaturas from './pages/dashboard/Assinaturas';
import RelatoriosAdmin from './pages/dashboard/RelatoriosAdmin';
import ConfiguracoesAdmin from './pages/dashboard/ConfiguracoesAdmin';
import RelatoriosRH from './pages/dashboard/RelatoriosRH';
import ConfiguracoesRH from './pages/dashboard/ConfiguracoesRH';
import CheckinsAlertasRH from './pages/dashboard/CheckinsAlertasRH';
import MeusDadosColaborador from './pages/dashboard/MeusDadosColaborador';
import PlaceholderPage from './pages/dashboard/PlaceholderPage';

// Landing Page Component
function LandingPage() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-white font-sans antialiased">
        <Header />
        <main>
          <Hero />
          <Features />
          <Compliance />
          <HowItWorks />
          <Pricing />
          <FAQ />
          <CTA />
          <Contact />
        </main>
        <Footer />
        <CartDrawer />
        <WhatsAppButton />
      </div>
    </CartProvider>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<CadastroConvite />} />

          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            
            {/* Super Admin Routes */}
            <Route
              path="empresas"
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <Empresas />
                </ProtectedRoute>
              }
            />
            <Route
              path="usuarios"
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <GestaoUsuarios />
                </ProtectedRoute>
              }
            />
            <Route
              path="checkins-geral"
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <GestaoCheckins />
                </ProtectedRoute>
              }
            />
            <Route path="assinaturas" element={<ProtectedRoute allowedRoles={['super_admin']}><Assinaturas /></ProtectedRoute>} />

            {/* RH Routes */}
            <Route
              path="gestao-checkins"
              element={
                <ProtectedRoute allowedRoles={['rh']}>
                  <GestaoCheckins />
                </ProtectedRoute>
              }
            />
            <Route path="relatorios" element={<ProtectedRoute allowedRoles={['rh']}><RelatoriosRH /></ProtectedRoute>} />
            <Route path="configuracoes" element={<ProtectedRoute allowedRoles={['rh']}><ConfiguracoesRH /></ProtectedRoute>} />
            <Route path="checkins-alertas" element={<ProtectedRoute allowedRoles={['rh']}><CheckinsAlertasRH /></ProtectedRoute>} />
            <Route
              path="convites"
              element={
                <ProtectedRoute allowedRoles={['rh']}>
                  <Convites />
                </ProtectedRoute>
              }
            />
            <Route
              path="funcionarios"
              element={
                <ProtectedRoute allowedRoles={['rh']}>
                  <Funcionarios />
                </ProtectedRoute>
              }
            />
            <Route
              path="documentos"
              element={
                <ProtectedRoute allowedRoles={['rh']}>
                  <Documentos />
                </ProtectedRoute>
              }
            />
            <Route
              path="treinamentos"
              element={
                <ProtectedRoute allowedRoles={['rh']}>
                  <Treinamentos />
                </ProtectedRoute>
              }
            />
            <Route
              path="epis"
              element={
                <ProtectedRoute allowedRoles={['rh']}>
                  <EPIs />
                </ProtectedRoute>
              }
            />

            {/* Colaborador Routes */}
            <Route
              path="checkin-diario"
              element={
                <ProtectedRoute allowedRoles={['colaborador']}>
                  <CheckinDiario />
                </ProtectedRoute>
              }
            />
            <Route
              path="meus-dados"
              element={
                <ProtectedRoute allowedRoles={['colaborador']}>
                  <PlaceholderPage title="Meus Dados" description="Visualize e atualize seus dados cadastrais." />
                </ProtectedRoute>
              }
            />
            <Route
              path="meus-documentos"
              element={
                <ProtectedRoute allowedRoles={['colaborador']}>
                  <PlaceholderPage title="Meus Documentos" description="Acesse seus documentos de SST." />
                </ProtectedRoute>
              }
            />
            <Route
              path="meus-treinamentos"
              element={
                <ProtectedRoute allowedRoles={['colaborador']}>
                  <PlaceholderPage title="Meus Treinamentos" description="Veja seus treinamentos e certificados." />
                </ProtectedRoute>
              }
            />
            <Route
              path="meus-epis"
              element={
                <ProtectedRoute allowedRoles={['colaborador']}>
                  <PlaceholderPage title="Meus EPIs" description="Consulte os EPIs entregues a você." />
                </ProtectedRoute>
              }
            />

            {/* Shared Routes - Admin */}
            <Route path="relatorios" element={<ProtectedRoute allowedRoles={['super_admin']}><RelatoriosAdmin /></ProtectedRoute>} />
            <Route path="configuracoes" element={<ProtectedRoute allowedRoles={['super_admin']}><ConfiguracoesAdmin /></ProtectedRoute>} />

            {/* Colaborador */}
            <Route path="meus-dados" element={<ProtectedRoute allowedRoles={['colaborador']}><MeusDadosColaborador /></ProtectedRoute>} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </HashRouter>
  );
}
