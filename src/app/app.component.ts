import { Component } from '@angular/core';
import { BaseAuthenticationService } from './core/services/impl/base-authentication.service';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    public authSvc: BaseAuthenticationService,
    private router: Router,
    private menuCtrl: MenuController
  ) {}

  closeMenu(){
    this.menuCtrl.close();
  }

  logout() {
    this.authSvc.signOut().subscribe(()=>{
      this.router.navigate(['/frontpage']);
    });
  }
}