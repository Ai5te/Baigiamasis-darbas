import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router';
import Header from './components/header/Header';
import Home from './pages/Home';
import Deposit from './pages/Deposit';
import Withdraw from './pages/Withdraw';
import AllData from './pages/AllData';
import Login from './pages/Login';
import Footer from './components/footer/Footer';

const App = () => {

  return (
    <>
      <BrowserRouter>
        <Header />
          <div className="container"> 
            <Routes>
              <Route path="/" element={<Home/>} />
              <Route path="/deposit" element={<Deposit/>} />
              <Route path="/withdraw" element={<Withdraw/>} />
              <Route path="/alldata" element={<AllData/>} />
              <Route path="/login" element={<Login/>} />
            </Routes>
          </div>
        <Footer />
      </BrowserRouter>
      
    </>
  )
}

export default App
