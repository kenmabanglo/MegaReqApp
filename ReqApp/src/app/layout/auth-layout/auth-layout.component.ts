import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
// import { AuthTab } from 'src/app/data/schema/authtab';

export interface AuthTab {
  label: string;
  route: string;
  type?: string;
}

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss']
})
export class AuthLayoutComponent {
  liveTest = window.location.port == '4446'? true:false;

  constructor(
    @Inject(DOCUMENT) private document: any,
  ) {
    this.document.body.classList.add('auth');
  }
  tabs: AuthTab[] = [
    {
      label: 'LOGIN',
      route: '/auth/login'
    },
    {
      label: 'REGISTER',
      route: '/auth/register'
    }
  ]

}
