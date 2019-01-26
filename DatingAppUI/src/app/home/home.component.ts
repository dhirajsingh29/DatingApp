import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'da-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  showRegister = false;

  constructor(private _http: HttpClient) { }

  ngOnInit() {
  }

  showRegisterComponent() {
    this.showRegister = true;
  }

  hideRegisterComponent(showRegister: boolean) {
    this.showRegister = showRegister;
  }

}
