import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './material.module'; 
import { HttpClientModule } from '@angular/common/http';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

import { PdfViewerModule } from 'ng2-pdf-viewer';
import { LightboxModule } from 'ngx-lightbox';

import { 
  ReferenceAdbComponent, ConfirmDialogPopupComponent, ApproversComponent, ItemsComponent, SuppliersComponent,ApproveRequestComponent,DataPropertyGetterPipe,TableComponent,SerialnoComponent,RequestListTableComponent,UploadFilesComponent,AttachmentsViewerComponent,LoadingComponent,AttachmentsPreviewComponent,LogoAnimatedComponent,StatusStepsComponent
} from './component/';

import { AdbFormComponent, FlFormComponent, RfbComponent, RfpFormComponent, RsFormComponent, RTOFormComponent 
} from './component/forms-viewer-modal';
import { RfsComponent } from './component/forms-viewer-modal/rfs/rfs.component';
import { AssignBranchModalComponent } from './component/table/assign-branch-modal/assign-branch-modal.component';
import { NumberCommaDirective } from './directives/number-comma.directive';
import { RfaComponent } from './component/forms-viewer-modal/rfa/rfa.component';
import { ChangePasswordModalComponent } from './component/table/change-password-modal/change-password-modal.component';
import { RequestViewerComponent } from './component/request-viewer/request-viewer.component';
import { ActivateUserModalComponent } from './component/table/activate-user-modal/activate-user-modal.component';
import { UserSearchComponent } from './component/modals/user-search/user-search.component';
import { AllApproversComponent } from './component/modals/all-approvers/all-approvers.component';
import { AllBranchesComponent } from './component/modals/all-branches/all-branches.component';
import { ReferenceRfpComponent } from './component/modals/reference-rfp/reference-rfp.component';
 
export const modules = [
  CommonModule,
  MaterialModule,
  HttpClientModule,
  RouterModule,
  LayoutModule,
  FormsModule,
  ReactiveFormsModule,
  FlexLayoutModule,
  PdfViewerModule,
  LightboxModule
];
export const shared_components = [
  ConfirmDialogPopupComponent,
  SuppliersComponent,
  ApproversComponent, 
  // ModalWrapperComponent,
  ApproveRequestComponent,
  ItemsComponent,
  SerialnoComponent,
  RequestListTableComponent,
  DataPropertyGetterPipe, 
  TableComponent,
  UploadFilesComponent,
  LoadingComponent,
  AttachmentsViewerComponent,
  AttachmentsPreviewComponent,
  LogoAnimatedComponent,
  StatusStepsComponent,
  RsFormComponent,
  RTOFormComponent,
  RfbComponent,
  RfsComponent,
  UserSearchComponent,
  AllApproversComponent,
  AllBranchesComponent
];
@NgModule({
  imports: [
    modules
  ],
  declarations: [
   shared_components,
   ReferenceAdbComponent,
   ReferenceRfpComponent,
   AdbFormComponent,
   RfpFormComponent,
   RfbComponent,
   RfsComponent,RfaComponent,FlFormComponent,
   AssignBranchModalComponent,  NumberCommaDirective, ChangePasswordModalComponent, RequestViewerComponent, ActivateUserModalComponent
  ],
  exports: [
    modules, shared_components,NumberCommaDirective
  ],
  schemas: [
    NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA 
  ], 
  providers: [
    { 
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, 
      useValue: { floatLabel: 'always',appearance: 'outline' } 
    }
  ]
})
export class SharedModule {}
