import './App.css'
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import Header from './components/header/Header';
import Home from './pages/Home';
import Deposit from './pages/Deposit';
import Withdraw from './pages/Withdraw';
import AllData from './pages/AllData';
import Login from './pages/Login';
import Footer from './components/footer/Footer';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      <BrowserRouter>
        <div className="app-container">
          <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            <main>
              <div className="container"> 
                <Routes>
                  <Route path="/" element={<Home/>} />
                  <Route path="/deposit" element={
                    <ProtectedRoute isLoggedIn={isLoggedIn}>
                      <Deposit/>
                    </ProtectedRoute>
                  } />
                  <Route path="/withdraw" element={
                    <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <Withdraw/>
                    </ProtectedRoute>
                  } />

                  <Route path="/alldata" element={
                    <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <AllData/>
                    </ProtectedRoute>
                } />
                  <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                </Routes>
              </div>
            </main>
          <Footer />
        </div>
      </BrowserRouter>
      
    </>
  )
}

export default App
