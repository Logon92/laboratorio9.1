type TipoIva =
    | "general"
    | "reducido"
    | "superreducidoA"
    | "superreducidoB"
    | "superreducidoC"
    | "sinIva";

export interface Producto {
    nombre: string;
    precio: number;
    tipoIva: TipoIva;
}

export interface LineaTicket {
    producto: Producto;
    cantidad: number;
}

export const obtenerPorcentajeIva = (tipoIva: TipoIva): number => {
    switch (tipoIva) {
        case 'general':
            return 0.21;
        case 'reducido':
            return 0.10;
        case 'superreducidoA':
            return 0.05;
        case 'superreducidoB':
            return 0.04;
        case 'superreducidoC':
            return 0.00;
        case 'sinIva':
            return 0.00;
    }
};

export const productos: Producto[] = [
    { nombre: 'legumbres', precio: 2.00, tipoIva: 'general' },
    { nombre: 'perfume', precio: 20.00, tipoIva: 'general' },
    { nombre: 'lasaña', precio: 5.00, tipoIva: 'superreducidoA' },
    { nombre: 'pan', precio: 1.00, tipoIva: 'superreducidoB' },
    { nombre: 'leche', precio: 0.80, tipoIva: 'superreducidoC' },
    { nombre: 'queso', precio: 2.50, tipoIva: 'superreducidoB' },
    { nombre: 'huevos', precio: 1.20, tipoIva: 'reducido' },
    { nombre: 'aceite', precio: 3.00, tipoIva: 'general' }
];

// Cálculo de IVA total
export const obtenerTotalIva = (lineasTicket: LineaTicket[]): number => {
    return lineasTicket.reduce((acc, linea) => {
        const subtotal = linea.cantidad * linea.producto.precio;
        const iva = subtotal * obtenerPorcentajeIva(linea.producto.tipoIva);
        return acc + iva;
    }, 0);
};

// Cálculo de totales
export const calcularTotales = (lineasTicket: LineaTicket[]) => {
    const totalSinIva = lineasTicket.reduce((acc, linea) => acc + linea.cantidad * linea.producto.precio, 0);
    const totalIva = obtenerTotalIva(lineasTicket);
    const totalConIva = totalSinIva + totalIva;

    return { totalSinIva, totalIva, totalConIva };
};