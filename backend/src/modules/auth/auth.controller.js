const authService = require('./auth.service');

const register = async (req, res) => {

    try {

        const result = await authService.registerUser(req.body);

        res.status(201).json({
            success: true,
            message: 'Usuario registrado correctamente',
            userId: result.insertId
        });

    } catch (error) {

        console.error(error);

        /*
         Correo no institucional, matrícula repetida o contraseña débil
         son errores del formulario, no fallas del servidor: se
         responden como 400 para que la app los muestre tal cual.
        */
        res.status(400).json({
            success: false,
            message: error.message
        });

    }
};

const login = async (req, res) => {

    try {

        const { correo, password } = req.body;

        const data = await authService.loginUser(
            correo,
            password
        );

        res.json({
            success: true,
            ...data
        });

    } catch (error) {

        res.status(401).json({
            success: false,
            message: error.message
        });

    }
};
const profile = async (
    req,
    res
) => {

    try {

        const usuario =
            await authService.getProfile(
                req.user.id
            );

        res.json({
            success: true,
            data: usuario
        });

    } catch (error) {

        res.status(404).json({
            success: false,
            message: error.message
        });

    }

};
module.exports = {
    register,
    login,
    profile
};