import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthenticationService } from '../Services/authentication.service';
import { AlertifyService } from '../Services/alertify.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { User } from '../models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'da-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() hideRegister = new EventEmitter();

  user: User;
  registrationForm: FormGroup;
  // making a class Partial makes all the types in the class optional,
  // hence we can just use what we need
  bsDatePickerConfig: Partial<BsDatepickerConfig>;

  constructor(private _authService: AuthenticationService, private _alertify: AlertifyService,
    private _fb: FormBuilder, private _router: Router) { }

  ngOnInit() {
    // this.registrationForm = new FormGroup({
    //   username: new FormControl('', Validators.required),
    //   password: new FormControl('', [
    //     Validators.required,
    //     Validators.minLength(8),
    //     Validators.maxLength(16)
    //   ]),
    //   confirmPassword: new FormControl('', Validators.required)
    // }, this.passwordMatchconfirmPasswordValidator);

    this.bsDatePickerConfig = {
      containerClass: 'theme-default'
    },
    this.createRegistrationForm();
  }

  createRegistrationForm() {
    this.registrationForm = this._fb.group({
      username: ['', Validators.required],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(16)]],
        confirmPassword: ['', Validators.required],
        gender: ['male'],
        nickname: ['', Validators.required],
        dateOfBirth: [null, Validators.required],
        city: ['', Validators.required],
        country: ['', Validators.required]
    }, { validator: this.passwordMatchconfirmPasswordValidator });
  }

  passwordMatchconfirmPasswordValidator(registerForm: FormGroup) {
    return registerForm.get('password').value === registerForm.get('confirmPassword').value
      ? null
      : { 'mismatch': true };
  }

  register() {
    if (this.registrationForm.valid) {
      // Object.assign is a javascript method which assign value from registration form to empty object
      // which is then assigned to the user object
      this.user = Object.assign({}, this.registrationForm.value);

      this._authService.register(this.user).subscribe(() => {
        this._alertify.success('Registration Successful');
      }, error => {
        this._alertify.error(error);
      }, () => {
        // with the third parameter of subscribe method we can give one more function call,
        // of what needs to be done on complete; here we are automatically logging the user
        this._authService.login(this.user).subscribe(() => {
          this._router.navigate(['/members']);
        });
      });
    }
  }

  cancel() {
    this.hideRegister.emit(false);
  }

}
