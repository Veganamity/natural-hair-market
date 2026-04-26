import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { Layout } from './components/layout/Layout'
import { HomePage } from './pages/HomePage'
import { ListingsPage } from './pages/ListingsPage'
import { ListingDetailPage } from './pages/ListingDetailPage'
import { CreateListingPage } from './pages/CreateListingPage'
import { MyListingsPage } from './pages/MyListingsPage'
import { OrdersPage } from './pages/OrdersPage'
import { ProfilePage } from './pages/ProfilePage'
import { FavoritesPage } from './pages/FavoritesPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { AdminPage } from './pages/AdminPage'
import { SettingsPage } from './pages/SettingsPage'
import { NotFoundPage } from './pages/NotFoundPage'


export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/annonces" element={<ListingsPage />} />
            <Route path="/annonces/:id" element={<ListingDetailPage />} />
            <Route path="/vendre" element={<CreateListingPage />} />
            <Route path="/mes-annonces" element={<MyListingsPage />} />
            <Route path="/commandes" element={<OrdersPage />} />
            <Route path="/profil" element={<ProfilePage />} />
            <Route path="/favoris" element={<FavoritesPage />} />
            <Route path="/connexion" element={<LoginPage />} />
            <Route path="/inscription" element={<RegisterPage />} />
            <Route path="/parametres" element={<SettingsPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  )
}
