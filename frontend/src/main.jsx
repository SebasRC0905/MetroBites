import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CartProvider } from './context/CartContext';

import { AuthProvider } from './context/AuthContext.jsx';



ReactDOM.createRoot(
    document.getElementById('root')
).render(

    <AuthProvider>

        <CartProvider>

            <App />

        </CartProvider>

    </AuthProvider>

);
