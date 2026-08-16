const usuariosService =
require('./usuarios.service');

const getProfile = async (
    req,
    res
) => {

    try {

        const usuario =
            await usuariosService.getProfile(
                req.user.id
            );

        res.json({
            success: true,
            data: usuario
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const updateProfile = async (
    req,
    res
) => {

    try {

        const resultado =
            await usuariosService.updateProfile(
                req.user.id,
                req.body
            );

        res.json({
            success: true,
            data: resultado
        });

    } catch (error) {

        /* Nombre vacío o nivel de picante inválido son errores del
           formulario, no del servidor. */
        res.status(400).json({
            success: false,
            message: error.message
        });

    }

};

/** Sube (o reemplaza) la foto de perfil del usuario en sesión. */
const updateProfilePhoto = async (
    req,
    res
) => {

    try {

        if (!req.file) {

            return res.status(400).json({
                success: false,
                message: 'No se recibió ninguna imagen'
            });

        }

        const usuario =
            await usuariosService.updateProfilePhoto(
                req.user.id,
                `/uploads/${req.file.filename}`
            );

        res.json({
            success: true,
            data: usuario
        });

    } catch (error) {

        console.error(error);

        res.status(400).json({
            success: false,
            message: error.message
        });

    }

};

/** Quita la foto y regresa a las iniciales. */
const deleteProfilePhoto = async (
    req,
    res
) => {

    try {

        const usuario =
            await usuariosService.updateProfilePhoto(
                req.user.id,
                null
            );

        res.json({
            success: true,
            data: usuario
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }

};

const changePassword = async (
    req,
    res
) => {

    try {

        const resultado =
            await usuariosService.changePassword(
                req.user.id,
                req.body.actual,
                req.body.nueva
            );

        res.json({
            success: true,
            data: resultado
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }

};

/** Catálogo de alergias y estilos de vida para el perfil. */
const getCatalogoPreferencias = async (
    req,
    res
) => {

    try {

        const preferencias =
            await usuariosService.getCatalogoPreferencias();

        res.json({
            success: true,
            data: preferencias
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const getAllUsersAdmin = async (
    req,
    res
) => {

    try {

        const usuarios =
            await usuariosService.getAllUsersAdmin();

        res.json({
            success: true,
            data: usuarios
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const createUserAdmin = async (
    req,
    res
) => {

    try {

        const resultado =
            await usuariosService.createUserAdmin(
                req.body
            );

        res.status(201).json({
            success: true,
            data: resultado
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }

};

const updateUserAdmin = async (
    req,
    res
) => {

    try {

        const resultado =
            await usuariosService.updateUserAdmin(
                req.params.id,
                req.body
            );

        res.json({
            success: true,
            data: resultado
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }

};

const deleteUserAdmin = async (
    req,
    res
) => {

    try {

        if (
            Number(req.params.id) ===
            Number(req.user.id)
        ) {

            return res.status(400).json({
                success: false,
                message:
                    'No puedes eliminar tu propio usuario'
            });

        }

        const resultado =
            await usuariosService.deleteUserAdmin(
                req.params.id
            );

        res.json({
            success: true,
            data: resultado
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    getProfile,
    updateProfile,
    updateProfilePhoto,
    deleteProfilePhoto,
    changePassword,
    getCatalogoPreferencias,
    getAllUsersAdmin,
    createUserAdmin,
    updateUserAdmin,
    deleteUserAdmin
};
