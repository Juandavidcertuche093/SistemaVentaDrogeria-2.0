import { Routes } from "@angular/router";
import { LayoutComponent } from "./components/layout/layout.component";

export const layoutRoute: Routes = [
  {
    path:'',
    component:LayoutComponent,
    children: [
      {
        path:'dashboard',
        loadChildren: () => import('./../dashboard/dashboard.routes').then((m) => m.DashboardRoutes),
      },
      {
        path:'usuarios',
        loadChildren: () => import('./../users/users.routes').then((m) => m.usersRoutes),
      },
      {
        path:'medicamentos',
        loadChildren: () => import('./../medicine/medicine.routes').then((m) => m.medicieneRoutes),
      },
      {
        path:'venta',
        loadChildren: () => import('./../sales/sales.routes').then((m) => m.salesRoutes),
      },
      {
        path:'historialVenta',
        loadChildren: () => import('./../salesHistory/saleshistory.routes').then((m) => m.salesHistoryRoutes),
      },
      {
        path:'reportes',
        loadChildren: () => import('./../report/report.routes').then((m) => m.reportRoutes),
      },
      // {
      //   path:'401 No autorizado',
      //   component:NotFoundComponent
      // },
      // {
      //   path:'**',
      //   redirectTo:'401 No autorizado'
      // }

    ]
  }
]
