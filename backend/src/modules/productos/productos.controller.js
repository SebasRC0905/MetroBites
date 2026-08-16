const productosService =
require('./productos.service');

const getProducts = async (req, res) => {

    try {

        const productos =
            await productosService.getAllProducts();

        res.json({
            success: true,
            data: productos
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const getProduct = async (
    req,
    res
) => {

    try {

        const resultado =
            await productosService.getProductById(
                req.params.id
            );

        if (!resultado) {

            return res.status(404).json({
                success: false,
                message:
                    'Producto no encontrado'
            });

        }

        /*
         Las personalizaciones viajan dentro de `data` (que es como las
         consume la app). El campo suelto se mantiene por compatibilidad
         con las llamadas viejas.
        */
        res.json({
            success: true,
            data: {
                ...resultado.producto,
                personalizaciones:
                    resultado.personalizaciones
            },
            personalizaciones:
                resultado.personalizaciones
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const getProductsByCategory =
async (req, res) => {

    try {

        const productos =
            await productosService.getProductsByCategory(
                req.params.id
            );

        res.json({
            success: true,
            data: productos
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
const getProductDetail = async (req, res) => {

    try {

        const producto =
            await productosService.getProductDetail(
                req.params.id
            );

        if (!producto) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }

        res.json({
            success: true,
            data: producto
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
const createProduct = async (
    req,
    res
) => {

    try {

        const resultado =
            await productosService.createProduct(
                req.body
            );

        res.status(201).json({
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

const updateProduct = async (
    req,
    res
) => {

    try {

        const resultado =
            await productosService.updateProduct(
                req.params.id,
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

const toggleProductAvailability =
async (
    req,
    res
) => {

    try {

        const resultado =
            await productosService.toggleAvailability(
                req.params.id,
                req.body.disponible
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
const getProductsAdmin =
async (
    req,
    res
) => {

    try {

        const productos =
            await productosService
                .getAllProductsAdmin();

        res.json({
            success: true,
            data: productos
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
module.exports = {
    getProducts,
    getProduct,
    getProductsByCategory,
    getProductDetail,
    createProduct,
    updateProduct,
    toggleProductAvailability,
    getProductsAdmin
};