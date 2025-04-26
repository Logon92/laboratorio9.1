    interface LineaTicket {
        nombre: string;
        precio: number;
        tipoIVA: number;
    }

    interface descripcionIva {
        tipo: string;
        porcentaje: number;
    }

    const tipoIva: descripcionIva[] = [
        {tipo: 'general', porcentaje: 0.21},
        {tipo: 'reducido', porcentaje: 0.10},
        {tipo: 'superreducidoA', porcentaje: 0.05},
        {tipo: 'superreducidoB', porcentaje: 0.04},
        {tipo: 'superreducidoC', porcentaje: 0.00},
        {tipo: 'sinIva', porcentaje: 0.00},
    ];
    
    const productos: LineaTicket[] = [
        { nombre: 'legumbres', precio: 2.00, tipoIVA: 0.21 },
        { nombre: 'perfume', precio: 20.00, tipoIVA: 0.21 },
        { nombre: 'lasaña', precio: 5.00, tipoIVA: 0.05 },
        { nombre: 'pan', precio: 1.00, tipoIVA: 0.04 },
        { nombre: 'leche', precio: 0.80, tipoIVA: 0.00 },
        { nombre: 'queso', precio: 2.50, tipoIVA: 0.04 },
        { nombre: 'huevos', precio: 1.20, tipoIVA: 0.10 },
        { nombre: 'aceite', precio: 3.00, tipoIVA: 0.21 }
    ]; 

    function inicializarSelectProductos() {
        const productoSelect = document.getElementById('producto-select') as HTMLSelectElement;
    
        productos.forEach(producto => {
        const option = document.createElement('option');
        option.value = producto.nombre;
        option.textContent = producto.nombre.charAt(0).toUpperCase() + producto.nombre.slice(1); // Capitaliza
        productoSelect.appendChild(option);
        });
    }
    
    function calcularTicket() {
        const productoSelect = document.getElementById('producto-select') as HTMLSelectElement;
        const cantidadInput = document.getElementById('cantidad-input') as HTMLInputElement;
        const ticketBody = document.getElementById('ticket-body') as HTMLTableSectionElement;
    
        const nombreProducto = productoSelect.value;
        const cantidad = parseInt(cantidadInput.value.trim());
    
        if (!nombreProducto || isNaN(cantidad) || cantidad <= 0) {
        alert('Por favor selecciona un producto y una cantidad válida.');
        return;
        }
    
        // Buscar el producto en la lista
        const productoEncontrado = productos.find(p => p.nombre === nombreProducto);
    
        if (!productoEncontrado) {
        alert('Producto no encontrado.');
        return;
        }
    
        // Cálculos
        const precioSinIVA = productoEncontrado.precio * cantidad;
        const precioConIVA = precioSinIVA * (1 + productoEncontrado.tipoIVA);
        const precioUnidad = productoEncontrado.precio;
        const totalIva = precioConIVA - precioSinIVA;
        const ivaUnidad = productoEncontrado.tipoIVA * productoEncontrado.precio;
    
        // Agregar fila a la tabla
        const nuevaFila = document.createElement('tr');
        nuevaFila.innerHTML = `
        <td>${productoEncontrado.nombre}</td>
        <td>${cantidad}</td>
        <td>${precioUnidad.toFixed(2)} €</td>
        <td>${(productoEncontrado.tipoIVA * 100).toFixed(0)}%</td>
        <td>${ivaUnidad.toFixed(2)} €</td>
        <td>${totalIva.toFixed(2)} €</td>
        <td>${precioSinIVA.toFixed(2)} €</td>
        <td><b>${precioConIVA.toFixed(2)} €</b></td>
        `;
        ticketBody.appendChild(nuevaFila);
        actualizarTotales();
    }

    function actualizarTotales() {
        const filas = document.querySelectorAll('#ticket-body tr');
    
        let totalSinIVA = 0;
        let totalIVA = 0;
        let totalConIVA = 0;
    
        filas.forEach(fila => {
            const celdas = fila.querySelectorAll('td');
            const precioSinIVA = parseFloat(celdas[6].textContent!.replace(' €', ''));
            const precioConIVA = parseFloat(celdas[7].textContent!.replace(' €', ''));
    
            totalSinIVA += precioSinIVA;
            totalConIVA += precioConIVA;
        });
    
        totalIVA = totalConIVA - totalSinIVA;
    
        (document.getElementById('total-sin-iva') as HTMLParagraphElement).innerText = `${totalSinIVA.toFixed(2)} €`;
        (document.getElementById('total-iva') as HTMLParagraphElement).innerText = `${totalIVA.toFixed(2)} €`;
        (document.getElementById('total-con-iva') as HTMLParagraphElement).innerText = `${totalConIVA.toFixed(2)} €`;
    }

    function allowNumbersOnly(e: KeyboardEvent): boolean {
        if (!/^\d$/.test(e.key)) {
            e.preventDefault();
            return false;
        }
        return true;
    }
    
    document.addEventListener('DOMContentLoaded', () => {
        inicializarSelectProductos();
        (window as any).calcularTicket = calcularTicket;
        (window as any).AllowNumbersOnly = allowNumbersOnly;
    });