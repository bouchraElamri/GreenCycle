import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import PublicRoutes from './router/PublicRoutes';
import AuthProvider from './contexts/AuthProvider';
import AdminRoutes from './router/AdminRoutes';
import ClientRoutes from './router/ClientRoutes';
/*Delete Profile Edit after testing */
import ProfileEdit from './pages/client/profile/ProfileEdit';
import { CartProvider } from './contexts/CartProvider';
import { Toaster } from 'react-hot-toast';

function App() {
 
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/*" element={<PublicRoutes />} />
            <Route path="/admin/*" element={<AdminRoutes />} />
            <Route path="/client/*" element={<ClientRoutes />} />
            <Route path="/client/profile/edit" element={<ProfileEdit />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
       <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />
    </BrowserRouter>
    

  );
}

export default App;