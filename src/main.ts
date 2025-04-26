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

console.log(calculaTicket(productos));