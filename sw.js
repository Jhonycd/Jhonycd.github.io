const CACHE_STATIC = "static_v1.1";
const CACHE_INMUTABLE = "inmutabe_v1.1";
const CACHE_DYNAMIC = "dynamic_v1.1";
//las modificaciones que haga impactan cuando actualizo el cache, por eso hay que tener en cuenta si trabajo con cache o no, n la ultima clase de hoy lo usamos en false, luego lo pondremos en true
const CON_CACHE = false;

self.addEventListener("install", (e) => {
  console.log("installingiiaassa ");

  //skip waiting es la espera para poner el sw en accion automatico, es como marcar el update on reaload en la consola/aplicacion
  self.skipWaiting();

  //caches
  const cacheStatic = caches.open(CACHE_STATIC).then((cache) => {
    console.log(cache);
    //abrimos el cache
    //Guardo todos los recursos estaticos de la APP SHELL
    return cache.addAll([
      "/index.html",
      "/css/estilos.css",
      "/js/scripts.js",
      "/js/api.js",
      "/plantillas/productos.hbs",
      "/images/super.jpeg",
    ]);
  });

  const cacheInmutable = caches.open(CACHE_INMUTABLE).then((cache) => {
    //Guardo todos los recursos inmutabes de la APP SHELL, pueden ser locales o remotos
    return cache.addAll([
      "https://code.jquery.com/jquery-3.7.1.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.7.8/handlebars.min.js",
      "https://code.getmdl.io/1.3.0/material.min.js",
      "https://code.getmdl.io/1.3.0/material.teal-orange.min.css",
    ]);
  });
  //Con el metodo promise le paso un array y devuelve verdadero cuando los dos cache se cumplen
  e.waitUntil(Promise.all[(cacheStatic, cacheInmutable)]);
});

self.addEventListener("activate", (e) => {
  console.log("activate");
  //creamos una lista blanca de cache, es un array
  const cacheWhiteList = [CACHE_STATIC, CACHE_INMUTABLE, CACHE_DYNAMIC];

  //recorro dentro de caches, y los que NO estan en la lista blanca los borro (o sea que borro los caches viejos )
  const cachesBorrados = caches.keys().then((nombres) => {
    return Promise.all(
      nombres.map((nombre) => {
        //map es una funcion de js que permite recorrer un array, pasarle un callback y genera un array de salida, lo pruebo con sonsole.log
        if (!cacheWhiteList.includes(nombre)) {
          return caches.delete(nombre);
        }
      })
    );
  });
  e.waitUntil(cachesBorrados);
});

if (CON_CACHE) {
  self.addEventListener("fetch", (e) => {
    const { url, method } = e.request;
    if (
      method == "GET" &&
      !url.includes("mockapi.io") &&
      !url.includes("chrome-extension")
    ) {
      const respuesta = caches.match(e.request).then((res) => {
        if (res) {
          console.log("EXISTE el recurso en el cache", url);
          return res;
        }
        console.error("NO EXISTE el recurso en el cache", url);
        return fetch(e.request).then((nuevaRespuesta) => {
          caches.open(CACHE_DYNAMIC).then((cache) => {
            cache.put(e.request, nuevaRespuesta);
          });
          return nuevaRespuesta.clone();
        });
      });
      e.respondWith(respuesta);
    } else {
      console.warn("BYPASS", method, url);
    }
  });
}

//Ver la ultima clase y resolver porque no me funciono de aca en adelante

//Push que esta esperando que le ingresen los datos de notificacion, no es como modal ni alert, es una notificacion externa a la pagina
self.addEventListener("push", (e) => {
  const datos = e.data.text();
  //console.log("Datos recibidos", datos);

  //esta es la segunda parte del ejemplo de mozilla developer copiada para el push de notificacion
  const title = "Super Lista Emma";
  const options = {
    body: `${datos}`,
    icon: "images/icons/icon-72x72.png",
    badge: "https://images.app.goo.gl/ZGPoh4RPqqeGmmLRA",
  };
  e.waitUntil(self.registration.showNotification(title, options));
});
self.addEventListener("notificationclick", (e) => {
  //console.log("Click en ventana de notificacion", e);
  e.notification.close();
  e.waituntil(clients.openWindow("https://www.google.com/")); //La URL que yo quiera redirigir
});

//Webs para ver acerca de pwa
//https://web.dev/learn/pwa/
//https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification
//https://developer.mozilla.org/en-US/docs/Web/API/Clients

/* tag y vibrate no los usamos porque son para hacer vibrar el celular
   vibrate: [200, 100, 200, 100, 200, 100, 200],
   tag: "vibration-sample",*/
