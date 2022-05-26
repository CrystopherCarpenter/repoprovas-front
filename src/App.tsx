import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './css/App.css';
import Header from './components/Header/index';
import SignIn from './pages/SignIn/index';
import Signup from './pages/Signup/index';
import Main from './pages/Main/index';
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
                        <Route path="/" element={<SignIn />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/main" element={<Main />} />
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </>
    );
}

export default App;
