import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FrontpagePageRoutingModule } from './frontpage-routing.module';

import { FrontpagePage } from './frontpage.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FrontpagePageRoutingModule
  ],
  declarations: [FrontpagePage]
})
export class FrontpagePageModule {}
