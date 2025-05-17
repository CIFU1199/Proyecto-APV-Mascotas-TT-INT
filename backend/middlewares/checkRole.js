const checkRole = (rolesPermitidos) =>{
    return (req,res,next) =>{
        if(!rolesPermitidos.includes(req.user.rol)){
            return res.status(403).json({error: 'Acceso prohibido. Rol no autorizado!!'});
        }
        next();
    }
}

module.exports = checkRole;