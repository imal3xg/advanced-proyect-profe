import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupSelectableComponent } from '../components/group-selectable/group-selectable.component';
import { PersonModalComponent } from '../components/person-modal/person-modal.component';
import { GroupModalComponent } from '../components/group-modal/group-modal.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    PersonModalComponent, 
    GroupSelectableComponent, 
    GroupModalComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
  ],
  exports: [
    PersonModalComponent, 
    GroupSelectableComponent, 
    GroupModalComponent
  ]
})
export class SharedModule { }