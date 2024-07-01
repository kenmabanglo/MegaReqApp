import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NotificationService, ViewMasterService } from 'src/app/shared/service';
import { TalentMasterService } from 'src/app/shared/service/talent-master.service';

@Component({
  selector: 'app-talent-requisition',
  templateUrl: './talent-requisition.component.html',
  styleUrls: ['./talent-requisition.component.scss'],
})
export class TalentRequisitionComponent implements OnInit {
  requestForm: FormGroup;
  requestDate:Date = new Date();
  depreq=''; dept=''; reason = ''; stat = ''; selected_allowances = ''; selected_benefits = '';
  departments = []; reasons = []; emp_status = [];
  allowances_list = []; benefits_list = []; 
  isSaving = false; 
  allowanceOthers = false;
  benefitsOthers = false;
  budgeted = ['yes','no'];
  
  get request() : FormGroup {
    return this.requestForm.get("request") as FormGroup
  }
 
  constructor(
    private notif: NotificationService,
    private fb: FormBuilder,
    private vwMaster: ViewMasterService,
    private talent: TalentMasterService
  ) { 
    this.requestForm  = this.buildForm();
  }

  ngOnInit(): void {
    this.getDepartments();
  }

  buildForm() {
    return this.fb.group({
      request: this.fb.group({
        requestNo: null,
        requestDate:  new Date(),
        departmentRequesting: null,
        department: null,
        fileDate: null,
        position: null,
        noOfTalent: null,
        requestReason: null,
        resignationOf: null,
        transferOf: null,
        transferFrom: null,
        transferTo: null,
        terminationOf: null,
        terminationEffectiveDate: null,
        employmentStatus: null,
        empProbationaryMonths: null,
        empProjectName: null,
        empProjectDuration: null,
        employmentOthers: null,
        descriptionOfDuties: null,
        basicSalary: null,
        allowances: null,
        allowanceOthers: null,
        benefits: null,
        benefitsOthers: null,
        isPositionBudgeted: null,
        noOfEmployees: null,
        hirees: null,
        preparedBy: null,
        approver1: null,
        approved1: null,
        approvedDate1: null,
        approver2: null,
        approved2: null,
        approvedDate2: null,
        approver3: null,
        approved3: null,
        approvedDate3: null,
        startDate: null,
        positionOffered: null
      })
    });
  }

  public hasError= (controlName: string, errorName: string) => {
    return this.request.controls[controlName].hasError(errorName);
  }

  getDepartments() {
    this.vwMaster.getDepartments()
    .subscribe({
      next: (res) => {
        
        this.departments = res;

        this.getReason();
    
      },
      error: (err) => {
        this.notif.error(err.message);
      }
    });
  }

  getReason() {
    this.talent.getReason()
    .subscribe({
      next: (res) => {
        this.reasons = res;

        this. getEmpStatus();
      },
      error: (err) => {
        this.notif.error(err.message);
      }
    });
  }

  getEmpStatus() {
    this.talent.getEmpStatus()
    .subscribe({
      next: (res) => {
        this.emp_status = res;

        this. getAllowances();
      },
      error: (err) => {
        this.notif.error(err.message);
      }
    });
  }

  getAllowances() {
    this.talent.getAllowances()
    .subscribe({
      next: (res) => {
        this.allowances_list = res;

        this.getBenefits();
      },
      error: (err) => {
        this.notif.error(err.message);
      }
    });
  }

  getBenefits() {
    this.talent.getBenefits()
    .subscribe({
      next: (res) => {
        this.benefits_list = res;
      },
      error: (err) => {
        this.notif.error(err.message);
      }
    });
  }

  allowanceChange(values) {
    var others = values.filter(x=>x == 4);
    this.allowanceOthers = others.length == 1? true: false;
  }

  benefitsChange(values) {
    var others = values.filter(x=>x == 4);
    this.benefitsOthers = others.length == 1? true: false;
  }

}
