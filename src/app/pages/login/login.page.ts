import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private navCtrl: NavController) { }

  // Método para navegar a la página principal o a cualquier otra página
  navigateHome() {
    this.navCtrl.navigateForward('/home'); // Redirige a la página principal ('/')
  }

  ngOnInit() {
  }

}