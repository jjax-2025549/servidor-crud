export {};
// controllers/productosController.js
// Logica del CRUD de productos. Los datos se guardan en data/productos.json
// a manera de base de datos simulada.

type Request = import("http").IncomingMessage;
type Response = import("http").ServerResponse;

type Producto = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;
  estado: string;
};

const fs = require("fs");
const path = require("path");

const rutaArchivo = path.join(process.cwd(), "src", "data", "productos.json");

// Lee todos los productos del archivo JSON
function leerProductos() {
  const contenido = fs.readFileSync(rutaArchivo, "utf-8");
  return JSON.parse(contenido);
}

// Guarda el arreglo de productos en el archivo JSON
function guardarProductos(productos: Producto[]) {
  fs.writeFileSync(rutaArchivo, JSON.stringify(productos, null, 2));
}

// Funcion auxiliar para responder en formato JSON
function responderJSON(res: Response, statusCode: number, data: any) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

// GET /productos
function obtenerProductos(req: Request, res: Response) {
  const productos = leerProductos();
  responderJSON(res, 200, productos);
}

// GET /productos/:id
function obtenerProductoPorId(req: Request, res: Response, id: string) {
  const productos = leerProductos();
  const producto = productos.find((p: Producto) => p.id === Number(id));

  if (!producto) {
    responderJSON(res, 404, { error: "Producto no encontrado" });
    return;
  }

  responderJSON(res, 200, producto);
}

// POST /productos
function crearProducto(req: Request, res: Response, body: any) {
  const { nombre, descripcion, precio, stock, categoria, estado } = body;

  // Validaciones segun la hoja de trabajo
  if (!nombre || nombre.trim() === "") {
    responderJSON(res, 400, { error: "El nombre no puede estar vacio" });
    return;
  }

  if (!categoria || categoria.trim() === "") {
    responderJSON(res, 400, { error: "La categoria no puede estar vacia" });
    return;
  }

  if (precio === undefined || precio < 0) {
    responderJSON(res, 400, { error: "El precio no puede ser negativo" });
    return;
  }

  if (stock === undefined || stock < 0) {
    responderJSON(res, 400, { error: "El stock no puede ser negativo" });
    return;
  }

  const productos = leerProductos();

  const idRepetido = productos.some((p: Producto) => p.id === Number(body.id));
  if (body.id !== undefined && idRepetido) {
    responderJSON(res, 400, { error: "El id ya existe" });
    return;
  }

  // Si no mandan id, se genera uno automatico
  const nuevoId =
    body.id !== undefined
      ? Number(body.id)
      : productos.length > 0
      ? Math.max(...productos.map((p: Producto) => p.id)) + 1
      : 1;

  const nuevoProducto = {
    id: nuevoId,
    nombre,
    descripcion: descripcion || "",
    precio,
    stock,
    categoria,
    estado: estado || "activo",
  };

  productos.push(nuevoProducto);
  guardarProductos(productos);

  responderJSON(res, 201, nuevoProducto);
}

// PUT /productos/:id
function actualizarProducto(req: Request, res: Response, id: string, body: any) {
  const productos = leerProductos();
  const indice = productos.findIndex((p: Producto) => p.id === Number(id));

  if (indice === -1) {
    responderJSON(res, 404, { error: "Producto no encontrado" });
    return;
  }

  const { nombre, precio, stock, categoria } = body;

  if (nombre !== undefined && nombre.trim() === "") {
    responderJSON(res, 400, { error: "El nombre no puede estar vacio" });
    return;
  }

  if (categoria !== undefined && categoria.trim() === "") {
    responderJSON(res, 400, { error: "La categoria no puede estar vacia" });
    return;
  }

  if (precio !== undefined && precio < 0) {
    responderJSON(res, 400, { error: "El precio no puede ser negativo" });
    return;
  }

  if (stock !== undefined && stock < 0) {
    responderJSON(res, 400, { error: "El stock no puede ser negativo" });
    return;
  }

  productos[indice] = { ...productos[indice], ...body, id: productos[indice].id } as Producto;
  guardarProductos(productos);

  responderJSON(res, 200, productos[indice]);
}

// DELETE /productos/:id
function eliminarProducto(req: Request, res: Response, id: string) {
  const productos = leerProductos();
  const indice = productos.findIndex((p: Producto) => p.id === Number(id));

  if (indice === -1) {
    responderJSON(res, 404, { error: "Producto no encontrado" });
    return;
  }

  const eliminado = productos.splice(indice, 1);
  guardarProductos(productos);

  responderJSON(res, 200, { mensaje: "Producto eliminado", producto: eliminado[0] });
}

module.exports = {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
};
