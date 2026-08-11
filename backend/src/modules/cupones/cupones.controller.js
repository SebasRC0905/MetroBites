const cuponesService = require('./cupones.service');

const getCoupons = async (req, res) => {

    try {

        const cupones = await cuponesService.getAllCoupons();

        res.json({
            success: true,
            data: cupones
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const createCoupon = async (req, res) => {

    try {

        const resultado = await cuponesService.createCoupon(req.body);

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

const deleteCoupon = async (req, res) => {

    try {

        const resultado = await cuponesService.deleteCoupon(req.params.id);

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

const validateCoupon = async (req, res) => {

    try {

        const resultado = await cuponesService.validateCoupon(
            req.body.codigo,
            req.body.subtotal
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
    getCoupons,
    createCoupon,
    deleteCoupon,
    validateCoupon
};
