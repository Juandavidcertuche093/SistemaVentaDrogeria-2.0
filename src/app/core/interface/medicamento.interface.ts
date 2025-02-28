export interface Medicamento {
  idMedicamento:number,
  nombre:string,
  idCategoria:number,
  descripcionCategoria:string,
  stock:number,
  precio:string,
  esActivo:number,
  fechaVencimiento?: string,
  especificaciones: string
}
