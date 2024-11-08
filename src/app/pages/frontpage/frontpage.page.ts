import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-frontpage',
  templateUrl: './frontpage.page.html',
  styleUrls: ['./frontpage.page.scss'],
})
export class FrontpagePage implements OnInit {

  constructor(
    private navCtrl: NavController
  ) { }

  // Navega a la página de login
  navigateToLogin() {
    this.navCtrl.navigateForward('/login');
  }

  // Navega a la página de registro
  navigateToRegister() {
    this.navCtrl.navigateForward('/register');
  }

  ngOnInit() {
  }
}
