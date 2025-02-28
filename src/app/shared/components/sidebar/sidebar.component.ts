import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';

//Angular Material
import {MatBadgeModule} from '@angular/material/badge';
import {MatMenuModule} from '@angular/material/menu';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatListModule } from '@angular/material/list';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';

//interfaces
import { Menu } from '../../../core/interface/menu.interface';

//Servicios
import { TokenService } from '../../../services/token.service';
import { MenuService } from '../../services/menu.service';
import { AuthUsuarioService } from '../../../modules/authentication/services/auth-usuario.service';
import { NotificacionesService } from '../../services/notificaciones.service';

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterModule,
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    OverlayModule,
    MatListModule,
    MatBadgeModule,
    MatMenuModule
  ],
  animations: [
    trigger('sidebarAnimation', [
      state('expanded', style({ width: '220px' })),
      state('collapsed', style({ width: '65px' })),
      transition('expanded <=> collapsed', animate('300ms ease-in-out')) // Ajusta la velocidad aquí
    ])
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  medicamentosStockBajo: any[] = [];

  //Una señal reactiva que registra si la barra lateral está contraída o no
  collapse = signal(false)
  sideNavCollapse = signal(false)

    //Propiedad calculada que devuelve el ancho de la barra lateral Si está contraída, el ancho es de '65 px'; de lo contrario, es de '250 px'.
  sidenavWidth = computed(() => this.collapse() ? '65px' : '220px');

  listaMenus:Menu[] = [];
  correoUsuario:string='';
  rolUsuario:string='';


  private tokenService = inject(TokenService)
  private menuServicio = inject(MenuService)
  private authusuarioService = inject(AuthUsuarioService)
  private notificacionesServicio = inject(NotificacionesService)
  private router = inject(Router)


  public user = computed(() => this.authusuarioService.currentUser() )


  ngOnInit(): void {
    this.obtenerNotificacionesStock();
    // Obtener el usuario actual desde el servicio
    const usuario = this.user(); // Usamos el `computed` para acceder al usuario

    if (usuario) {
      this.correoUsuario = usuario.correo;
      this.rolUsuario = usuario.rolDescripcion;

      // Llamar al servicio para obtener la lista de menús
      this.menuServicio.lista(usuario.idUsuario)
      .subscribe({
        next: (data) => {
          if (data && data.status) {
            this.listaMenus = data.value; // Ahora `value` es un array de `Menu[]`
          }
        },
        error: (e) => {
          console.error("Error cargando menús:", e);
        }
      });
    }

  }

  obtenerNotificacionesStock() {
    this.notificacionesServicio.btenerMedicamentosConStockBajo().subscribe({
      next: (data) => {
        this.medicamentosStockBajo = data;
      },
      error: (err) => {
        console.error('Error obteniendo medicamentos con stock bajo', err);
        alert('Error obteniendo medicamentos con stock bajo')
      }
    });
  }

  logout() {
    this.tokenService.removeToken();  // Elimina el token
    this.router.navigate(['/inicio']); // Redirige al usuario a la página de login
  }

  profilePicSize = computed(() => this.sideNavCollapse() ? '32' : '100');

}
