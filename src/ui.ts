import { LineaTicket } from "./modelo";
import { obtenerPorcentajeIva, productos, calcularTotales} from "./motor";

let lineasTicket: LineaTicket[] = [];

export function inicializarSelectProductos() {
    const productoSelect = document.getElementById('producto-select');

    if (productoSelect instanceof HTMLSelectElement) {
        productoSelect.innerHTML = '<option value="">Selecciona un producto</option>';

        productos.forEach(producto => {
            const option = document.createElement('option');
            option.value = producto.nombre;
            option.textContent = producto.nombre[0].toUpperCase() + producto.nombre.slice(1);
            productoSelect.appendChild(option);
        });
    }
}

export function calcularTicket() {
    const productoSelect = document.getElementById('producto-select');
    const cantidadInput = document.getElementById('cantidad-input');
    const ticketBody = document.getElementById('ticket-body');

    // Validaciones de tipo en un solo bloque
    if (!(productoSelect instanceof HTMLSelectElement) ||
        !(cantidadInput instanceof HTMLInputElement) ||
        !(ticketBody instanceof HTMLTableSectionElement)) {
        console.error("Algún elemento del DOM no es del tipo esperado.");
        return;
    }

    const nombreProducto = productoSelect.value;
    const cantidad = parseInt(cantidadInput.value.trim());

    if (!nombreProducto || isNaN(cantidad) || cantidad <= 0) {
        alert('Por favor selecciona un producto y una cantidad válida.');
        return;
    }

    const productoEncontrado = productos.find(p => p.nombre === nombreProducto);

    if (!productoEncontrado) {
        alert('Producto no encontrado.');
        return;
    }

    lineasTicket.push({ producto: productoEncontrado, cantidad });

    const subtotal = productoEncontrado.precio * cantidad;
    const iva = obtenerPorcentajeIva(productoEncontrado.tipoIva) * subtotal;
    
    const nuevaFila = document.createElement('tr');
    nuevaFila.innerHTML = `
        <td>${productoEncontrado.nombre}</td>
        <td>${cantidad}</td>
        <td>${productoEncontrado.precio.toFixed(2)} €</td>
        <td>${(obtenerPorcentajeIva(productoEncontrado.tipoIva) * 100).toFixed(0)}%</td>
        <td>${(productoEncontrado.precio * obtenerPorcentajeIva(productoEncontrado.tipoIva)).toFixed(2)} €</td>
        <td>${iva.toFixed(2)} €</td>
        <td>${subtotal.toFixed(2)} €</td>
        <td><b>${(subtotal + iva).toFixed(2)} €</b></td>
    `;
    ticketBody.appendChild(nuevaFila);

    actualizarTotales();
}

export function actualizarTotales() {
    const { totalSinIva, totalIva, totalConIva } = calcularTotales(lineasTicket);

    const sinIvaEl   = document.getElementById('total-sin-iva');
    const ivaEl      = document.getElementById('total-iva');
    const conIvaEl   = document.getElementById('total-con-iva');

    if (
        !(sinIvaEl instanceof HTMLElement) ||
        !(ivaEl instanceof HTMLElement) ||
        !(conIvaEl instanceof HTMLElement)
    ) {
        console.error("Alguno de los elementos para mostrar totales no existe o no es un nodo HTML válido.");
        return;
    }

    sinIvaEl.textContent = `${totalSinIva.toFixed(2)} €`;
    ivaEl.textContent    = `${totalIva.toFixed(2)} €`;
    conIvaEl.textContent = `${totalConIva.toFixed(2)} €`;
}