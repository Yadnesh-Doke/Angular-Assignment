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
  user: User;
  imagePath;
  wrongPassword: boolean = false;
  isLoading: boolean;
  header: HeaderLinks = new HeaderLinks();

  constructor(private authService: AuthService,private router: Router, private headerService: HeaderService) {
    console.log("in profie constructor");
   }

  ngOnInit(): void {
    this.header.profileLink = false;  this.header.todoLink = true;
    this.header.logoutLink = true;   this.header.loginLink = false;
    this.headerService.headerLinks.next(this.header);

    this.authService.loggedInUser.subscribe(user => {
      this.user = user;
    });
    this.imagePath = this.user.imagePath;
    // console.log("imagePath: \n"+this.imagePath);
    console.log("User: "+this.user);
    this.profileForm = new FormGroup({
      "firstName" : new FormControl(this.user.firstName,Validators.required),
      "lastName" : new FormControl(this.user.lastName,Validators.required),
      "gender" : new FormControl(this.user.gender,Validators.required),
      "address" : new FormControl(this.user.address,Validators.required),
      "password" : new FormControl(this.user.password,Validators.required)
    });
  }

  onSubmit() {
    this.isLoading = true;
    console.log(this.profileForm);

    let ptn = /(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])(?=.*\d)/;
    let password = this.profileForm.value.password;
    if(password.match(ptn))
    {
      this.wrongPassword = false; 
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
        },3000);
      // this.toUpdateData(password,() => this.router.navigate(["../"]));
    }
    else{
      this.wrongPassword = true;
    }
  }

  ProfilePic(event: any) {
    console.log("in profilePic()");
    let profileImage = event.target.files[0];
    console.log("profileImage: " + profileImage);
    let imagereader = new FileReader();
    imagereader.readAsDataURL(profileImage);

    imagereader.onload = () => {
      this.imagePath = imagereader.result;
      (<HTMLImageElement>document.getElementById("profile")).src = this.imagePath;
      console.log(this.imagePath);
    };
  }
}
