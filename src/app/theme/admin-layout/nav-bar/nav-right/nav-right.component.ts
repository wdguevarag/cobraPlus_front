// angular import
import { Component, Input, Output, EventEmitter, OnInit, Type } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { AuthService } from 'src/app/Services/Common/Auth.service';



// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

// third party

// icon
import { IconService } from '@ant-design/icons-angular';
import {
  BellOutline,
  SettingOutline,
  GiftOutline,
  MessageOutline,
  PhoneOutline,
  CheckCircleOutline,
  LogoutOutline,
  EditOutline,
  UserOutline,
  ProfileOutline,
  WalletOutline,
  QuestionCircleOutline,
  LockOutline,
  CommentOutline,
  UnorderedListOutline,
  ArrowRightOutline,
  GithubOutline,
  AppstoreAddOutline
} from '@ant-design/icons-angular/icons';
import { EmpresaService } from 'src/app/Services/empresa.service';
import { RolService } from 'src/app/Services/rol.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-nav-right',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss']
})
export class NavRightComponent implements OnInit{

  @Input() styleSelectorToggle!: boolean;
  @Output() Customize = new EventEmitter();
  windowWidth: number;
  screenFull: boolean = true;

  currentUser: any;
  fechaSistemaStorage: string;
  singleEmpresaData: any;
  isSuperAdmin: boolean = false; 


  constructor(
    private iconService: IconService,
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private empresaService: EmpresaService,
    private rolService: RolService,
    private router: Router   // Inyectamos el Router
  ) {
    this.windowWidth = window.innerWidth;
    this.iconService.addIcon(
      ...[
        CheckCircleOutline,
        GiftOutline,
        MessageOutline,
        SettingOutline,
        PhoneOutline,
        LogoutOutline,
        UserOutline,
        EditOutline,
        ProfileOutline,
        QuestionCircleOutline,
        LockOutline,
        CommentOutline,
        UnorderedListOutline,
        ArrowRightOutline,
        BellOutline,
        GithubOutline,
        WalletOutline,
        AppstoreAddOutline,
      ]
    );
  }

  currentUserRol: any  ;
  currenrUserEmpresa: any ;
  

  currenrUserData: any ;


  ngOnInit(): void {
    this.fechaSistemaStorage = this.formatearFechaSistema(localStorage.getItem('fechaSistemaStorage'));

    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;

      if(this.currentUser) {
        this.usuarioService.getUsuarioById(this.currentUser.ID).subscribe(usuario => {
          this.currenrUserData = usuario;
    
        });
      }

    });
  }

  formatearFechaSistema(fecha: string): string {
    if (!fecha) return '';
  
    const [anio, mes, dia] = fecha.split('-');
    return `${dia}-${mes}-${anio}`;
  }

  cerrarDia() {
    const empresaId = this.currentUser.Empresa_ID;

    if (!empresaId) {
      console.error('No se encontró el Empresa_ID del usuario.');
      return;
    }

    this.usuarioService.cerrarDia(empresaId).pipe(
      finalize(() => {
        console.log('Intento de cierre finalizado');
      })
    ).subscribe({
      next: (res) => {
        if(res.length > 0 && res[0].codError === "0"){
          alert('dia cerrado correctamente');
          this.handleLogout();
        } else{
          alert('dia cerrado correctamente');
          this.handleLogout();
        }
      },
      error: (err) => {
        console.error('Error al cerrar el día', err);
      }
    });
  }

  handleLogout(): void {
    console.log('Logout clicked'); 
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  usuario: any = null; 



}
