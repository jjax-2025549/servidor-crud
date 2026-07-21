# ServidorCRUD

## Nombre del proyecto
Servidor HTTP Nativo con Node.js - CRUD de Productos y Clientes

## Objetivo
Construir un servidor HTTP utilizando unicamente el modulo `http` de Node.js
(sin frameworks como Express), capaz de manejar operaciones CRUD (crear,
leer, actualizar y eliminar) sobre dos recursos: productos y clientes,
respondiendo siempre en formato JSON.

## Tecnologias utilizadas
- Node.js (modulo nativo `http`)
- JavaScript
- JSON como formato de almacenamiento de datos (data/productos.json y data/clientes.json)
- Postman para pruebas de las rutas

## Instalacion
1. Clonar el repositorio
   ```
   git clone <url-del-repo>
   ```
2. Entrar a la carpeta del proyecto
   ```
   cd ServidorCRUD
   ```
3. No se necesitan dependencias externas, pero se puede inicializar npm si hace falta
   ```
   npm install
   ```

## Ejecucion
```
npm start
```
o directamente:
```
node server.js
```

El servidor queda escuchando en:
```
http://localhost:3000
```

## Rutas disponibles

### Productos
| Metodo | Ruta              | Descripcion       |
|--------|-------------------|--------------------|
| GET    | /productos        | Muestra todos      |
| GET    | /productos/:id    | Busca uno por id   |
| POST   | /productos        | Agrega uno nuevo   |
| PUT    | /productos/:id    | Actualiza uno      |
| DELETE | /productos/:id    | Elimina uno        |

Cada producto contiene: `id`, `nombre`, `descripcion`, `precio`, `stock`, `categoria`, `estado`.

Validaciones: no se permite precio negativo, stock negativo, nombre vacio,
categoria vacia ni id repetido.

### Clientes
| Metodo | Ruta            | Descripcion       |
|--------|-----------------|--------------------|
| GET    | /clientes       | Muestra todos      |
| GET    | /clientes/:id   | Busca uno por id   |
| POST   | /clientes       | Agrega uno nuevo   |
| PUT    | /clientes/:id   | Actualiza uno      |
| DELETE | /clientes/:id   | Elimina uno        |

Cada cliente contiene: `id`, `nombre`, `apellido`, `correo`, `telefono`, `direccion`, `estado`.

Validaciones: no se permite correo vacio, telefono vacio, correo repetido,
nombre vacio ni apellido vacio.

## Manejo de errores
El servidor responde en JSON ante:
- Ruta inexistente (404)
- Metodo incorrecto para una ruta existente (405)
- Producto o cliente inexistente (404)
- JSON invalido en el body de la peticion (400)
- Id inexistente (404)

## Autor
Julian Jax - 2025549- IN5CM 
