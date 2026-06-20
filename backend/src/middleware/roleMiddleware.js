const roleMiddleware = (...rolesPermitidos) => {

    return (req, res, next) => {

        if (
            !req.user ||
            !rolesPermitidos.includes(
                req.user.rol
            )
        ) {

            return res.status(403).json({
                success: false,
                message:
                    'No tiene permisos para realizar esta acción'
            });

        }

        next();

    };

};

module.exports = roleMiddleware;