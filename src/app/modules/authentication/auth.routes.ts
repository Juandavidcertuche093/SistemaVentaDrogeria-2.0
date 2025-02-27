import { Routes } from "@angular/router";
import {InicioPagesComponent} from './pages/incio-pages/incio-pages.component'

export const authRoutes: Routes = [
  {
    path:'inicio',
    component:InicioPagesComponent,
    title:'Sistema Venta'
  },
  // {
  //   path:'login',
  //   component:LoginPagesComponent,

  // },
  // {
  //   path: 'error500',
  //   component: SeverErrorComponent, // Nueva ruta para el error 500
  // },
  {
    path:'',
    redirectTo:'inicio',
    pathMatch:'full'
  },
]
