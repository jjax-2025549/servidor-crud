export {};

type Request = import("http").IncomingMessage;
type Response = import("http").ServerResponse;

const clientesController = require("../../client/cliente");

function enrutarClientes(req: Request, res: Response, partesRuta: string[], body: any) {
  const id = partesRuta[1];
  const metodo = req.method;

  if (!id) {
    if (metodo === "GET") {
      clientesController.obtenerClientes(req, res);
      return;
    }

    if (metodo === "POST") {
      clientesController.crearCliente(req, res, body);
      return;
    }
  } else {
    if (metodo === "GET") {
      clientesController.obtenerClientePorId(req, res, id);
      return;
    }

    if (metodo === "PUT") {
      clientesController.actualizarCliente(req, res, id, body);
      return;
    }

    if (metodo === "DELETE") {
      clientesController.eliminarCliente(req, res, id);
      return;
    }
  }

  res.writeHead(405, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Metodo no permitido para esta ruta" }));
}

module.exports = enrutarClientes;
