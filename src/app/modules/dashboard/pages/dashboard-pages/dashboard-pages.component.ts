import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';

//Angular Material
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';


//Mostrar gráficos.
import { Chart, registerables } from 'chart.js';
import { DashboardService } from '../../services/dashboard.service';
import { BaseChartDirective } from 'ng2-charts'; // ✅ Importación correcta
import { CommonModule } from '@angular/common';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-pages',
  imports: [
    BaseChartDirective,
    MatCardModule,
    MatIconModule,
    CommonModule
  ],
  templateUrl: './dashboard-pages.component.html',
  styleUrl: './dashboard-pages.component.scss'
})
export class DashboardPagesComponent {

  //variables
  totalIngresos:string='0';
  totalVentas:string='0';
  totalProductos:string='0';
  totalUsuarios:string='0'

  medicamentosMasVendidos: { nombre: string, cantidadVendida: number }[] = [];


  constructor(
    private dashboardServicio: DashboardService
  ){}


   // Datos dinámicos para el gráfico de barras
   barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        label: 'Ingresos',
        data: [],
        backgroundColor: '#6366F1'
      },
      {
        label: 'Ganancias',
        data: [],
        backgroundColor: '#A5B4FC'
      }
    ]
  };

  barChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };


  ngOnInit(): void {
    this.dashboardServicio.resumen().subscribe({
      next: (data) => {
        if (data.status) {
          this.totalIngresos = data.value.totalIngresos.replace(',', '').slice(0, -2);
          this.totalVentas = data.value.totalVentas;
          this.totalProductos = data.value.totalProductos;
          this.totalUsuarios = data.value.totalUsuarios;
          this.medicamentosMasVendidos = data.value.medicamentosMasVendidos;

          const arrayData: any[] = data.value.ventasUltimaSemana;
          const labelTemp = arrayData.map((value) => value.fecha);
          const ingresosTemp = arrayData.map((value) => value.total); // Datos de ingresos
          const gananciasTemp = arrayData.map((value) => value.ganancia); // Suponiendo que la API también devuelve ganancias

          // Actualizar los datos del gráfico de barras
          this.barChartData = {
            labels: labelTemp,
            datasets: [
              {
                label: 'Ingresos',
                data: ingresosTemp,
                backgroundColor: '#6366F1'
              },
              {
                label: 'Ganancias',
                data: gananciasTemp,
                backgroundColor: '#A5B4FC'
              }
            ]
          };
        }
      },
      error: (e) => {
        console.error('Error al cargar datos:', e);
      }
    });
  }

}
