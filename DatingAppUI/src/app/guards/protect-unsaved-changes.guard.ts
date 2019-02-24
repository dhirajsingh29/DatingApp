import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { MemberEditComponent } from '../members/member-edit/member-edit.component';

@Injectable({
    providedIn: 'root'
})
export class ProtectUnsavedChangesGuard implements CanDeactivate<MemberEditComponent> {
    canDeactivate(component: MemberEditComponent)  {
        if (component.editForm.dirty) {
            return confirm('You sure about continuing? Unsaved changes will be lost!');
        }
        return true;
    }
}
