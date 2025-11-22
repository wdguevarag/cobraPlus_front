import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/Services/Common/Auth.service';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/Services/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  // Usamos un arreglo para almacenar todos los mensajes de error actuales
  errorMessages: string[] = [];
  passwordFieldType: string = 'password'; 

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }
  

  onSubmit(): void {
    this.errorMessages = [];

    // Validaciones del formulario (igual que antes)
    const emailControl = this.loginForm.get('email');
    if (emailControl?.errors) {
      if (emailControl.errors['required']) this.errorMessages.push('El campo email es obligatorio.');
      if (emailControl.errors['email']) this.errorMessages.push('Ingrese un email válido.');
    }

    const passwordControl = this.loginForm.get('contrasena');
    if (passwordControl?.errors) {
      if (passwordControl.errors['required']) this.errorMessages.push('El campo contraseña es obligatorio.');
    }

    if (this.errorMessages.length > 0) return;

    const { email, contrasena } = this.loginForm.value;

    // 🔑 NUEVO: llamamos al backend LOGIN en vez de getUsuarios

    this.usuarioService.login(email, contrasena).subscribe({
      next: (resp) => {
        if (!resp || !resp.ID) {        // 👈 aquí el cambio
          this.errorMessages.push('Credenciales inválidas o usuario sin acceso.');
          return;
        }

        // Guardar datos si necesitas
        // localStorage.setItem('token', resp.token);

        this.authService.login(email, contrasena).subscribe({
          next: () => this.router.navigate(['/']),
          error: () => this.errorMessages.push('Error en el proceso de autenticación.')
        });
      },
      error: (err) => {
        console.error('Error en login backend:', err);
        this.errorMessages.push('Error de comunicación con el servidor.');
      }
    });


  }

  

  // Método para ingresar automáticamente como SuperAdmin

}
