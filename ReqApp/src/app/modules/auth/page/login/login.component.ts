import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { first, Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/core/service/authentication.service';
import { NotificationService } from 'src/app/shared/service/notification.service';
import { UserService } from 'src/app/shared/service/user.service';
import { environment } from 'src/environments/environment';
 
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../auth-form.component.scss']
})
export class LoginComponent implements OnDestroy {
  public loginForm!: FormGroup;

  private sub = new Subscription();
  isSaving: any;
  error: string;
  err: any;
  
  constructor(
    private userService: UserService,
    private router: Router, 
    private http: HttpClient, 
    private formBuilder: FormBuilder,
    private notif: NotificationService,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService
  ) { 
     // redirect to home if already logged in
    if (this.authenticationService.userValue) { 
        // this.router.navigate(['/']);
    }

    this.buildForm();

  }

  onLoginSubmit() {
    
    if (this.loginForm.valid) {
      this.isSaving = true;

      const credentials =  this.loginForm.value;
    
     this.sub = this.authenticationService
     .login(credentials)
     .pipe(first())
     .subscribe({
         next: (data) => {
          if (data.responseCode == 1) { 
            this.isSaving = false;
            //console.log('logged in');
            // get return url from query parameters or default to home page
            let returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
            //console.log(returnUrl);        
            this.router.navigateByUrl(returnUrl);
        }
        else { 
            
            this.error = data.responseMessage != "" ? data.responseMessage : (data.dataSet.join("; "));
            this.isSaving = false;
            this.notif.error(this.error);
        }             
         },
         error: error => {
           this.isSaving = false;
           this.err = error;
           this.error= error.responseMessage + (error.dataSet != null? error.dataSet.join("; ") : '');
          }
     });
     }
   }
   
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  public hasErrorLogin = (controlName: string, errorName: string) => {
     return this.loginForm.controls[controlName].hasError(errorName);
  }

  private buildForm(): void {
    let u; let p;
    if(!environment.production) {
      u="admin"; p="88888888"
    }
    
    this.loginForm = new FormGroup({
      userName: new FormControl(u, Validators.required),
      password: new FormControl(p, Validators.required)
    });
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
