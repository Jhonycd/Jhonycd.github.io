//creamos una libreria, creamos funcion autoinvocada y protegida, esto se llama ifi(funcion autoinvocada), se la crea se invoca y se protegen los datos en el mismo lugar. El primer parentesis junto con el ultimo son los que protegen la funcion.

const apiProductos = (function () {
  function getUrl(id) {
    return (
      "https://6724fd3bc39fedae05b3849f.mockapi.io/api/productos/" + (id || "")
    );
  }

 async function get() {
  try {
   const prods = await $.ajax({ url: getUrl() });
   return prods;
  }
  catch (error) {
   console.error('ERROR DE GET', error)
   const prods = leerListaProductos()
   console.log(prods)
   return prods
  }
 }


 
  async function post(producto) {
    const productoAgregado = await $.ajax({
      url: getUrl(),
      method: "post",
      data: producto,
    });
    return productoAgregado;
  }

  async function put(id, producto) {
    const productoActualizado = await $.ajax({
      url: getUrl(id),
      method: "put",
      data: producto,
    });
    return productoActualizado;
  }

  async function del(id) {
    const productoEliminado = await $.ajax({
      url: getUrl(id),
      method: "delete",
    });
    return productoEliminado;
  }

  async function deleteAll() {
    const progress = $("progress");
    progress.css("display", "block");
    let porcentaje = 0;
    for (let i = 0; i < listaProductos.length; i++) {
      porcentaje = parseInt(i * 100) / listaProductos.length;
      console.log(porcentaje + "%");
      progress.val(porcentaje);
      const id = listaProductos[i].id;
      await del(id);
    }

    porcentaje = 100;
    console.log(porcentaje + "%");
    progress.val(porcentaje);
    setTimeout(() => {
      progress.css("display", "none");
    }, 2000);
  }

  return {
    get: () => get(),
    post: (producto) => post(producto),
    put: (id, producto) => put(id, producto),
    delete: (id) => del(id),
    deleteAll: () => deleteAll(),
  };
})(/*Aca se autoinvoca la funcion*/);
