import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { User } from '../models/user';
import { Pagination, PaginatedResult } from '../models/Pagination';
import { AuthenticationService } from '../Services/authentication.service';
import { UserService } from '../Services/user.service';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from '../Services/alertify.service';

@Component({
  selector: 'da-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ListsComponent implements OnInit {
  users: User[];
  pagination: Pagination;
  likesParam: string;

  constructor(private _authenticationService: AuthenticationService, private _userService: UserService,
    private _route: ActivatedRoute, private _alertify: AlertifyService) { }

  ngOnInit() {
    this._route.data.subscribe(data => {
      this.users = data['users'].result;
      this.pagination = data['users'].pagination;
    });
    this.likesParam = 'Likers';
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }

  loadUsers() {
    this._userService
      .getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, null, this.likesParam)
      .subscribe((response: PaginatedResult<User[]>) => {
      this.users = response.result;
      this.pagination = response.pagination;
    }, error => {
      this._alertify.error(error);
    });
  }

}
