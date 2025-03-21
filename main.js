let productos = [];
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const productosDiv = document.getElementById("productos");
const carritoDiv = document.getElementById("carrito");
const totalSpan = document.getElementById("total");

async function cargarProductos() {
    try {
        const respuesta = await fetch("productos.json");
        productos = await respuesta.json();
        mostrarProductos();
    } catch (error) {
        console.error("Error al cargar productos:", error);
    }
}

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
    const existe = carrito.find(p => p.id === id);

    if (existe) {
        existe.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    actualizarCarrito();

    Swal.fire({
        title: "Producto agregado",
        text: `${producto.nombre} se ha añadido al carrito`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        customClass: { popup: "mi-alerta" },
    });
}


function eliminarDelCarrito(id) {
    Swal.fire({
        title: "¿Eliminar producto?",
        text: "Este producto se eliminará del carrito",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        customClass: { popup: "mi-alerta" },
    }).then((result) => {
        if (result.isConfirmed) {
            const index = carrito.findIndex(p => p.id === id);
            if (index !== -1) {
                if (carrito[index].cantidad > 1) {
                    carrito[index].cantidad--;
                } else {
                    carrito.splice(index, 1);
                }
            }
            actualizarCarrito();

            Swal.fire({
                title: "Eliminado",
                text: "El producto ha sido eliminado del carrito",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
                customClass: { popup: "mi-alerta" },
            });
        }
    });
}


function actualizarCarrito() {
    carritoDiv.innerHTML = "";
    let total = 0;

    carrito.forEach(producto => {
        total += producto.precio * producto.cantidad;
        const div = document.createElement("div");
        div.classList.add("ItemCarrito");
        div.innerHTML = `
            <p>${producto.nombre} (x${producto.cantidad})</p>
            <p>${producto.precio * producto.cantidad} USD</p>
            <button class="borrar" onclick="eliminarDelCarrito(${producto.id})">-</button>
        `;
        carritoDiv.appendChild(div);
    });

    totalSpan.textContent = total;
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

document.getElementById("finalizarCompra").addEventListener("click", finalizarCompra);

function finalizarCompra() {
    if (carrito.length === 0) {
        Swal.fire({
            title: "Carrito vacío",
            text: "Agrega productos antes de finalizar la compra",
            icon: "error",
            timer: 2000,
            showConfirmButton: false,
            customClass: { popup: "mi-alerta" },
        });
        return;
    }

    Swal.fire({
        title: "Datos de pago",
        customClass: { popup: "mi-alerta" },
        html: `
            <input id="nombre" class="swal2-input" placeholder="Nombre completo">
            <input id="email" class="swal2-input" placeholder="Correo electrónico">
            <input id="tarjeta" class="swal2-input" placeholder="Número de tarjeta" maxlength="16">
            <input id="cvv" class="swal2-input" placeholder="CVV" maxlength="3">
            <input id="exp" class="swal2-input" placeholder="Fecha de expiración (MM/YY)">
        `,
        confirmButtonText: "Pagar",
        showCancelButton: true,
        preConfirm: () => {
            const nombre = document.getElementById("nombre").value.trim();
            const email = document.getElementById("email").value.trim();
            const tarjeta = document.getElementById("tarjeta").value.trim();
            const cvv = document.getElementById("cvv").value.trim();
            const exp = document.getElementById("exp").value.trim();

            // Validaciones básicas
            if (!nombre || !email || !tarjeta || !cvv || !exp) {
                Swal.showValidationMessage("Todos los campos son obligatorios");
                return false;
            }

            if (!/^\d{16}$/.test(tarjeta)) {
                Swal.showValidationMessage("Número de tarjeta inválido (debe tener 16 dígitos)");
                return false;
            }

            if (!/^\d{3}$/.test(cvv)) {
                Swal.showValidationMessage("CVV inválido (debe tener 3 dígitos)");
                return false;
            }

            if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(exp)) {
                Swal.showValidationMessage("Fecha de expiración inválida (usa formato MM/YY)");
                return false;
            }

            return { nombre, email, tarjeta, cvv, exp };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            // Simular proceso de pago
            Swal.fire({
                title: "Procesando pago...",
                text: "Por favor, espera unos segundos.",
                icon: "info",
                timer: 2000,
                showConfirmButton: false,
                customClass: { popup: "mi-alerta" },
            });

            setTimeout(() => {
                Swal.fire({
                    title: "Compra exitosa 🎉",
                    text: `Gracias por tu compra, ${result.value.nombre}! Recibirás un correo de confirmación en ${result.value.email}.`,
                    icon: "success",
                    timer: 3000,
                    showConfirmButton: false,
                    customClass: { popup: "mi-alerta" },
                });

                // Vaciar el carrito
                carrito = [];
                actualizarCarrito();
                localStorage.removeItem("carrito");
            }, 2000);
        }
    });
}
cargarProductos();
actualizarCarrito();