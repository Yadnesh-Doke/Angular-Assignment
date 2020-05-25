import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { User } from '../Models/user.model';
import { HeaderService } from '../services/header-service.service';
import { HeaderLinks } from '../Models/header-links.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLoading = false;
  error: string = null;
  usersArray: User[] = [];
  header: HeaderLinks = new HeaderLinks();

  constructor(private authService: AuthService, private router: Router, private headerService: HeaderService) { }

  ngOnInit(): void {
    // this.authService.fetchUsers();
    this.header.profileLink = false;  this.header.todoLink = false;
    this.header.logoutLink = false;   this.header.loginLink = false;
    this.headerService.headerLinks.next(this.header);
    this.authService.fetchUsersArray();
  }

  login(form: NgForm) {
    this.error = null;
    console.log("from login: " + form.value);
    
    this.authService.fetchUsers().subscribe(
      users => {
        this.usersArray = users.map((user) => {
          return { ...user, todoArray: user.todoArray ? user.todoArray : [] };
        });
        console.log("users array: ");
        // this.usersChanged.next(this.usersArray.slice());
        console.log(this.usersArray);
        this.isLoading = true;
        let email = form.value.email;
        let password = form.value.password;
        this.authService.login(email, password).subscribe(
          response => {
            console.log("login successful!");
            let loggedInUser = this.usersArray.find(x => x.email === response.email);
            console.log("logged in user: ");
            console.log(loggedInUser);
            // loggedInUser.loginStatus = true;
            this.authService.loggedInUser.next(loggedInUser);
            console.log("CURRENT USER EMITTED");

            localStorage.setItem("user", JSON.stringify({
              email: response.email,
              token: response.idToken
            }));
            this.header.imgSrc = loggedInUser.imagePath;
            this.headerService.headerLinks.next(this.header);

            this.isLoading = false;
            this.router.navigate(['/todoList']);

          }, errorMessage => {
            console.log("AN ERROR OCCURED");
            this.isLoading = false;
            this.error = errorMessage;
          }
        );
      }
    );

  }

}
