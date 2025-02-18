const productos = [
    { id: 1, nombre: "RTX 4090", precio: 1600, imagen: "img/RTX4090.webp" },
    { id: 2, nombre: "RTX 4080", precio: 1200, imagen: "img/rtx4080.jpeg" },
    { id: 3, nombre: "RX 7900 XTX", precio: 1000, imagen: "img/RTX7900XTX.jpeg" }
];

const carrito = [];

const productosDiv = document.getElementById("productos");
const carritoDiv = document.getElementById("carrito");
const totalSpan = document.getElementById("total");

function mostrarProductos() {
    productosDiv.innerHTML = "";
    productos.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-img">
            <p>${producto.nombre}</p>
            <p>${producto.precio} USD</p>
            <button onclick="agregarAlCarrito(${producto.id})">Agregar</button>
        `;
        productosDiv.appendChild(div);
    });
}

function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    carrito.push(producto);
    actualizarCarrito();
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    actualizarCarrito();
}

function actualizarCarrito() {
    carritoDiv.innerHTML = "";
    let total = 0;
    carrito.forEach((producto, index) => {
        total += producto.precio;
        const div = document.createElement("div");
        div.classList.add("ItemCarrito");
        div.innerHTML = `
            <p>${producto.nombre}</p>
            <p>${producto.precio} USD</p>
            <button onclick="eliminarDelCarrito(${index})">Eliminar</button>
        `;
        carritoDiv.appendChild(div);
    });
    totalSpan.textContent = total;
}

mostrarProductos();
