import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../../models/message';
import { UserService } from 'src/app/Services/user.service';
import { AuthenticationService } from 'src/app/Services/authentication.service';
import { AlertifyService } from 'src/app/Services/alertify.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'da-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  @Input() recipientID: number;
  messages: Message[];
  newMessage: any = {};

  constructor(private _userService: UserService, private _authenticationService: AuthenticationService,
    private _alertify: AlertifyService) { }

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    const currentUserId = +this._authenticationService.decodedToken.nameid;
    this._userService.getMessageThread(this._authenticationService.decodedToken.nameid, this.recipientID)
      .pipe(
        tap(messages => {
          for (let i = 0; i < messages.length; i++) {
            if (messages[i].isRead === false && messages[i].recipientId === currentUserId) {
              this._userService.markAsRead(currentUserId, messages[i].id);
            }
          }
        })
      )
      .subscribe(messages => {
        this.messages = messages;
      }, error => {
        this._alertify.error(error);
      });
  }

  sendMessage() {
    this.newMessage.recipientID = this.recipientID;
    this._userService.sendMessage(this._authenticationService.decodedToken.nameid, this.newMessage)
      .subscribe((message: Message) => {
        this.messages.unshift(message); // unshift to add the message at start of array
        this.newMessage.content = '';
      }, error => {
        this._alertify.error(error);
      });
  }

}
