import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { BaseAuthenticationService } from 'src/app/core/services/impl/base-authentication.service';

@Component({
  selector: 'app-frontpage',
  templateUrl: './frontpage.page.html',
  styleUrls: ['./frontpage.page.scss'],
})
export class FrontpagePage implements OnInit {

  constructor(
    private navCtrl: NavController,
    private authSvc: BaseAuthenticationService
  ) { }

  // Navega a la página de login
  navigateToLogin() {
    const isAuthenticated = this.authSvc.isLoggedIn(); // Verifica si el usuario está logeado

    if (isAuthenticated) {
      // Redirigir a 'home' si está autenticado
      this.navCtrl.navigateRoot('/home');
    } else {
      // Redirigir a 'login' si no está autenticado
      this.navCtrl.navigateForward('/login');
    }
  }

  // Navega a la página de registro
  navigateToRegister() {
    this.navCtrl.navigateForward('/register');
  }

  ngOnInit() {
  }
}
