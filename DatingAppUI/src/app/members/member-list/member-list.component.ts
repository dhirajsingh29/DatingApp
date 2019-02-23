import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../Services/user.service';
import { AlertifyService } from '../../Services/alertify.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'da-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {

  users: User[];

  constructor(private _userService: UserService, private _alertify: AlertifyService,
    private _activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    // this.loadUsers();

    this._activatedRoute.data.subscribe(data => {
      this.users = data['users'];
    });
  }

  // this method is no longer required as Resolver is in place
  // loadUsers() {
  //   this._userService.getUsers().subscribe((users: User[]) => {
  //     this.users = users;
  //   }, error => {
  //     this._alertify.error(error);
  //   });
  // }

}
