import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { SidenavService } from './layout/sidenav/sidenav.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title="ReqApp";
  @ViewChild('sidenav') public sidenav!: MatSidenav;
  constructor( 
    private sidenavService: SidenavService,private router: Router 
  ) { 
    //console.log(this.router.url)
  }
  
  ngAfterViewInit(): void {
    this.sidenavService.setSidenav(this.sidenav);
  }
}
