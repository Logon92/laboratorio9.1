export type TipoIva =
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