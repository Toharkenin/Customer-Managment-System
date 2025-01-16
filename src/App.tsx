import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'
import { AuthProvider } from './AuthContext'
import ClientForm from './pages/form/ClientForm'
import Login from './pages/login/Login'
import MainPage from './pages/mainPage/MainPage'
import EditCustomer from './pages/editCustomer/EditCustomer'
import HealthStatement from './components/healthStatement/HealthStatement'
import CustomerCard from './components/customerCard/CustomerCard'

function App() {

  return (
    <div dir="rtl">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/Form" element={<ClientForm />} />
            <Route path="/Edit-Customer/:id" element={<EditCustomer />} />
            <Route path="/Health-Statement/:id" element={<HealthStatement customerEmail='' />} />
            <Route path="/Customer-Card/:id" element={<CustomerCard customerEmail='' />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  )
};

export default App;
