import { DetalleVenta } from "./detalleVenta.interface";

export interface Venta {
    idVenta?:number,
    numDocumento?:string,
    tipoPago:string,
    fechaRegistro?:string,
    totalTexto:string,
    IdUsuario:string | number
    usuarioDescripcion:string
    detalleventa: DetalleVenta[]
}

//el simbolo ? quiere decir que pueden entrar nulos
