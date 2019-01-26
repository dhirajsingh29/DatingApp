import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthenticationService } from '../Services/authentication.service';

@Component({
  selector: 'da-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() hideRegister = new EventEmitter();

  regModel: any = {};

  constructor(private _authService: AuthenticationService) { }

  ngOnInit() {
  }

  register() {
    this._authService.register(this.regModel).subscribe(() => {
      console.log('registration successful');
    }, error => {
      console.log(error);
    });
  }

  cancel() {
    this.hideRegister.emit(false);
    console.log('cancelled');
  }

}
