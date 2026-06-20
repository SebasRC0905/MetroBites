import {
    useEffect,
    useState
} from "react";

import profileService
from "../../services/profileService";

import "./Profile.css";

function Profile() {

    const [
        user,
        setUser
    ] = useState(null);

    const [
        saving,
        setSaving
    ] = useState(false);

    const [
        tolerancia,
        setTolerancia
    ] = useState("");

    useEffect(() => {

        const loadProfile =
        async () => {

            try {

                const response =
                    await profileService
                    .getProfile();

                setUser(
                    response.data
                );

                setTolerancia(
                    response.data
                    .tolerancia_picante
                );

            } catch (error) {

                console.error(error);

            }

        };

        loadProfile();

    }, []);

    const handleSave =
    async () => {

        try {

            setSaving(true);

            await profileService
                .updateProfile({
                    tolerancia_picante:
                        tolerancia
                });

            alert(
                "Perfil actualizado correctamente"
            );

        } catch (error) {

            console.error(error);

        } finally {

            setSaving(false);

        }

    };

    if (!user) {

        return (
            <p>
                Cargando...
            </p>
        );

    }

    return (

        <div className="profile-container">

            <h1>
                Mi Perfil
            </h1>

            <div className="profile-card">

                <div className="profile-avatar">

                    {
                        user.nombre
                        .charAt(0)
                        .toUpperCase()
                    }

                </div>

                <h2>
                    {user.nombre}
                </h2>

                <p>
                    {user.carrera}
                </p>

                <div className="profile-info">

                    <p>

                        <strong>
                            Matrícula:
                        </strong>

                        {user.matricula}

                    </p>

                    <p>

                        <strong>
                            Correo:
                        </strong>

                        {user.correo}

                    </p>

                    <p>

                        <strong>
                            Rol:
                        </strong>

                        {user.rol}

                    </p>

                </div>

                <div className="spicy-section">

                    <h3>
                        🌶 Preferencia de Picante
                    </h3>

                    <label>

                        <input
                            type="radio"
                            value="ninguno"
                            checked={
                                tolerancia ===
                                "ninguno"
                            }
                            onChange={(e) =>
                                setTolerancia(
                                    e.target.value
                                )
                            }
                        />

                        Ninguno

                    </label>

                    <label>

                        <input
                            type="radio"
                            value="medio"
                            checked={
                                tolerancia ===
                                "medio"
                            }
                            onChange={(e) =>
                                setTolerancia(
                                    e.target.value
                                )
                            }
                        />

                        Medio

                    </label>

                    <label>

                        <input
                            type="radio"
                            value="habanero"
                            checked={
                                tolerancia ===
                                "habanero"
                            }
                            onChange={(e) =>
                                setTolerancia(
                                    e.target.value
                                )
                            }
                        />

                        Habanero

                    </label>

                </div>

                <button
                    className="save-button"
                    onClick={handleSave}
                    disabled={saving}
                >

                    {

                        saving
                            ? "Guardando..."
                            : "Guardar Cambios"

                    }

                </button>

            </div>

        </div>

    );

}

export default Profile;   