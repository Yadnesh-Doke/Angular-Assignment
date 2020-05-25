import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  template: '<div class="lds-ring"><div></div><div></div><div></div><div></div></div><h1>Loading...</h1>',
  styleUrls: ['./loading-spinner.component.css']
})
export class LoadingSpinnerComponent{

}
