import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { map, Observable, startWith, Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/core/service/authentication.service';
import { DivisionMaster } from 'src/app/shared/interface/division-master.interface';
import { NotificationService } from 'src/app/shared/service/notification.service';
import { UserService } from 'src/app/shared/service/user.service';
import { ViewMasterService } from 'src/app/shared/service/view-master.service';
//import branchesJson from 'src/app/core/data/branches.json';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { PageEvent } from '@angular/material/paginator';


export function RequireMatch(control: AbstractControl) { 
  const selection: any = control.value;
  if (typeof selection === 'string' && selection !== '') {
      return { incorrect: true };
  }
  return null;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../auth-form.component.scss']
})
export class RegisterComponent implements OnInit {
 
  public registerForm!: FormGroup;
  isSaving: any;
  error: string;
  
  branchSelect: any;
  branches: DivisionMaster[] = [];
  @ViewChild('searchB') sbInput: ElementRef;
  hiddenCloseBranch: boolean = true;
  filteredOptions: Observable<DivisionMaster[]>;
  @ViewChild(MatAutocompleteTrigger) trigger: MatAutocompleteTrigger;
  
  constructor(
    private userService: UserService,
    private router: Router, 
    private http: HttpClient, 
    private formBuilder: FormBuilder,
    private notif: NotificationService,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private vwMaster: ViewMasterService
  ) { 
    this.getBranches();
  }

  ngOnInit(): void {
    this.buildForm();
   

    // this.filteredOptions =  this.registerForm.controls['branchCode'].valueChanges.pipe(
    //   startWith(''),
    //   map(value => {

    //     const name = typeof value === 'string' ? value : value?.divisionName;
    //     return name ? this._filter(name as string) : this.branches.slice();
    //   }),
    // );
  }

  ngAfterViewInit() {
    // this.trigger.panelClosingActions.subscribe((e) => {
    //   if (!(e && e.source)) {
    //     this.registerForm.get('branchCode').setValue('');
    //     this.trigger.closePanel();
    //   }
    // });
  }

  private buildForm(): void {
    this.registerForm = new FormGroup({
      userName: new FormControl('', [Validators.required, Validators.maxLength(8)]),
      firstName: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      lastName: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      positionName: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      branchCode: new FormControl('',[Validators.required, RequireMatch]),
      //branch: new FormControl('',[Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  getBranches() {
    this.vwMaster.divisionMaster()
    .subscribe({
      next: (res) => {
        this.branches = res;

        /* Ken - Add MacAire to Branches - 6/22/2024 */
        //const macAire = { divisionName: 'MacAire', branchCode: 'MCR' };
        //this.branches.push(macAire);

       Object.keys(this.branches).forEach((key: string)=> {
        const divName = this.branches[key]['divisionName'];
        
         //this.branches[key]['divisionName'] = divName.replace(/TARLAC MAC ENTERPRISES, INC.|TARLAC MAC ENTERPRISES - |1st MEGASAVER - |1st MEGASAVER /gi, "");
        // Ken - 6/25/2024
        this.branches[key]['divisionName'] = divName.replace(/TARLAC MAC ENTERPRISES, INC.|TARLAC MAC ENTERPRISES - |1st MEGASAVER - |1st MEGASAVER |Cooling Industries Corp./gi, "");
        this.registerForm.controls['branchCode'].setValue("",{emitEvent: true});

        this.filteredOptions =  this.registerForm.controls['branchCode'].valueChanges.pipe(
          startWith(''),
          map(value => {
    
            const name = typeof value === 'string' ? value : value?.divisionName;
            return name ? this._filter(name as string) : this.branches.slice();
          }),
        );

       });
      },
      error: (err) => {
        this.notif.error(err.message);
      }
    });
  }
 
  onKey(event) {  
    // this.branches = this.search(event.value);
  }

  // search(value: string) { 
  //   let filter = value.toLowerCase();
  //   return this.branches.filter(option => option.toLowerCase().startsWith(filter));
  // }

  displayFn(branch: DivisionMaster): string | undefined {
    return branch && branch.divisionName ? branch.divisionName : undefined;
  }

  private _filter(search: string): DivisionMaster[] {
    const filterValue = search.toLowerCase();
    let s = this.branches.filter(option => option.divisionName.toLowerCase().includes(filterValue) || option.divisionCode.toLowerCase().includes(filterValue));
    return s;
  }

  public hasErrorRegister = (controlName: string, errorName: string) => {
    return this.registerForm.controls[controlName].hasError(errorName);
  }

  onSubmitRegister(event: Event){
    event.preventDefault();
    event.stopPropagation();
    const credentials = this.registerForm.value;
    //console.log(credentials);
    if (this.registerForm.invalid) {
      this.notif.error("Input required fields");
    }
    // } else if (credentials['branch'] == undefined) {
    //     this.notif.error('No branch was selected');
    // }
    else {
        this.isSaving = true;
        
        const email = credentials['userName'] + "@1stmegasaver.com.ph";
        credentials['email'] = email;   
        credentials['userType'] = 'REQ' // REQ/ADM 
        credentials['branchCode'] = credentials['branchCode']['divisionCode'];
        const role = 'User'; // default to this form
        credentials['active'] = 0;
  
        credentials['fullName'] = credentials['firstName'] + ' ' + credentials['lastName'];
        
        //console.log(credentials);
 
        this.userService.register(credentials, role)
        .subscribe({
            next: (data) => {
              this.isSaving = false;
                if (data.responseCode == 1) { 
                    this.isSaving = false;
                    this.notif.success(data.responseMessage);
                    this.router.navigate(['/auth/login']);
                }
                else {
                  let dm;
                  if (data.dataSet) {
                    data.dataSet.forEach((el,index) => {
                      if (el.search(/Email/) >= 0) {
                        delete(data.dataSet[index]);
                      }
                    });
                    dm = data.dataSet.length > 0 ? data.dataSet.join("; ") : data.dataSet.join("") ;
                  }
                    

                    this.error = data.responseMessage != "" ? data.responseMessage : dm;
                    this.isSaving = false;
                    this.notif.error(this.error);
                }
            }, 
            error: (error) => {
                this.error= error.responseMessage + (error.dataSet != null? error.dataSet.join("; ") : '');
                this.isSaving = false;
                this.notif.error(this.error);
            }
        });

      }
     
  }

  clearSearchBranch() {
    const input = this.sbInput.nativeElement.value;
    if (input != "") {
      this.sbInput.nativeElement.value = "";
      this.hiddenCloseBranch = true;
      this.registerForm.controls['branchCode'].setValue("",{emitEvent: true});
    }  
   }

  showPass() {
    const eye = document.querySelector('.togglePassword') as HTMLInputElement | null;
    var x = document.getElementById("password") as HTMLInputElement | null;
    if (x !== null) {
      if (x.type === "password") {
        x.type = "text";
        eye.innerHTML = "visibility_off";
      } else {
        x.type = "password";
        eye.innerHTML = "visibility";
      }
    } 
  }
  
}