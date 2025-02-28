import { Routes } from "@angular/router";
import {InicioPagesComponent} from './pages/incio-pages/incio-pages.component'

import { ServerErrorComponent } from "../../shared/components/server-error/server-error.component";

export const authRoutes: Routes = [
  {
    path:'inicio',
    component:InicioPagesComponent,
    title:'Sistema Venta'
  },
  {
    path: 'error500',
    component: ServerErrorComponent, // Nueva ruta para el error 500
  },
  {
    path:'',
    redirectTo:'inicio',
    pathMatch:'full'
  },
]
