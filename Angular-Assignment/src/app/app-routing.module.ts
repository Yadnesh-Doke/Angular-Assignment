import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { TodoListComponent } from './ToDo/todo-list/todo-list.component';
import { TodoAddComponent } from './ToDO/todo-add/todo-add.component';
import { TodoEditComponent } from './ToDo/todo-edit/todo-edit.component';
import { AuthGuard } from './services/Auth.guard';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const appRoutes: Routes = [
    {path: '', redirectTo: 'login', pathMatch:"full"},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
    {path: 'todoList', component:TodoListComponent, canActivate: [AuthGuard]},
    {path: 'todoAdd', component:TodoAddComponent, canActivate: [AuthGuard]},
    {path: 'todoList/:id/edit', component:TodoEditComponent, canActivate: [AuthGuard]},
    {path: 'not-found', component: PageNotFoundComponent},
    {path: '**', redirectTo: 'not-found'}
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule{

}