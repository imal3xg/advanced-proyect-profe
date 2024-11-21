import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Group } from 'src/app/core/models/group.model';
import { Countries } from 'src/app/core/models/countries.enum';

@Component({
  selector: 'app-group-modal',
  templateUrl: './group-modal.component.html',
  styleUrls: ['./group-modal.component.scss'],
})
export class GroupModalComponent implements OnInit {
  countries: string[] = Object.values(Countries);
  formGroup: FormGroup;
  mode: 'new' | 'edit' = 'new';

  @Input() set group(_group: Group) {
    if (_group && _group.id) {
      this.mode = 'edit';
      this.formGroup.controls['name'].setValue(_group.name);
      this.formGroup.controls['country'].setValue(_group.country);
    }
  }

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController
  ) {
    this.formGroup = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      country: ['', [Validators.required]]
    });
  }

  ngOnInit() {}

  get name() {
    return this.formGroup.controls['name'];
  }

  get country() {
    return this.formGroup.controls['country'];
  }

  getDirtyValues(formGroup: FormGroup): any {
    const dirtyValues: any = {};
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control?.dirty) {
        dirtyValues[key] = control.value;
      }
    });
    return dirtyValues;
  }

  onSubmit() {
    if (this.formGroup.valid) {
      this.modalCtrl.dismiss(
        this.mode === 'new' ? this.formGroup.value : this.getDirtyValues(this.formGroup),
        this.mode
      );
    } else {
      console.log('Formulario inválido');
    }
  }
}
