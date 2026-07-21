// server.js
// Servidor HTTP nativo (sin Express) para el CRUD de productos y clientes.
// Escucha en el puerto 3000 y responde siempre en formato JSON.

const http = require("http");
const url = require("url");

const enrutarProductos = require("./routes/productos");
const enrutarClientes = require("./routes/clientes");

const PUERTO = 3000;

const servidor = http.createServer((req, res) => {
  const partesUrl = url.parse(req.url, true);
  // Quitamos el "/" inicial y separamos por "/" -> ["productos", "1"]
  const partesRuta = partesUrl.pathname.split("/").filter((parte) => parte !== "");

  const recurso = partesRuta[0];

  // Recolectamos el body de la peticion (para POST y PUT)
  let cuerpoCrudo = "";

  req.on("data", (chunk) => {
    cuerpoCrudo += chunk;
  });

  req.on("end", () => {
    let body = {};

    if (cuerpoCrudo) {
      try {
        body = JSON.parse(cuerpoCrudo);
      } catch (error) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "JSON invalido en el cuerpo de la peticion" }));
        return;
      }
    }

    // Enrutamos segun el recurso solicitado
    if (recurso === "productos") {
      enrutarProductos(req, res, partesRuta, body);
      return;
    }

    if (recurso === "clientes") {
      enrutarClientes(req, res, partesRuta, body);
      return;
    }

    // Ruta no encontrada
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Ruta no encontrada" }));
  });
});

servidor.listen(PUERTO, () => {
  console.log("Servidor corriendo en http://localhost:" + PUERTO);
});
