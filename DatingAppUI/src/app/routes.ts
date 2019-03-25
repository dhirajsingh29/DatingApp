import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { ListsComponent } from './lists/lists.component';
import { UserDetailComponent } from './members/user-detail/user-detail.component';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { AuthGuard } from './guards/auth.guard';
import { ProtectUnsavedChangesGuard } from './guards/protect-unsaved-changes.guard';
import { UserDetailResolver } from './members/user-detail/user-detail.resolver';
import { MemberListResolver } from './members/member-list/member-list.resolver';
import { MemberEditResolver } from './members/member-edit/member-edit.resolver';
import { ListsResolver } from './lists/lists.resolver';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        children: [
            {
                path: 'members',
                component: MemberListComponent,
                resolve: { users: MemberListResolver }
            },
            {
                path: 'members/:id',
                component: UserDetailComponent,
                resolve: { user: UserDetailResolver }
            },
            {
                path: 'member/edit',
                component: MemberEditComponent,
                resolve: { user: MemberEditResolver },
                // canDeactivate Guard helps prevent accidental loss of data if we we click on some
                // link accidentally
                canDeactivate: [ProtectUnsavedChangesGuard]
            },
            {
                path: 'messages',
                component: MessagesComponent
            },
            {
                path: 'lists',
                component: ListsComponent,
                resolve: { users: ListsResolver }
            }
        ]
    },
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
    }
];
