import { BreakpointState, BreakpointObserver } from '@angular/cdk/layout';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { filter, forkJoin, interval, map, mergeMap, Observable, switchMap } from 'rxjs'; 

import { Constants } from 'src/app/core/constants/constants';

import { AuthenticationService } from 'src/app/core/service/authentication.service';
import { NotificationService, RequestService } from 'src/app/shared/service';
import { UserService } from 'src/app/shared/service/user.service';
import { SidenavService } from '../sidenav/sidenav.service';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() sidenav: MatSidenav;

  title = "MegaReqApp";

  public isHandset$: Observable<boolean> = this.breakpointObserver
  .observe(['(max-width: 550px)'])
  .pipe(map((result: BreakpointState) => 
    result.matches
  ));

  public user: any;
  viewedPage: any;

  hidden = false;
  totalPending = 0;
  counts = [];

  constructor( 
    public authService: AuthenticationService,
    private jwtHelper: JwtHelperService,
    private router: Router, 
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private sidenavService: SidenavService,
    private breakpointObserver: BreakpointObserver ,
    private requestService: RequestService,
    private notif: NotificationService
    ) {
      this.authService.user.subscribe(x => this.user = x);
      if (this.user.role == 'Admin') {
      interval(120 * 1000)  //5mins
      .pipe(
        switchMap(value => forkJoin(
          [
            this.notif.getTotalPendingRequests(this.user.userName),
            this.notif.getTotalInactiveUsers(this.user.userName)
          ]
        )
    )
      )
      .subscribe(data => { 
        this.counts = data; 
        this.totalPending = this.counts[0] + this.counts[1]; 
      });
    }
    else {
       
      interval(120 * 1000) //5mins
      .pipe(
          mergeMap(() => this.notif.getTotalPendingRequests(this.user.userName) )
      )
      .subscribe(data => { 
        this.totalPending = data; 
        this.counts[0] = data;
        this.counts[1] = 0;
      });
    }
    }

  ngOnInit(): void {
    if (this.user.role=='Admin') {
      forkJoin([
        this.notif.getTotalPendingRequests(this.user.userName),
        this.notif.getTotalInactiveUsers(this.user.userName)
      ]).subscribe((data) => { 
        this.counts = data;  
        this.totalPending = this.counts[0] + this.counts[1]; 
      });
    }
    else {
      this.notif.getTotalPendingRequests(this.user.userName) 
      .subscribe((data)=> {
        //console.log(data);
        this.totalPending = data; 
        this.counts[0] = data;
        this.counts[1] = 0;
      });
    }
  }

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }

  onLogout() {
    // localStorage.removeItem(Constants.JWT_KEY);
    this.authService.logout();
    localStorage.removeItem(Constants.JWT_KEY);
    window.location.reload();
  }

}
