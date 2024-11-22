import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/core/models/auth.model';
import { BaseAuthenticationService } from 'src/app/core/services/impl/base-authentication.service';
import { PeopleService } from 'src/app/core/services/impl/people.service';
import { passwordValidator, passwordsMatchValidator } from 'src/app/core/utils/validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {

  registerForm: FormGroup;
  genders: string[] = ['Masculino', 'Femenino', 'Otros'];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route:ActivatedRoute,
    private authSvc:BaseAuthenticationService,
    private peopleSvc:PeopleService
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      surname: ['', [Validators.required, Validators.minLength(2)]],
      birthdate: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, passwordValidator]],
      confirmPassword: ['', [Validators.required]]
    },
    { validators: passwordsMatchValidator });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.authSvc.signUp(this.registerForm.value).subscribe({
        next: (resp:User) => {
          const userData = {
            ...this.registerForm.value,
            userId: resp.id.toString()
          };
          
          this.peopleSvc.add(userData).subscribe({
            next: resp => {
              const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
              this.router.navigateByUrl(returnUrl);
            },
            error: err => {}
          });
        },
        error: err => {
          console.log(err);
        }
      });
    } else {
      console.log('Formulario no válido');
    }
  }

  onLogin(){
    this.registerForm.reset();
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
    this.router.navigate(['/login'], {queryParams:{ returnUrl:returnUrl}, replaceUrl:true});
  }

  // Function to calculate age based on birthdate
  calculateAge() {
    const birthDate = new Date(this.registerForm.controls['birthdate'].value);
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

  get name(){
    return this.registerForm.controls['name'];
  }

  get surname(){
    return this.registerForm.controls['surname'];
  }
  
  get birthdate(){
    return this.registerForm.controls['birthdate'];
  }

  get gender(){
    return this.registerForm.controls['gender'];
  }

  get email(){
    return this.registerForm.controls['email'];
  }

  get password(){
    return this.registerForm.controls['password'];
  }

  get confirmPassword(){
    return this.registerForm.controls['confirmPassword'];
  }
}