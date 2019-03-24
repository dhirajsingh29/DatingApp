import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../Services/user.service';
import { AlertifyService } from '../../Services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { Pagination, PaginatedResult } from 'src/app/models/Pagination';

@Component({
  selector: 'da-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css'],
  encapsulation: ViewEncapsulation.None // this has been added to override the css of bootswatch/bootstarp.min.css features
})
export class MemberListComponent implements OnInit {

  users: User[];
  pagination: Pagination;

  user: User = JSON.parse(localStorage.getItem('user'));
  genderList = [{ value: 'male', display: 'Males' }, { value: 'female', display: 'Females' }];
  userParams: any = {};

  constructor(private _userService: UserService, private _alertify: AlertifyService,
    private _activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    // this.loadUsers();

    this._activatedRoute.data.subscribe(data => {
      this.users = data['users'].result;
      this.pagination = data['users'].pagination;
    });

    this.userParams.gender = this.user.gender === 'female' ? 'male' : 'female';
    this.userParams.minAge = 18;
    this.userParams.maxAge = 60;
    this.userParams.orderBy = 'lastActive';
  }

  resetFilters() {
    this.userParams.gender = this.user.gender === 'female' ? 'male' : 'female';
    this.userParams.minAge = 18;
    this.userParams.maxAge = 60;
    this.loadUsers();
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }

  loadUsers() {
    this._userService.getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, this.userParams)
      .subscribe((response: PaginatedResult<User[]>) => {
      this.users = response.result;
      this.pagination = response.pagination;
    }, error => {
      this._alertify.error(error);
    });
  }

}
