import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { HeaderService } from '../services/header-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  profileLink: boolean = false;
  todoLink: boolean = false;
  logoutLink: boolean = false;
  loginLink: boolean = false;
  imgSrc: string = "";

  constructor(private headerService: HeaderService, private authService: AuthService,private router: Router) { }

  ngOnInit(): void {
      this.headerService.headerLinks.subscribe(headerLinks => {
        this.profileLink = headerLinks.profileLink;
        this.todoLink = headerLinks.todoLink;
        this.logoutLink = headerLinks.logoutLink;
        this.loginLink = headerLinks.loginLink;
        this.imgSrc = headerLinks.imgSrc;
      })
  }

  logout(){
    localStorage.clear();
    this.authService.loggedInUser.next(null);
    this.router.navigate(["/login"]);
  }

}
