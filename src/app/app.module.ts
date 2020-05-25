import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { LoadingSpinnerComponent } from './shared/loading-spinner.component';
import { ProfileComponent } from './profile/profile.component';
import { TodoListComponent } from './ToDo/todo-list/todo-list.component';
import { TodoAddComponent } from './ToDO/todo-add/todo-add.component';
import { TodoEditComponent } from './ToDo/todo-edit/todo-edit.component';
import { FilterPipe } from './ToDo/todo-list/filter.pipe';
import { FilterDropdownPipe } from './ToDo/todo-list/filter-dropdown.pipe';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    RegisterComponent,
    LoginComponent,
    LoadingSpinnerComponent,
    ProfileComponent,
    TodoListComponent,
    TodoAddComponent,
    TodoEditComponent,
    FilterPipe,
    FilterDropdownPipe,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
