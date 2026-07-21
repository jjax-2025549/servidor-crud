export {};

type Request = import("http").IncomingMessage;
type Response = import("http").ServerResponse;

const productosController = require("../../client/producto");

function enrutarProductos(req: Request, res: Response, partesRuta: string[], body: any) {
  const id = partesRuta[1];
  const metodo = req.method;

  if (!id) {
    if (metodo === "GET") {
      productosController.obtenerProductos(req, res);
      return;
    }

    if (metodo === "POST") {
      productosController.crearProducto(req, res, body);
      return;
    }
  } else {
    if (metodo === "GET") {
      productosController.obtenerProductoPorId(req, res, id);
      return;
    }

    if (metodo === "PUT") {
      productosController.actualizarProducto(req, res, id, body);
      return;
    }

    if (metodo === "DELETE") {
      productosController.eliminarProducto(req, res, id);
      return;
    }
  }

  res.writeHead(405, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Metodo no permitido para esta ruta" }));
}

module.exports = enrutarProductos;
