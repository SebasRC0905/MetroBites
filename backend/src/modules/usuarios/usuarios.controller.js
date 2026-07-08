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
    getAllUsersAdmin,
    createUserAdmin,
    updateUserAdmin,
    deleteUserAdmin
};
