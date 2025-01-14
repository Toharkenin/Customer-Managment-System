import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'
import { AuthProvider } from './AuthContext'
import ClientForm from './pages/form/ClientForm'
import Login from './pages/login/Login'
import MainPage from './pages/mainPage/MainPage'
import EditCustomer from './components/editCustomer/EditCustomer'

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
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  )
};

export default App;
