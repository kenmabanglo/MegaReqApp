import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core'; 
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable, map, mergeMap, filter } from 'rxjs';

@Component({
  selector: 'app-content-layout',
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.scss']
})
export class ContentLayoutComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  public isHandset$: Observable<boolean> = this.breakpointObserver
  .observe(['(max-width: 992px)'])
  .pipe(map((result: BreakpointState) => 
    result.matches
  ));
  title: any;
  title_icon: any;

  constructor( 
    private breakpointObserver: BreakpointObserver,
    private router: Router,@Inject(DOCUMENT) private document: any,
    private activatedRoute: ActivatedRoute
    ) {
      this.document.body.classList.remove('auth');
      // get router data
    this.router.events
    .pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
    )
    .pipe(
      filter(route => route.outlet === 'primary'),
      mergeMap(route => route.data),
    )
    .subscribe(event => {
      this.title = event['title'];
      this.title_icon = event['icon'];
      // console.log(event);
    });
    }

  ngOnInit(): void {
   
  }

  dashboardOutlet: boolean;

  onActivate(event : any) {
    this.dashboardOutlet = true;
  }

  onDeactivate(event : any) {
    this.dashboardOutlet = false;
  }
}
