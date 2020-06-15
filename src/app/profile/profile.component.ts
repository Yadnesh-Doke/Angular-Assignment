import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from '../Models/user.model';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { HeaderService } from '../services/header-service.service';
import { HeaderLinks } from '../Models/header-links.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  usersArray: User[] = [];
  user: User;
  imagePath;
  wrongPassword: boolean = false;
  isLoading: boolean;
  header: HeaderLinks = new HeaderLinks();

  constructor(private authService: AuthService, private router: Router, private headerService: HeaderService) {  }

  ngOnInit(): void {
    this.header.profileLink = false; this.header.todoLink = true;
    this.header.logoutLink = true; this.header.loginLink = false;
    this.headerService.headerLinks.next(this.header);

    this.authService.loggedInUser.subscribe(user => {
      this.user = user;
    });
    // this.imagePath = this.user.imagePath;

    this.authService.fetchUsers().subscribe(
      users => {
        this.usersArray = users.map((user) => {
          return { ...user, todoArray: user.todoArray ? user.todoArray : [] };
        });
        let currUser = JSON.parse(localStorage.getItem("user"));
        let currentUser = this.usersArray.find(user => user.email === currUser.email);
        this.user = currentUser;
        this.imagePath = this.user.imagePath;
        this.headerService.headerLinks.next(this.header);
      }
    );

    this.imagePath = this.user.imagePath;
    this.profileForm = new FormGroup({
      "firstName": new FormControl(this.user.firstName, Validators.required),
      "lastName": new FormControl(this.user.lastName, Validators.required),
      "gender": new FormControl(this.user.gender, Validators.required),
      "address": new FormControl(this.user.address, Validators.required),
      "password": new FormControl(this.user.password, Validators.required)
    });

  }

  onSubmit() {
    this.isLoading = true;
    console.log(this.profileForm);

    let ptn = /(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])(?=.*\d)/;
    let password = this.profileForm.value.password;
    if (password.match(ptn)) {
      this.wrongPassword = false;
      this.user.firstName = this.profileForm.value.firstName;
      this.user.lastName = this.profileForm.value.lastName;
      this.user.gender = this.profileForm.value.gender;
      this.user.address = this.profileForm.value.address;
      this.user.password = password;
      this.user.imagePath = this.imagePath;
      this.authService.loggedInUser.next(this.user);
      this.authService.updateData(
        this.profileForm.value.firstName,
        this.profileForm.value.lastName,
        this.profileForm.value.gender,
        this.profileForm.value.address,
        password,
        this.imagePath
      );

      setTimeout(() => {
        this.isLoading = false;
        this.router.navigate(["/todoList"]);
      }, 3000);
      // this.toUpdateData(password,() => this.router.navigate(["../"]));
    }
    else {
      this.wrongPassword = true;
    }
  }

  ProfilePic(event: any) {
    console.log("in profilePic()");
    let profileImage = event.target.files[0];
    let imagereader = new FileReader();
    imagereader.readAsDataURL(profileImage);

    imagereader.onload = () => {
      this.imagePath = imagereader.result;
      (<HTMLImageElement>document.getElementById("profile")).src = this.imagePath;
      console.log(this.imagePath);
    };
  }

  checkRadio(value) {
    if (value === 1) {
      (<HTMLInputElement>document.querySelector("#male")).checked = true;
    }
    else if (value === 2) {
      (<HTMLInputElement>document.querySelector("#female")).checked = true;
    }
  }
}
