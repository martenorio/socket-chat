const { io } = require('../server');
const { crearMensaje } = require('../utilidades/utilidades');
const { Usuarios } = require('../classes/usuarios');
const usuarios = new Usuarios(); 

io.on('connection', (client) => {
    client.on('entrarChat',(data,callback) => {
        console.log(data);
        if(!data.nombre){
            return callback({
                err:true,
                mensaje:'El nombre/sala es necesario'
            })
        }
        client.join(data.sala)
        usuarios.agregarPersona(client.id,data.nombre,data.sala,data.imagen);
        client.broadcast.to(data.sala).emit('listaPersona',usuarios.getPersonasPorSala(data.sala));
        client.broadcast.to(data.sala).emit('crearMensaje',crearMensaje('Administrador',`${data.nombre} se unió ` ));
        callback(usuarios.getPersonasPorSala(data.sala));
    })
    client.on('crearMensaje',(data,callback)=>{
        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre,data.mensaje,data.imagen);
        client.broadcast.to(persona.sala).emit('crearMensaje',mensaje);
        callback(mensaje);
    })
    client.on('disconnect',()=>{
        let personaBorrada = usuarios.borrarPersonaod(client.id);

        client.broadcast.to(personaBorrada.sala).emit('crearMensaje',crearMensaje('Administrador',`${personaBorrada.nombre} abandonó el chat` ));
        client.broadcast.to(personaBorrada.sala).emit('listaPersona',usuarios.getPersonasPorSala(personaBorrada.sala));
    })
    //mensajes privados
    client.on('mensajePrivado',(data,callback)=>{
        let persona = usuarios.getPersona(client.id);
        mensaje = crearMensaje(persona.nombre + ' (privado)',data.mensaje,data.imagen);
        client.broadcast.to(data.para).emit('mensajePrivado',crearMensaje(persona.nombre+' (privado)',data.mensaje,data.imagen));
        callback(mensaje);
    })
});