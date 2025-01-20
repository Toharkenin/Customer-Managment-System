import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'
import { AuthProvider } from './AuthContext'
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

function App() {

  return (
    <div dir="rtl">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/Form2" element={<ClientForm />} />
            <Route path="/Form" element={<NewCustomer />} />
            <Route path="/Edit-Customer/:id" element={<EditCustomer />} />
            <Route path="/Health-Statement/:id" element={<HealthStatement customerEmail='' onNext={() => { }} />} />
            <Route path="/Statements-Page/:id" element={<StatementsPage />} />
            <Route path="/Customer-Card/:id" element={<CustomerCard />} />
            <Route path="/Confirmation/:id" element={<Confirmation customerEmail='' />} />
            <Route path="/Health-statements-view/:id" element={<ViewHealthStatements />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  )
};

export default App;
