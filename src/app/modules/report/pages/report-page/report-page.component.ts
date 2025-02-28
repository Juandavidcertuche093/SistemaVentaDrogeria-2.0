import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

//angular/material
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import {MatDialogModule} from '@angular/material/dialog';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import { CdkTableModule } from '@angular/cdk/table';
import { MatTableModule } from '@angular/material/table';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';

import moment from 'moment';
import * as XLSX from 'xlsx';

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

//interface
import { Reporte } from '../../../../core/interface/reporte.interface';

//servicio
import {VentaReporteService} from '../../services/venta-reporte.service';
import {UtilidadService} from '../../../../services/utilidad.service';



export const MY_DATA_FORMATS={
  parse:{
    dateInput: 'DD/MM/YYYY'
  },
  display:{
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY'
  }
}

@Component({
  selector: 'app-report-page',
  imports: [
    CommonModule,
    MatDialogModule,
    MatGridListModule,
    MatFormFieldModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatDividerModule,
    CdkTableModule,
    MatTableModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule
  ],
  templateUrl: './report-page.component.html',
  styleUrl: './report-page.component.scss'
})
export class ReportPageComponent {

  formularioFiltro:FormGroup
  listaVentasReporte:Reporte[]=[];
  columnasTabla: string[] = ['fechaRegistro','numeroVenta','tipoPago','total','producto','cantidad','precio','totalProducto', 'usuario'];
  dataVentaReporte= new MatTableDataSource(this.listaVentasReporte);
  @ViewChild(MatPaginator)paginacionTabla!:MatPaginator

  constructor(
    private fb: FormBuilder,
    private ventaServicio: VentaReporteService,
    private utilidadService: UtilidadService
  ){
    this.formularioFiltro = this.fb.group({
      fechaInicio:['',[Validators.required]],
      fechaFin:['',[Validators.required]]
    })
  }

  //en esta parte crearemos la paginacion con este evento (AfterViewInit)
  ngAfterViewInit(): void {
    this.dataVentaReporte.paginator = this.paginacionTabla
  }

  //metodo para buscar por rango de fecha
  buscarVentas(){
    const _fechaInicio = moment(this.formularioFiltro.value.fechaInicio).format('DD/MM/YYYY');
    const _fechaFin = moment(this.formularioFiltro.value.fechaFin).format('DD/MM/YYYY');

    if(_fechaInicio === 'Invalid date' || _fechaFin === 'Invalid date'){
      this.utilidadService.mostrarAlerta('Debe de ingresar ambas fechas','Oops!')
      return;
    }

    this.ventaServicio.reporte(
      _fechaInicio,
      _fechaFin
    )
    .subscribe({
      next:(data) => {
        if (data.status) {
          this.listaVentasReporte = data.value;
          this.dataVentaReporte.data = data.value;
        } else {
          this.listaVentasReporte = [];
          this.dataVentaReporte.data = []
          this.utilidadService.mostrarAlerta('No se encontraron datos','Oops!')
        }
      },
      error:(e)=>{}
    })
  }

  //metodo para exportar al excel
  exportarExcel(){
    const wb = XLSX.utils.book_new(); //nuevo libro
    const ws = XLSX.utils.json_to_sheet(this.listaVentasReporte);

    XLSX.utils.book_append_sheet(wb,ws,"Reporte");
    XLSX.writeFile(wb,"Reporte Ventas.xlsx")
  }

 //metodo para exportar a pdf
  exportarPDF() {
    const doc = new jsPDF();

    //calcular el total de ventas
    const total = this.listaVentasReporte.reduce((acc, venta) => acc + parseFloat(venta.total || '0'), 0);

    // Título de la droguería
    doc.setFontSize(24);  // Tamaño de letra más grande para el nombre
    doc.setFont("helvetica", "bold");  // Tipo de letra en negrita
    doc.setTextColor(30);
    doc.text('EBEN-EZER', doc.internal.pageSize.width / 2, 15, { align: 'center' }); // Posición Y en 15

    //Configuración del encabezado
    doc.setFontSize(20);  // Tamaño más grande
    doc.setTextColor(25);
    doc.text('Reporte de Ventas', doc.internal.pageSize.width / 2, 25, { align: 'center' });

    // Detalle de la empresa y fecha
    doc.setFontSize(16);
    doc.setFont("times", "normal");  // Cambiar el tipo de letra si se desea
    doc.setTextColor(50);
    doc.text(`Total Ingresos: ${total.toLocaleString('es-CO')}`, 14, 40); // Ajusta la posición Y a 30 para mayor espacio
    doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 14, 50); // Añade espacio entre las líneas

    // Línea divisoria antes de la tabla
    doc.setDrawColor(0);  // Color de la línea
    doc.setLineWidth(0.5); // Grosor de la línea
    doc.line(14, 55, doc.internal.pageSize.width - 14, 55); // Coordenadas de la línea horizontal

    // Tabla de ventas con estilos
    (doc as any).autoTable({
      head: [[ 'No. Venta', 'Tipo Pago',  'Producto', 'Cantidad', 'Precio', 'Total Producto', 'Usuario']],//'Fecha',  'Total',
      body: this.listaVentasReporte.map(venta => [
        // venta.fechaRegistro,
        venta.numeroDocumento,
        venta.tipoPago,
        // venta.totalVenta,
        venta.medicamento,
        venta.cantidad,
        venta.precio,
        venta.total,
        venta.usuario
      ]),
      startY: 60,
      theme: 'striped',  // Opción de tema para mejorar la apariencia
      headStyles: { fillColor: [135, 206, 235] }, // Encabezado azul claro
      bodyStyles: { textColor: 50 }, // Color del texto del cuerpo
      footStyles: { fillColor: [200, 200, 200] }, // Pie de página en gris
      styles: { fontSize: 10, cellPadding: 4 },  // Tamaño de fuente y padding en celdas
      didDrawPage: function (data: any) {
        // Añadir el número de página en la parte inferior
        const pageCount = doc.getNumberOfPages();
        doc.setFontSize(10);
        doc.text(`Página ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
      },
      margin: { top: 35 }  // Ajuste de margen superior para el encabezado
    });

    // Guardar el PDF
    doc.save("Reporte_Ventas.pdf");
  }

}
