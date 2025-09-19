import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import AddMedia from './components/AddMedia';
import LandingPage from './components/LandingPage';
import MediaList from './components/MediaList';
import MediaDetails from './components/MediaDetails';
import WelcomePage from './components/WelcomePage';
import InternalLayout from './components/InternalLayout';
import Navbar from './components/Navbar';
import Favoritos from './pages/Favoritos'; // <-- nuevo import

function App() {
    return (
        <Routes>
            {/* Páginas públicas SIN Navbar */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/welcome" element={<WelcomePage />} />
            {/* Páginas internas CON Navbar y fondo especial */}
            <Route path="/media" element={
                <InternalLayout>
                    <Navbar />
                    <MediaList />
                </InternalLayout>
            } />
            <Route path="/profile" element={
                <InternalLayout>
                    <Navbar />
                    <Profile />
                </InternalLayout>
            } />
            <Route path="/add-media" element={
                <InternalLayout>
                    <Navbar />
                    <AddMedia />
                </InternalLayout>
            } />
            <Route path="/media/:id" element={
                <InternalLayout>
                    <Navbar />
                    <MediaDetails />
                </InternalLayout>
            } />
            <Route path="/favoritos" element={
                <InternalLayout>
                    <Navbar />
                    <Favoritos />
                </InternalLayout>
            } />
        </Routes>
    );
}

export default App;