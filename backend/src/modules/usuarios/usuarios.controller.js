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

module.exports = {
    getProfile,
    updateProfile
};