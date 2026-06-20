import {
    Navigate,
    Outlet
} from 'react-router-dom';

import {
    useAuth
} from '../context/AuthContext';

function PrivateRoute() {

    const {
        user,
        loading
    } = useAuth();

    if (loading) {

        return (
            <h2>
                Cargando...
            </h2>
        );

    }

    return user
        ? <Outlet />
        : <Navigate to="/" />;
}

export default PrivateRoute;