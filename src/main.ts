type TipoIva =
    | "general"
    | "reducido"
    | "superreducidoA"
    | "superreducidoB"
    | "superreducidoC"
    | "sinIva";

interface Producto {
    nombre: string;
    precio: number;
    tipoIva: TipoIva;
}

interface LineaTicket {
    producto: Producto;
    cantidad: number;
}

interface ResultadoLineaTicket {
    nombre: string;
    cantidad: number;
    precioSinIva: number;
    tipoIva: TipoIva;
    precioConIva: number;
}

interface ResultadoTotalTicket {
    totalSinIva: number;
    totalConIva: number;
    totalIva: number;
}

interface TotalPorTipoIva {
    tipoIva: TipoIva;
    cuantia: number;
}

interface TicketFinal {
    lineas: ResultadoLineaTicket[];
    total: ResultadoTotalTicket;
    desgloseIva: TotalPorTipoIva[];
}

const ivaPorTipo: Record<TipoIva, number> = {
    general: 21,
    reducido: 10,
    superreducidoA: 5,
    superreducidoB: 4,
    superreducidoC: 0,
    sinIva: 0,
};

const calculaTicket = (lineasTicket: LineaTicket[]): TicketFinal => {
    const lineas: ResultadoLineaTicket[] = lineasTicket.map(({ producto, cantidad }) => {
        const precioSinIva = producto.precio * cantidad;
        const iva = (precioSinIva * ivaPorTipo[producto.tipoIva]) / 100;
        const precioConIva = precioSinIva + iva;

        return {
            nombre: producto.nombre,
            cantidad,
            precioSinIva: parseFloat(precioSinIva.toFixed(2)),
            tipoIva: producto.tipoIva,
            precioConIva: parseFloat(precioConIva.toFixed(2)),
        };
    });

    const total = lineas.reduce(
        (acc, { precioSinIva, precioConIva }) => {
            acc.totalSinIva += precioSinIva;
            acc.totalConIva += precioConIva;
            acc.totalIva += precioConIva - precioSinIva;
            return acc;
        },
        { totalSinIva: 0, totalConIva: 0, totalIva: 0 }
    );

    total.totalSinIva = parseFloat(total.totalSinIva.toFixed(2));
    total.totalConIva = parseFloat(total.totalConIva.toFixed(2));
    total.totalIva = parseFloat(total.totalIva.toFixed(2));

    const desgloseIva: TotalPorTipoIva[] = Object.keys(ivaPorTipo).map(tipo => {
        const tipoIva = tipo as TipoIva;
        const cuantia = lineas
        .filter(linea => linea.tipoIva === tipoIva)
        .reduce((sum, linea) => sum + (linea.precioConIva - linea.precioSinIva), 0);
        return { tipoIva, cuantia: parseFloat(cuantia.toFixed(2)) };
    });

    return { lineas, total, desgloseIva };
};

const productos: LineaTicket[] = [
    {
        producto: { nombre: "Legumbres", precio: 2, tipoIva: "general" },
        cantidad: 2,
    },
    {
        producto: { nombre: "Perfume", precio: 20, tipoIva: "general" },
        cantidad: 3,
    },
    {
        producto: { nombre: "Leche", precio: 1, tipoIva: "superreducidoC" },
        cantidad: 6,
    },
    {
        producto: { nombre: "Lasaña", precio: 5, tipoIva: "superreducidoA" },
        cantidad: 1,
    },
];

function calcularTicket2() {
    const productoInput = document.getElementById('producto-input') as HTMLInputElement;
    const cantidadInput = document.getElementById('cantidad-input') as HTMLInputElement;
    const ticketBody = document.getElementById('ticket-body') as HTMLTableSectionElement;
  
    const nombreProducto = productoInput.value.trim();
    const cantidad = parseInt(cantidadInput.value.trim());
  
    if (!nombreProducto || isNaN(cantidad) || cantidad <= 0) {
      alert('Por favor ingresa un nombre de producto y una cantidad válida.');
      return;
    }
  
    // Aquí defines el precio del producto. (puedes hacer una búsqueda en una lista, por ahora fijo:)
    const precioUnitario = 100; // Puedes personalizarlo o hacer una búsqueda más avanzada.
  
    // Cálculos
    const precioSinIVA = precioUnitario * cantidad;
    const tipoIVA = 0.21; // IVA del 21%
    const precioConIVA = precioSinIVA * (1 + tipoIVA);
  
    // Agregar fila a la tabla
    const nuevaFila = document.createElement('tr');
    nuevaFila.innerHTML = `
      <td>${nombreProducto}</td>
      <td>${cantidad}</td>
      <td>${precioSinIVA.toFixed(2)} ?</td>
      <td>${(tipoIVA * 100).toFixed(0)}%</td>
      <td>${precioConIVA.toFixed(2)} ?</td>
    `;
    ticketBody.appendChild(nuevaFila);
  
    // Opcional: Actualizar totales
    actualizarTotales();
  }
  
  function actualizarTotales() {
    const filas = document.querySelectorAll('#ticket-body tr');
    let totalSinIVA = 0;
    let totalIVA = 0;
    let totalConIVA = 0;
  
    filas.forEach(fila => {
      const celdas = fila.querySelectorAll('td');
      const precioSinIVA = parseFloat(celdas[2].textContent!.replace(' ?', ''));
      const precioConIVA = parseFloat(celdas[4].textContent!.replace(' ?', ''));
  
      totalSinIVA += precioSinIVA;
      totalConIVA += precioConIVA;
    });
  
    totalIVA = totalConIVA - totalSinIVA;
  
    (document.getElementById('total-sin-iva') as HTMLParagraphElement).innerText = `Total sin IVA: ${totalSinIVA.toFixed(2)} ?`;
    (document.getElementById('total-iva') as HTMLParagraphElement).innerText = `IVA: ${totalIVA.toFixed(2)} ?`;
    (document.getElementById('total-con-iva') as HTMLParagraphElement).innerText = `Total con IVA: ${totalConIVA.toFixed(2)} ?`;
  }
  
  // Para que el botón funcione:
  (window as any).calcularTicket2 = calcularTicket2;
  

console.log(calculaTicket(productos));