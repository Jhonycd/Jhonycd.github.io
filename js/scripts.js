/* -------------------------------------- */
/*          VARIABLES GLOBALES            */
/* -------------------------------------- */
let listaProductos = [];

/* -------------------------------------- */
/*          FUNCIONES GLOBALES            */
/* -------------------------------------- */

/*         Funcion para registrar service worker          */
function registrarServiceWorker() {
  if ("serviceWorker" in navigator) {
    this.navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        console.log("El service worker se ha registrado corectamente", reg);
      })
      .catch((err) => {
        console.error("Error al registrar el service worker", err);
      });
  } else {
    console.error("service worker no está disponible en navigator");
  }
}

async function renderLista() {
  const plantilla = await $.ajax({ url: "plantillas/productos.hbs" });
  const template = Handlebars.compile(plantilla);
  listaProductos = await apiProductos.get();
  const html = template({ listaProductos: listaProductos });
  $("#lista").html(html);
  const ul = $("#contenedorLista");
  componentHandler.upgradeElements(ul);
}

async function borrarProd(id) {
  await apiProductos.delete(id);
  renderLista();
}

async function cambiarValorProd(que, id, el) {
  const cual = listaProductos.findIndex((p) => p.id == id);
  const valor = el.value;
  listaProductos[cual][que] =que == "cantidad" ? parseInt(valor) : parseFloat(valor);

  const producto = listaProductos[cual];
  await apiProductos.put(id, producto);
}

function configurarListenersMenu() {
  /* botón agregar producto */
  $("#btn-entrada-producto").click(async () => {
    //el async va en la funcion mas proxima al await, por eso lo pongo en esta funcion callback
    const input = $("#Agregar-Producto");
    const nombre = input.val();
    const producto = { nombre: nombre, cantidad: 1, precio: 0 };
    await apiProductos.post(producto);
    renderLista();
    input.val("");
  });

  /* botón borrar todo */
  $("#btn-borrar-productos").click(() => {
    if (listaProductos.length) {
      var dialog = $("dialog")[0];
      dialog.showModal();
    }
  });
}

function iniDialog() {
  var dialog = $("dialog")[0];
  if (!dialog.showModal) {
    dialogPolyfill.registerDialog(dialog);
 }
 
 $('dialog .aceptar').click(async ()=>  {
  dialog.close()
await apiProductos.deleteAll()
  renderLista();
 });
 
  $('dialog .cancelar').click( ()=> {
    dialog.close();
  });

  
  
  
  
  
  /*dialog.querySelector(".cancelar").addEventListener("click", function () {
    dialog.close();
  });
  dialog.querySelector(".aceptar").addEventListener("click", function () {
    dialog.close();*/
    
}

/*
No me funciono usando jquery en la funcion iniDialog
 $("dialog.aceptar").click(function () {
    dialog.close();
    listaProductos = [];
    renderLista;
  });
 
 */

async function testHandlebars() {
  //lo hacemos para probar que funcione handlebars en principio, despues lo comentamos
  //Es una plantilla que se parece a html, tiene la particularidad de manejar datos en plantillas
  //EJEMPLO 1
  // compile the template
  // const template = Handlebars.compile("Handlebars <b>{{doesWhat}}</b>");
  // execute the compiled template and print the output to the console
  //const html = template({ doesWhat: "rocks!" });
  //console.log(html);

  //EJEMPLO 2
  // compile the template
  //const template = Handlebars.compile("<p>{{firstname}} {{lastname}}</p>");
  // execute the compiled template and print the output to the console
  //const html = template({
  //firstname: "Yehuda",
  //lastname: "Katz",
  //});
  //console.log(html);

  //--------EJEMPLO 1 con AJAX (async/await)
  //pido la plantilla al servidor con ajax
  const plantilla = await $.ajax({ url: "plantillas/ejemplo1.hbs" });
  // compile the template
  const template = Handlebars.compile(plantilla);
  // execute the compiled template and print the output to the console
  const html = template({ doesWhat: "rocks!" });
  console.log(html);

  $("#lista").html(html);
}

function start() {
  console.warn($("title").text());
  registrarServiceWorker();
  iniDialog();
  configurarListenersMenu();
  renderLista();
}

/* -------------------------------------- */
/*               EJECUCIÓN                */
/* -------------------------------------- */
//start();

//otras formas de iniciar el programa, con el evento onload, o con evento onload y funcion flecha
//window.onload = start;
//window.onload = () => start();

//inicializo con jquery
$(document).ready(start); //ejecuta start cuando todo este cargado
