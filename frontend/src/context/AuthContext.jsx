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

    /*
     Vuelve a leer el perfil del servidor. Lo usa la pantalla de perfil
     después de guardar para que la foto y el nombre se actualicen al
     instante en la barra lateral y el menú.
    */
    const refreshUser = async () => {

        try {

            const response =
                await authService.getProfile();

            setUser(response.data);

            return response.data;

        } catch (error) {

            console.error(error);

            return null;
        }

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
                refreshUser,
                loading
            }}
        >

            {children}

        </AuthContext.Provider>

    );

};

export const useAuth =
() => useContext(AuthContext);