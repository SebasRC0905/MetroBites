import {
    createContext,
    useContext,
    useState,
    useEffect
} from 'react';

import authService
from '../services/authService';
const AuthContext = createContext();
export const AuthProvider =
({
    children
}) => {

    const [user, setUser] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const login = (
        token,
        usuario
    ) => {

        localStorage.setItem(
            'token',
            token
        );

        setUser(usuario);
    };

    const logout = () => {

        localStorage.removeItem(
            'token'
        );

        setUser(null);
    };

    useEffect(() => {

        const loadUser =
        async () => {

            const token =
                localStorage.getItem(
                    'token'
                );

            if (!token) {

                setLoading(false);
                return;
            }

            try {

                const response =
                    await authService.getProfile();

                setUser(
                    response.data
                );

            } catch (error) {

                console.error(error);

                localStorage.removeItem(
                    'token'
                );

                setUser(null);
            }

            setLoading(false);

        };

        loadUser();

    }, []);

    return (

        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                loading
            }}
        >

            {children}

        </AuthContext.Provider>

    );

};

export const useAuth =
() => useContext(AuthContext);