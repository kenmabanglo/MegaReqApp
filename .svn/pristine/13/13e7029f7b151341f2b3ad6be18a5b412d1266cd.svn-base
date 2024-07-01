import { Component, OnInit, ViewEncapsulation } from '@angular/core';
declare var require: any
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FooterComponent implements OnInit {
  public version = require('../../../../package.json').version;
  year: number = new Date().getFullYear();

  constructor() { }

  ngOnInit(): void {
  }

}
