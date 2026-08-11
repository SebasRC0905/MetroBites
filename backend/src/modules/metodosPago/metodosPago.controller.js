const metodosPagoService = require('./metodosPago.service');

const getMethods = async (req, res) => {

    try {

        const metodos = await metodosPagoService.getUserMethods(req.user.id);

        res.json({
            success: true,
            data: metodos
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const createMethod = async (req, res) => {

    try {

        const resultado = await metodosPagoService.createMethod(
            req.user.id,
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

const setDefaultMethod = async (req, res) => {

    try {

        const resultado = await metodosPagoService.setDefaultMethod(
            req.user.id,
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

const deleteMethod = async (req, res) => {

    try {

        const resultado = await metodosPagoService.deleteMethod(
            req.user.id,
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
    getMethods,
    createMethod,
    setDefaultMethod,
    deleteMethod
};
