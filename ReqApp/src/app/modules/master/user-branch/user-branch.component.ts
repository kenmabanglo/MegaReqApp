import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { AuthenticationService } from "src/app/core/service";
import { AllBranchesComponent } from "src/app/shared/component/modals/all-branches/all-branches.component";
import { UserSearchComponent } from "src/app/shared/component/modals/user-search/user-search.component";
import { User } from "src/app/shared/interface";
import { NotificationService, UserService } from "src/app/shared/service";
// Ken - 6/21/2024
import { ConfirmDialogPopupComponent } from "src/app/shared/component/dialogs/confirm-dialog-popup.component";
import { HttpHeaders } from "@angular/common/http";

@Component({
  selector: "app-user-approver",
  templateUrl: "./user-branch.component.html",
  styleUrls: ["./user-branch.component.scss"],
})
export class UserBranchComponent implements OnInit {
  isSaving = false;
  isLoading = false;

  form = new FormGroup({
    userName: new FormControl(""),
    branchCode: new FormControl(""),
  });

  user: User;
  currentBranch: any;

  constructor(
    private fb: FormBuilder,
    private notif: NotificationService,
    private dialog: MatDialog,
    private userServ: UserService,
    private auth: AuthenticationService
  ) {
    this.auth.user.subscribe((x) => (this.user = x));
  }

  ngOnInit(): void { }
  openSearch(action, event: Event) {
    event.preventDefault();

    //////console.log(data);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "100%";
    dialogConfig.panelClass = ["modal-table-pane"];

    const data = {
      userName: this.form.get("userName").value,
    };

    dialogConfig.data = data;

    if (action == "userName") {
      const dialogRef = this.dialog.open(UserSearchComponent, dialogConfig);

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          console.log(result);
          this.form.patchValue({ userName: result.data.userName.trim() });
          // this.fetchCurrentApprover();
          this.fetchCurrentBranch();
        }
      });
    } else if (action == "branchCode") {
      const dialogRef = this.dialog.open(AllBranchesComponent, dialogConfig);

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          console.log("Branches: ", result);
          this.form.patchValue({
            branchCode: result.data.divisionCode.trim(),
          });
        }
      });
    }
  }

  // Ken - Check Branch Assigned to the User (DMs, SMs, EX, etc.) - 6/25/2024
  currentBranches: any[] = [];
  fetchCurrentBranch(): void {
    const userName = this.form.get("userName").value;
    if (userName) {
      this.isLoading = true;
      this.userServ.getCurrentUserBranches(userName).subscribe(
        (response: any) => {
          /*console.log("API Response: ", response);*/
          if (response) {
            this.currentBranches = Array.isArray(response)
              ? response
              : [response];
            this.currentBranches = this.currentBranches.map((branch) => {
              branch.divisionName = branch.divisionName
                .replace(
                  /TARLAC MAC ENTERPRISES, INC\. ?|TARLAC MAC ENTERPRISES - |1st MEGASAVER - |1st MEGASAVER |Cooling Industries Corp./gi,
                  ""
                )
                .trim();
              branch.divisionName = branch.divisionName
                .replace(/\((.*?)\)/g, "$1")
                .trim();
              return branch;
            });
            /*console.log("Current Branches: ", this.currentBranches);*/
          } else {
            this.currentBranches = [];
          }
          this.isLoading = false;
        },
        (error: any) => {
          console.error("Error: ", error);
          this.isLoading = false;
        }
      );
    }
  }

  groupedBranches(array: any[], groupSize: number): any[][] {
    const groups = [];
    for (let i = 0; i < array.length; i += groupSize) {
      groups.push(array.slice(i, i + groupSize));
    }
    return groups;
  }

  deleteBranch(userName: string, branchCode: string, divisionName: string) {
    if (!userName) return;

    const dialogRef = this.dialog.open(ConfirmDialogPopupComponent, {
      width: "700px",
      disableClose: true,
      data: {
        header: "Delete Assigned Branch",
        message: `Are you sure you want to delete ${divisionName} branch from this user?`
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isSaving = true;
        this.userServ.deleteUserBranch(userName, branchCode, divisionName).subscribe(
          (response: any) => {
            this.fetchCurrentBranch();
            this.isSaving = false;
            if (response.responseCode == 1) {
              this.notif.success(response.responseMessage);
            }
          },
          (error) => {
            console.error("Error: ", error);
            this.isSaving = false;
          }
        )
      }
    });
  }

  cancel() {
    this.form.patchValue({
      userName: "",
      branchCode: "",
    });
    this.currentBranches = [];
    this.isSaving = false;
  }

  saveBranch() {
    this.isSaving = true;

    var data = this.form.getRawValue();

    if (data.userName == "" && data.branchCode == "") {
      this.notif.error("Please select user and/or branch.");
      this.isSaving = false;
    } else if (this.form.invalid) {
      this.notif.error("Please select a branch.");
      this.isSaving = false;
    } else {
      this.userServ.addUserBranch(data).subscribe({
        next: (data) => {
          if (data.responseCode == 1) {
            this.notif.success(data.responseMessage);
            this.fetchCurrentBranch();
            this.isSaving = true;
          } else {
            let err =
              data.responseMessage != ""
                ? data.responseMessage
                : data.dataSet.join("; ");
            this.notif.error(err);
            this.isSaving = false;
          }
        },
        error: (error) => {
          let err = error.error.title || "";
          this.notif.error(err);
          this.isSaving = false;
        },
      })
    }
  }
}
