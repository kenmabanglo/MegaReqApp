import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule} from '@angular/material/table';
import { MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatChipsModule} from '@angular/material/chips';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatMenuModule} from '@angular/material/menu';
import {MatBadgeModule} from '@angular/material/badge';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import {MatStepperModule} from '@angular/material/stepper';
import {MatAutocompleteModule} from '@angular/material/autocomplete';


const material = [
  MatNativeDateModule,
  MatChipsModule,
  MatDatepickerModule,
  MatTooltipModule,
  MatIconModule,
  MatButtonModule,
  MatCheckboxModule,
  MatTabsModule,
  MatToolbarModule, 
  FormsModule,
  MatCardModule,
  MatFormFieldModule,
  MatListModule,
  MatSidenavModule,
  MatInputModule,
  MatRadioModule,
  MatTableModule,
  MatSlideToggleModule,
  MatSelectModule,
  MatPaginatorModule,
  MatExpansionModule,
  MatProgressSpinnerModule,
  MatDialogModule,
  MatSnackBarModule,
  MatRippleModule,
  MatButtonToggleModule,
  MatGridListModule,
  MatMenuModule,
  MatBadgeModule,
  MatProgressBarModule,
  MatSortModule,
  MatStepperModule,
  MatAutocompleteModule
]

@NgModule({
  imports: [material],
  exports: [material]
})

export class MaterialModule { }
