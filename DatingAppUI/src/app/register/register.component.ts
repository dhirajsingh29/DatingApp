import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthenticationService } from '../Services/authentication.service';
import { AlertifyService } from '../Services/alertify.service';

@Component({
  selector: 'da-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() hideRegister = new EventEmitter();

  regModel: any = {};

  constructor(private _authService: AuthenticationService, private _alertify: AlertifyService) { }

  ngOnInit() {
  }

  register() {
    this._authService.register(this.regModel).subscribe(() => {
      this._alertify.success('Registration Successful');
    }, error => {
      this._alertify.error(error);
    });
  }

  cancel() {
    this.hideRegister.emit(false);
  }

}
