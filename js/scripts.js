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
  listaProductos[cual][que] =
    que == "cantidad" ? parseInt(valor) : parseFloat(valor);

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
  $("dialog .aceptar").click(async () => {
    dialog.close();
    await apiProductos.deleteAll();
    renderLista();
  });
  $("dialog .cancelar").click(() => {
    dialog.close();
  });
}

/*---------------------------------------------*/
/*----------------CACHE------------------------*/
/*-----Todos devuelven una promesa-------------*/

function testCache() {
  if (window.caches) {
    console.warn("El browser soporta caches");

    //console.log(caches)
    //Creo espacios de cache, puedo crear uno o varios  OPEN
    caches.open("prueba-1");
    caches.open("prueba-2");
    caches.open("prueba-3");
    caches.open("prueba-5");

    //has me revisa si existe un elemento en el cache, devuelve una promesa, un objeto promisse HAS
    caches.has("prueba-2").then((rta) => console.log(rta)); //true
    caches.has("prueba-4").then(console.log); //false

    //Borrar un cache DELETE
    caches.delete("prueba-1").then(console.log);

    //Recorrer y listar todos los nombres disponibles en caches  KEYS, tambien devuelve una promesa
    caches.keys().then(console.log);

    //Abro un cache disponoble y trabajo con el
    caches.open("cache-v1.1").then((cache) => {
      console.log("cache", cache);
      console.log("caches", caches);

      //Agrego un recurso al cache abierto, tambien devuelve una promesa,  ADD
      cache.add("/index.html");

      //Agrego varios recursos al cache abierto,van dentro de un array de recursos, tambien devuelve una promesa,  ADDALL
     cache.addAll([
      "/index.html",
      "/css/estilos.css",
      "/images/super.jpeg"
     ]).then(() => {
          console.log("Recursos Agregados");
        });
    });
  } else {
    console.error("El browser usado NO soporta caches");
  }
}

function start() {
  console.warn($("title").text());
  testCache();
  registrarServiceWorker();
  iniDialog();
  configurarListenersMenu();
  renderLista();
}

/* -------------------------------------- */
/*               EJECUCIÓN                */
/* -------------------------------------- */
$(document).ready(start); //ejecuta start cuando todo este cargado
