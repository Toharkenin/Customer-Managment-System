import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'
import { AuthProvider } from './AuthContext'
import Login from './pages/login/Login'
import MainPage from './pages/mainPage/MainPage'
import EditCustomer from './pages/editCustomer/EditCustomer'
import HealthStatement from './components/healthStatement/HealthStatement'
import CustomerCard from './components/customerCard/CustomerCard'
import NewCustomer from './pages/newCustomer/NewCustomer'
import StatementsPage from './pages/statementsPage/StatementsPage'
import Confirmation from './components/confirmation/Confirmation'
import ViewHealthStatements from './pages/viewHealthStatements/ViewHealthStatements'
import ProtectedRoute from './routes/ProtectedRoute'
import { useEffect } from 'react'
import ExistingStatements from './components/existingStatements/ExistingStatements'
import { getAuth, signOut } from 'firebase/auth'
import NotificationsPage from './pages/notificationsPage/NotificationsPage'


function App() {
  const maxSessionDuration = 7 * 24 * 60 * 60 * 1000;

  useEffect(() => {
    const checkSessionExpiration = async () => {
      const loginTime = localStorage.getItem("loginTime");

      if (loginTime && Date.now() - parseInt(loginTime) > maxSessionDuration) {
        const auth = getAuth();
        await signOut(auth);
        localStorage.removeItem("loginTime");
        localStorage.removeItem("token");
      }
    };

    checkSessionExpiration();
  }, []);

  return (
    <div dir="rtl">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Routes>
                    <Route path="/Edit-Customer/:id" element={<EditCustomer />} />
                    <Route path="/" element={<MainPage />} />
                    <Route path="/Form" element={<NewCustomer />} />
                    <Route path="/Health-Statement/:id" element={<HealthStatement customerEmail='' onNext={() => { }} />} />
                    <Route path="/Statements-Page/:id" element={<StatementsPage />} />
                    <Route path="/Customer-Card/:id" element={<CustomerCard />} />
                    <Route path="/Confirmation/:id" element={<Confirmation customerEmail='' />} />
                    <Route path="/Health-statements-view/:id" element={<ViewHealthStatements />} />
                    <Route path="/Statements/:id" element={<ExistingStatements />} />
                    <Route path="/Notifications" element={<NotificationsPage />} />
                  </Routes>
                </ProtectedRoute>
              } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  )
};

export default App;



//<Route path="*" element={<NotFound />} />

//react.lazy
//import { Suspense, lazy } from 'react';
// const Login = lazy(() => import('./pages/login/Login'));
// const MainPage = lazy(() => import('./pages/mainPage/MainPage'));
// const EditCustomer = lazy(() => import('./pages/editCustomer/EditCustomer'));