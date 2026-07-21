export {};
// controllers/clientesController.js
// Logica del CRUD de clientes. Los datos se guardan en data/clientes.json
// a manera de base de datos simulada.

type Request = import("http").IncomingMessage;
type Response = import("http").ServerResponse;

type Cliente = {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  direccion: string;
  estado: string;
};

const fs = require("fs");
const path = require("path");

const rutaArchivo = path.join(process.cwd(), "src", "data", "clientes.json");

// Lee todos los clientes del archivo JSON
function leerClientes() {
  const contenido = fs.readFileSync(rutaArchivo, "utf-8");
  return JSON.parse(contenido);
}

// Guarda el arreglo de clientes en el archivo JSON
function guardarClientes(clientes: Cliente[]) {
  fs.writeFileSync(rutaArchivo, JSON.stringify(clientes, null, 2));
}

// Funcion auxiliar para responder en formato JSON
function responderJSON(res: Response, statusCode: number, data: any) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

// GET /clientes
function obtenerClientes(req: Request, res: Response) {
  const clientes = leerClientes();
  responderJSON(res, 200, clientes);
}

// GET /clientes/:id
function obtenerClientePorId(req: Request, res: Response, id: string) {
  const clientes = leerClientes();
  const cliente = clientes.find((c: Cliente) => c.id === Number(id));

  if (!cliente) {
    responderJSON(res, 404, { error: "Cliente no encontrado" });
    return;
  }

  responderJSON(res, 200, cliente);
}

// POST /clientes
function crearCliente(req: Request, res: Response, body: any) {
  const { nombre, apellido, correo, telefono, direccion, estado } = body;

  // Validaciones segun la hoja de trabajo
  if (!nombre || nombre.trim() === "") {
    responderJSON(res, 400, { error: "El nombre no puede estar vacio" });
    return;
  }

  if (!apellido || apellido.trim() === "") {
    responderJSON(res, 400, { error: "El apellido no puede estar vacio" });
    return;
  }

  if (!correo || correo.trim() === "") {
    responderJSON(res, 400, { error: "El correo no puede estar vacio" });
    return;
  }

  if (!telefono || telefono.trim() === "") {
    responderJSON(res, 400, { error: "El telefono no puede estar vacio" });
    return;
  }

  const clientes = leerClientes();

  const correoRepetido = clientes.some((c: Cliente) => c.correo === correo);
  if (correoRepetido) {
    responderJSON(res, 400, { error: "El correo ya esta registrado" });
    return;
  }

  const nuevoId =
    body.id !== undefined
      ? Number(body.id)
      : clientes.length > 0
      ? Math.max(...clientes.map((c: Cliente) => c.id)) + 1
      : 1;

  const nuevoCliente = {
    id: nuevoId,
    nombre,
    apellido,
    correo,
    telefono,
    direccion: direccion || "",
    estado: estado || "activo",
  };

  clientes.push(nuevoCliente);
  guardarClientes(clientes);

  responderJSON(res, 201, nuevoCliente);
}

// PUT /clientes/:id
function actualizarCliente(req: Request, res: Response, id: string, body: any) {
  const clientes = leerClientes();
  const indice = clientes.findIndex((c: Cliente) => c.id === Number(id));

  if (indice === -1) {
    responderJSON(res, 404, { error: "Cliente no encontrado" });
    return;
  }

  const { nombre, apellido, correo, telefono } = body;

  if (nombre !== undefined && nombre.trim() === "") {
    responderJSON(res, 400, { error: "El nombre no puede estar vacio" });
    return;
  }

  if (apellido !== undefined && apellido.trim() === "") {
    responderJSON(res, 400, { error: "El apellido no puede estar vacio" });
    return;
  }

  if (correo !== undefined) {
    if (correo.trim() === "") {
      responderJSON(res, 400, { error: "El correo no puede estar vacio" });
      return;
    }

    const correoRepetido = clientes.some(
      (c: Cliente) => c.correo === correo && c.id !== Number(id)
    );
    if (correoRepetido) {
      responderJSON(res, 400, { error: "El correo ya esta registrado" });
      return;
    }
  }

  if (telefono !== undefined && telefono.trim() === "") {
    responderJSON(res, 400, { error: "El telefono no puede estar vacio" });
    return;
  }

  clientes[indice] = { ...clientes[indice], ...body, id: clientes[indice].id } as Cliente;
  guardarClientes(clientes);

  responderJSON(res, 200, clientes[indice]);
}

// DELETE /clientes/:id
function eliminarCliente(req: Request, res: Response, id: string) {
  const clientes = leerClientes();
  const indice = clientes.findIndex((c: Cliente) => c.id === Number(id));

  if (indice === -1) {
    responderJSON(res, 404, { error: "Cliente no encontrado" });
    return;
  }

  const eliminado = clientes.splice(indice, 1);
  guardarClientes(clientes);

  responderJSON(res, 200, { mensaje: "Cliente eliminado", cliente: eliminado[0] });
}

module.exports = {
  obtenerClientes,
  obtenerClientePorId,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
};
