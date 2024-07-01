import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { FormBuilder, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-status-steps',
  templateUrl: './status-steps.component.html',
  styleUrls: ['./status-steps.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {displayDefaultIndicatorType: false},
    },
  ]
})
export class StatusStepsComponent implements OnInit {
  @ViewChild('stepper') stepper: MatStepper;
  _approvers: any; _closed: string;_closer: string;
  @Input() 
  set approvers(data: any) {
    this._approvers = data;
  }
  get approvers(): any {
    return this._approvers; 
  }

  @Input() 
  set closed(data: any) {
   // console.log(data);
    this._closed = data;
  }
  get closed(): any {
    return this._closed; 
  }

  @Input() 
  set closer(data: any) {
   // console.log(data);
    this._closer = data;
  }
  get closer(): any {
    return this._closer; 
  }
 
  constructor() {}

  ngOnInit(): void {
    //console.log(this._closed);
  }
}
