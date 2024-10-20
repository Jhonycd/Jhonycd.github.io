self.addEventListener('install', e => {
 console.log('install')
})

self.addEventListener("activate", (e) => {
  console.log("activate");
});

self.addEventListener("fetch", (e) => {
  console.log("fetch");
});