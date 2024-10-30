import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Group } from 'src/app/core/models/group.model';

@Component({
  selector: 'app-group-modal',
  templateUrl: './group-modal.component.html',
  styleUrls: ['./group-modal.component.scss'],
})
export class GroupModalComponent implements OnInit {
  formGroup: FormGroup;
  mode: 'new' | 'edit' = 'new';

  @Input() set group(_group: Group) {
    if (_group && _group.id) {
      this.mode = 'edit';
      this.formGroup.controls['name'].setValue(_group.name);
    }
  }

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController
  ) {
    this.formGroup = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  ngOnInit() {}

  get name() {
    return this.formGroup.controls['name'];
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
