import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Person } from 'src/app/core/models/person.model';

@Component({
  selector: 'app-person-modal',
  templateUrl: './person-modal.component.html',
  styleUrls: ['./person-modal.component.scss'],
})
export class PersonModalComponent implements OnInit {
  genders: string[] = ['Masculino', 'Femenino', 'Otros'];
  formGroup: FormGroup;
  mode: 'new' | 'edit' = 'new';

  @Input() set person(_person: Person) {
    if (_person && _person.id) this.mode = 'edit';

    this.formGroup.controls['name'].setValue(_person.name);
    this.formGroup.controls['surname'].setValue(_person.surname);
    this.formGroup.controls['birthdate'].setValue(_person.birthdate); // Set birthdate
    this.formGroup.controls['gender'].setValue(_person.gender);
    this.formGroup.controls['email'].setValue(_person.email);
    this.formGroup.controls['groupId'].setValue(_person.groupId);
    this.calculateAge(); // Recalculate age when editing a person
  }

  constructor(private fb: FormBuilder, private modalCtrl: ModalController) {
    this.formGroup = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      surname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', [Validators.required]],
      birthdate: ['', [Validators.required]], // New birthdate field
      groupId:[null]
    });
  }

  ngOnInit() {}

  get name() {
    return this.formGroup.controls['name'];
  }

  get surname() {
    return this.formGroup.controls['surname'];
  }

  get birthdate() {
    return this.formGroup.controls['birthdate'];
  }

  get email() {
    return this.formGroup.controls['email'];
  }

  get gender() {
    return this.formGroup.controls['gender'];
  }

  // Function to calculate age based on birthdate
  calculateAge() {
    const birthDate = new Date(this.formGroup.controls['birthdate'].value);
    if (birthDate) {
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      this.calculatedAge = age; // Store the calculated age
    } else {
      this.calculatedAge = null; // Reset age if birthdate is invalid
    }
  }

  // Store the calculated age
  calculatedAge: number | null = null;

  getDirtyValues(formGroup: FormGroup): any {
    const dirtyValues: any = {};
    Object.keys(formGroup.controls).forEach((key) => {
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
        this.mode == 'new' ? this.formGroup.value : this.getDirtyValues(this.formGroup),
        this.mode
      );
    } else {
      console.log('Formulario inválido');
    }
  }
}
