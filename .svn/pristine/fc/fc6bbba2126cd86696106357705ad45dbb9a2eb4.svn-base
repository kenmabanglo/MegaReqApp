import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

import { Router } from '@angular/router';   
import { AuthenticationService } from 'src/app/core/service/authentication.service';
import { UserService } from 'src/app/shared/service/user.service';
import { SidenavService } from './sidenav.service';  
import { sidenavItems } from './_nav'; 
import { viewers } from 'src/app/core/guard/viewer_list';
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements AfterViewInit {
  visible: boolean;
  public user: any;
  title = "MegaReqApp";  

  isExpanded = true;
  showSubmenu: boolean = true;
  isShowing = false;
  showSubSubMenu: boolean = true;
  navItems:any; 

  constructor(
    private router: Router, 
    private sidenavService: SidenavService,
    public authenticationService: AuthenticationService,
    private userService: UserService
  ) {
    this.authenticationService.user.subscribe(x => this.user = x);
    this.visible = false;  

    let view_only  = viewers;
    
    if (this.user.role != 'Admin') {
      // delete(this.navItems[0]);
    }
    let rights; 
    let filtered_navitems = sidenavItems;

    this.userService.getUserRights(this.user.userName)
    .subscribe({
      next:(data)=> {
        rights = data;
        //console.log(rights.length == 0, rights.includes('VA'));

        if (rights.length == 0 && !rights.includes('VA')) {
        // if (!view_only.includes(this.user.userName)) {
          filtered_navitems = sidenavItems.filter((x)=> x.name !== 'Approved Requests');
        } 

        if (this.user.approver == 0) { 
          filtered_navitems = filtered_navitems.filter((x)=> x.name !== 'Approvals');
          this.navItems = filtered_navitems;
        }
        else {
          this.navItems = filtered_navitems;
        }
        
      },
      error: (err) => {

      }
    })
   

   
 
   }

  ngAfterViewInit(): void { 
  }
  
  get isAdmin() {
    return this.user && this.user.role === 'SuperAdmin';
  }

  get uRole() {
    return this.user && this.user.role;
  }

  // filterRights(navItems): any[] {  
  //   return navItems.filter(nav => this.user.rights.includes(nav.code));
  // }

  // filterChildRights(navItems): any[] {  
  //   return navItems.filter(nav => this.user.rights.includes(nav.code));
  // }

  onLogout() {
     this.authenticationService.logout();
   }
  

}
