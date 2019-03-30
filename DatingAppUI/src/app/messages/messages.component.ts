import { Component, OnInit } from '@angular/core';
import { Message } from '../models/message';
import { Pagination, PaginatedResult } from '../models/Pagination';
import { UserService } from '../Services/user.service';
import { AuthenticationService } from '../Services/authentication.service';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from '../Services/alertify.service';

@Component({
  selector: 'da-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: Message[];
  pagination: Pagination;
  messageContainer = 'Unread';

  constructor(private _userService: UserService, private _authenticationService: AuthenticationService,
      private _route: ActivatedRoute, private _alertify: AlertifyService) { }

  ngOnInit() {
    this._route.data.subscribe(data => {
      this.messages = data['messages'].result;
      this.pagination = data['messages'].pagination;
    });
  }

  loadMessages() {
    this._userService.getMessages(this._authenticationService.decodedToken.nameid, this.pagination.currentPage,
      this.pagination.itemsPerPage, this.messageContainer)
      .subscribe((response: PaginatedResult<Message[]>) => {
        this.messages = response.result;
        this.pagination = response.pagination;
      }, error => {
        this._alertify.error(error);
      });
  }

  deleteMessage(id: number) {
    this._alertify.confirm('Sure of deleting the message?', () => {
      this._userService.deleteMessage(id, this._authenticationService.decodedToken.nameid)
        .subscribe(() => {
          this.messages.splice(this.messages.findIndex(x => x.id === id), 1);
          this._alertify.success('Message has been deleted.');
        }, error => {
          this._alertify.error(error);
        });
    });
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadMessages();
  }

}
