import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'
import { AuthProvider, useAuth } from './AuthContext'
import ClientForm from './pages/form/ClientForm'
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
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'

function App() {

  // const { admin, login, logout, isAuthenticated } = useAuth();

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       console.log("Logged in user:", user);
  //       login(user.email);
  //     } else {
  //       console.log("No user logged in");
  //       logout();
  //     }
  //   });

  //   return () => unsubscribe();
  // }, [login, logout]);

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
                    <Route path="/Form2" element={<ClientForm />} />
                    <Route path="/Form" element={<NewCustomer />} />

                    <Route path="/Health-Statement/:id" element={<HealthStatement customerEmail='' onNext={() => { }} />} />
                    <Route path="/Statements-Page/:id" element={<StatementsPage />} />
                    <Route path="/Customer-Card/:id" element={<CustomerCard />} />
                    <Route path="/Confirmation/:id" element={<Confirmation customerEmail='' />} />
                    <Route path="/Health-statements-view/:id" element={<ViewHealthStatements />} />
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