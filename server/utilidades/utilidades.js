const crearMensaje = (nombre,mensaje,imagen)=>{
    return {
        nombre,
        mensaje,
        fecha: new Date().getTime(),
        imagen
    }
}

module.exports = {
    crearMensaje
}