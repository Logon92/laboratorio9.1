import { inicializarSelectProductos, calcularTicket } from "./ui";

function allowNumbersOnly(e: KeyboardEvent): boolean {
	if (!/^\d$/.test(e.key)) {
		e.preventDefault();
		return false;
	}
	return true;
}

document.addEventListener("DOMContentLoaded", () => {
	inicializarSelectProductos();
	calcularTicket();
	(window as any).calcularTicket = calcularTicket;
	(window as any).AllowNumbersOnly = allowNumbersOnly;
});
