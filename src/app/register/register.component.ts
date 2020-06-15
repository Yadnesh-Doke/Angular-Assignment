import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { User } from '../Models/user.model';
import { Router } from '@angular/router';
import { HeaderLinks } from '../Models/header-links.model';
import { HeaderService } from '../services/header-service.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @ViewChild('submitBtn', { static: true }) submitBtn: ElementRef;
  @ViewChild("confirmPassword") confirmPassword: ElementRef;
  gender: string = "male";
  imgdata = null;
  wrongPassword: boolean = false;
  diffPassword: boolean = false;
  isLoading: boolean = false;
  error: string = null;
  header: HeaderLinks = new HeaderLinks();

  constructor(private authService: AuthService,private router: Router, private headerService: HeaderService) { }

  ngOnInit(): void {
    this.header.profileLink = false;  this.header.todoLink = false;
    this.header.logoutLink = false;   this.header.loginLink = true;
    this.headerService.headerLinks.next(this.header);
  }

  getGender(event: any) {
    this.gender = event.target.value;
  }

  onSubmit(form: NgForm) {
    
    this.error = null;
    console.log(form);
    let email = form.value.email;
    let fname = form.value.firstName;
    let lname = form.value.lastName;
    let address = form.value.address;
    let imagePath = this.imgdata;
    let password = form.value.password;
    // this.gender = form.controls['gender'].value;
    if(email === "" || fname === "" || lname === "" || address === "" || imagePath === null || password === "")
    {
      alert("Please fill all the fields. All the fields are reuired.");
      return;
    }

    console.log("gender from register: "+this.gender);
    let confirmPassword = this.confirmPassword.nativeElement.value;

    console.log(form.value);
    console.log("confirm passwd: " + confirmPassword);
    this.isLoading = true;

    if (password.trim() === confirmPassword.trim()) 
    {
      this.diffPassword = false;
      let ptn = /(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])(?=.*\d)/;
      if (password.match(ptn)) 
      {
        this.wrongPassword = false;
        // this.registerUser();
        this.authService.signup(email,password).subscribe(
          (resData) => {
            let expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
            let user = new User(email,fname,lname,this.gender,address,imagePath,password,[],resData.idToken,expirationDate);
            
            this.authService.addUserToArray(user);
            this.authService.storeUser(user);
          },
          errorMessage => {
            console.log(errorMessage);
            this.error = errorMessage;
            this.isLoading = false;
          }
        );

      }
      else {
        this.wrongPassword = true;
        this.isLoading = false;
      }
    }
    else {
      this.wrongPassword = false;
      this.diffPassword = true;
      this.isLoading = false;
    }
 }


  ProfilePic(event: any) {
    console.log("in profilePic()");
    let profileImage = event.target.files[0];
    console.log("profileImage: " + profileImage);
    let imagereader = new FileReader();
    imagereader.readAsDataURL(profileImage);

    imagereader.onload = () => {
      this.imgdata = imagereader.result;
      (<HTMLImageElement>document.getElementById("profile")).src = this.imgdata;
    };
  }

  checkRadio(value){
    if(value === 1){
      (<HTMLInputElement>document.querySelector("#M")).checked = true;
    }
    else if(value === 2){
      (<HTMLInputElement>document.querySelector("#F")).checked = true;
    }
  }

}
