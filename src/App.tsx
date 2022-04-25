import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './css/App.css';
import Header from './components/Header/index';
import Login from './pages/Login/index';
import Signup from './pages/Signup/index';
import Repo from './pages/Repo/index';
import { AuthProvider } from './contexts/AuthContext';
import { GlobalStyle } from './css/style';

function App() {
    return (
        <>
            <GlobalStyle />
            <AuthProvider>
                <BrowserRouter>
                    <Header />
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/repo" element={<Repo />} />
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </>
    );
}

export default App;
