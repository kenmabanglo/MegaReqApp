import { Component, OnInit } from '@angular/core';
import { interval, mergeMap } from 'rxjs';
import { viewers } from 'src/app/core/guard/viewer_list';
import { AuthenticationService } from 'src/app/core/service';
import { User } from 'src/app/shared/interface/user.interface';
import { NotificationService } from 'src/app/shared/service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  user: any;
  viewer: boolean = false;
  // totalPending: number;

  constructor(
    private authService: AuthenticationService,
    private notif: NotificationService
    ) {
    this.authService.user.subscribe(x=> this.user = x);
    let view_only  = viewers;
    
    if (view_only.includes(this.user.userName)) {
      this.viewer = true;
    }
    // interval(5 * 1000) //5mins
    //   .pipe(
    //       mergeMap(() => this.notif.getTotalPendingRequests(this.user.userName) )
    //   )
    //   .subscribe(data => { this.totalPending = data; });
   }

  ngOnInit(): void {
    // this.notif.getTotalPendingRequests(this.user.userName)
    // .subscribe(data=>this.totalPending = data);
  }

}
