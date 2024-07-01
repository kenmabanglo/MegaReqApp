import { Injectable } from '@angular/core';
import { data } from 'jquery';

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  constructor() { }

  print(rtype:string="") {
    //var allowClone = true; var clone;
    //$('.print-wrapper.clone').remove();
     
    // if (['RFP','RFA'].includes(rtype)) {
    //   if (allowClone) {
    //     clone = $('.print-wrapper').clone().addClass('clone').insertAfter($('.print-wrapper'));
    //     allowClone = false;
    //     if (rtype == 'RFA') {
    //       //$('#copy-requesitioner').appendTo(copy);
         
    //     }
    //   }
    // }

    const printContent = document.getElementById("print-preview").innerHTML;
    
    const WindowPrt = window.open('', 'PrintWindow', 'left=0,top=0,width=600,height=600,toolbar=0,scrollbars=0,status=0');
    WindowPrt.document
    .write(`<html>
    ${$('head').clone().html()}
    <body">${printContent}</body></html>`);

    WindowPrt.print();  
    setTimeout(() => {
      WindowPrt.close();
    }, 5000);

   

  }
}
