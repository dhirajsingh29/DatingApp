import { Injectable } from '@angular/core';
// alertify is already declared in angular.json file
// but we need to declare the same in our service, as below, inorder for tslint to not show errors
declare let alertify: any;

@Injectable({
  providedIn: 'root'
})
export class AlertifyService {
  constructor() {}

  confirm(message: string, okCallBack: () => any) {
    alertify.confirm(message, function(e) {
      if (e) {
        okCallBack();
      } else {}
    });
  }

  success(message: string) {
    alertify.success(message);
  }

  error(message: string) {
    alertify.error(message);
  }

  warning(message: string) {
    alertify.warning(message);
  }

  message(message: string) {
    alertify.message(message);
  }
}
