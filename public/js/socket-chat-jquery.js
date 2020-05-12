
var params = new URLSearchParams(window.location.search);
var usuario = params.get('nombre');
var sala = params.get('sala');
var imagen = params.get('imagen');
var idUser = null;
var tipoMensaje = 'pub';
//referencias jquery
var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtmensaje = $('#txtmensaje');
var divChatbox = $('#divChatbox');

$("#buscar").on("keyup", function() {
    var patron = $(this).val();
    // si el campo está vacío
    if (patron == "") {
      // mostrar todos los elementos
      $(".lista").css("display", "list-item");
      // si tiene valores, realizar la búsqueda
    } else {
      // atravesar la lista
      $(".lista").each(function() {
        if ($(this).text().indexOf(patron) < 0) {
          // si el texto NO contiene el patrón de búsqueda, esconde el elemento
          $(this).css("display", "none");
        } else {
          // si el texto SÍ contiene el patrón de búsqueda, muestra el elemento
          $(this).css("display", "list-item");
        }
      });
    }
  });
//funciones para renderizar usuarios 
function renderizarUsuarios(personas) {
    console.log(personas);

    var html = '';
    html += '<li class="lista">';
    html += '      <a href="javascript:void(0)" class="active"> Chat de <span> ' + params.get('sala') + '</span></a>';
    html += '</li>';
    for (let i = 0; i < personas.length; i++) {
        var param = personas[i].nombre;
        html += '<li class="lista" >'
        html += '      <a data-id="' + personas[i].id + '" href="javascript:void(0)"><img src="assets/images/users/'+personas[i].imagen+'" alt="user-img" class="img-circle"> <span>' + personas[i].nombre + ' <small class="text-success">online</small></span></a>'
        html += '</li>'

    }
    divUsuarios.html(html);
}
function renderizarMensajes(mensaje, Im) {
    //continua AQUI <---------------------
    var html = '';
    var fecha = new Date(mensaje.fecha);
    var hora = fecha.getHours() + ':' + fecha.getMinutes();
    var adminClass = 'info';
    if(mensaje.nombre === 'Administrador'){
        adminClass = 'danger'
    }
    if (Im) {
        html += '<li class="reverse">';
        html += '    <div class="chat-content">';
        html += '        <h5>' + mensaje.nombre + '</h5>';
        html += '        <div class="box bg-light-inverse">' + mensaje.mensaje + '</div>';
        html += '    </div>';
        html += '    <div class="chat-img"><img src="assets/images/users/' + mensaje.imagen + '" alt="user" /></div>';
        html += '    <div class="chat-time">' + hora + '</div>';
        html += '</li>';
    } else {
        html += '<li class="animated fadeIn">';
        if(mensaje.nombre !== 'Administrador'){
            html += '    <div class="chat-img"><img src="assets/images/users/' + mensaje.imagen + '" alt="user" /></div>';
        }
        html += '    <div class="chat-content">';
        html += '        <h5>' + mensaje.nombre + '</h5>';
        html += '        <div class="box bg-light-'+adminClass+'">' + mensaje.mensaje + '</div>';
        html += '        </div>';
        html += '    <div class="chat-time">' + hora + '</div>';
        html += '</li>';
    }
    divChatbox.append(html);
}
function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}
function limpiarMensaje(){
    divChatbox.html('');
}
//listeners 
divUsuarios.on('click', 'a', function (e) {
    var id = $(this).data('id');
    if(idUser == id){

    }else{
        idUser = id;
        var titulo = $(this).find('span').first()[0].innerText;
        titulo = titulo.replace('online','');
        // titulo = titulo.slice(0, -7)
        $('#title').text(titulo);
        console.log(id);
        if (id) {
            tipoMensaje = 'pri';
        }else{
            tipoMensaje = 'pub';
        }
        // limpiarMensaje();
    }
});
formEnviar.on('submit', function (e) {
    e.preventDefault();
    console.log(txtmensaje.val().trim().length);

    if (txtmensaje.val().trim().length === 0) {
        return
    }
    if(tipoMensaje == 'pub'){
        console.log('enviado publico');
        // Enviar información
        socket.emit('crearMensaje', {
            nombre: usuario,
            mensaje: txtmensaje.val(),
            imagen:imagen
        }, function (mensaje) {
            txtmensaje.val('').focus();
            renderizarMensajes(mensaje,true);
            scrollBottom();
        });
    }else{
        console.log('enviado privado');
        socket.emit('mensajePrivado',{
            nombre: usuario,
            mensaje: txtmensaje.val(),
            para: idUser,
            imagen:imagen
        }, function (mensaje) {
            txtmensaje.val('').focus();
            renderizarMensajes(mensaje,true);
            scrollBottom();
        });

    }


})
