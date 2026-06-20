import {
    useState
} from 'react';

import {
    useNavigate
} from 'react-router-dom';

import authService
from '../../services/authService';

import {
    useAuth
} from '../../context/AuthContext';

function Login() {

    const navigate =
        useNavigate();

    const {
        login
    } = useAuth();

    const [correo, setCorreo] =
        useState('');

    const [password, setPassword] =
        useState('');

    const handleSubmit =
        async (e) => {

        e.preventDefault();

        try {

            const response =
                await authService.login(
                    correo,
                    password
                );

            login(
                response.token,
                response.usuario
            );

            navigate(
                '/home'
            );

        } catch (error) {

            console.error(error);

            alert(
                'Credenciales incorrectas'
            );

        }

    };

    return (

        <div>

            <h1>
                MetroBites Login
            </h1>

            <form
                onSubmit={
                    handleSubmit
                }
            >

                <input
                    type="email"
                    placeholder="Correo"
                    value={correo}
                    onChange={(e) =>
                        setCorreo(
                            e.target.value
                        )
                    }
                />

                <br />
                <br />

                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) =>
                        setPassword(
                            e.target.value
                        )
                    }
                />

                <br />
                <br />

                <button
                    type="submit"
                >
                    Iniciar sesión
                </button>

            </form>

        </div>

    );

}

export default Login;