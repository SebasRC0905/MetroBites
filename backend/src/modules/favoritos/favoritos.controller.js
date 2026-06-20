const favoritosService =
require('./favoritos.service');

const getFavorites = async (
    req,
    res
) => {

    try {

        const favoritos =
            await favoritosService.getFavorites(
                req.user.id
            );

        res.json({
            success: true,
            data: favoritos
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const addFavorite = async (
    req,
    res
) => {

    try {

        await favoritosService.addFavorite(
            req.user.id,
            req.body.producto_id
        );

        res.status(201).json({
            success: true,
            message: 'Favorito agregado'
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const removeFavorite = async (
    req,
    res
) => {

    try {

        await favoritosService.removeFavorite(
            req.user.id,
            req.params.productoId
        );

        res.json({
            success: true,
            message: 'Favorito eliminado'
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    getFavorites,
    addFavorite,
    removeFavorite
};