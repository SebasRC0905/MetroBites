import {
    useNavigate
} from 'react-router-dom';

import {
    useAuth
} from '../../context/AuthContext';

function Dashboard() {

    const {
        user,
        logout
    } = useAuth();

    const navigate =
        useNavigate();

    const handleLogout =
    () => {

        logout();

        navigate('/');

    };

    return (

        <div>

            <h1>
                Dashboard MetroBites
            </h1>

            <p>
                {user?.nombre}
            </p>

            <p>
                {user?.correo}
            </p>

            <p>
                {user?.rol}
            </p>

            <button
                onClick={
                    handleLogout
                }
            >
                Cerrar sesión
            </button>

        </div>

    );

}

export default Dashboard;