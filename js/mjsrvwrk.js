console.log("Hey dude!");

self.addEventListener("install", function(event) {
    console.log("SW Installing");
    event.waitUntil(
        caches.open("v1").then(function(cache)
    { 
        return cache.addAll([
            "../index.html",
            "../views/home.html",
            "../data/home.txt"
        ]);
    })
    );
});


self.addEventListener("activate", function(event){
    console.log("SW activate");
});

self.addEventListener("fetch", function(event){
    console.log("SW fetch");
    console.log(event.request.url);
});

self.addEventListener("message", function(event){
    console.log("SW message");
});

self.addEventListener("messageerror", function(event){
    console.log("SW messageerror");
});