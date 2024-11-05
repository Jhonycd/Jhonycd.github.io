//creamos una libreria, creamos funcion autoinvocada y protegida, esto se llama ifi(funcion autoinvocada), se la crea se invoca y se protegen los datos en el mismo lugar. El primer parentesis junto con el ultimo son los que protegen la funcion.

const apiProductos = (function () {
  function getUrl(id) {
    return (
      "https://6724fd3bc39fedae05b3849f.mockapi.io/api/productos/" + (id || "")
    );
  }

  async function get() {
    const prods = await $.ajax({ url: getUrl() });
    return prods;
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
   for (let i = 0; i < listaProductos.length; i++) {
     const id=listaProductos[i].id
     await del(id);
    
    
    
     //foreach(producto in listaProductos),
     //await del(listaProductos(id))
    }
  }

  return {
    get: () => get(),
    post: (producto) => post(producto),
    put: (id, producto) => put(id, producto),
    delete: (id) => del(id),
    deleteAll: () => deleteAll(),
  };
})(/*Aca se autoinvoca la funcion*/);
