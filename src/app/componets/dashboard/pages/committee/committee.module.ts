import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommitteeRoutingModule } from './committee-routing.module';
import { CommitteeComponent } from './committee/committee.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PagesRoutingModule } from '../pages-routing.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { OverlayModule } from 'primeng/overlay';
import { TableModule } from 'primeng/table';
import { CdkMenuModule } from '@angular/cdk/menu';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SidebarModule } from 'primeng/sidebar';
import { RatingModule } from 'primeng/rating';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DialogModule } from 'primeng/dialog';
import { MenuModule } from 'primeng/menu'; // Add this import
import { CardModule } from 'primeng/card';
import { SplitterModule } from 'primeng/splitter';
import { TabViewModule } from 'primeng/tabview';
import { CalendarModule } from 'primeng/calendar';
@NgModule({
  declarations: [
    CommitteeComponent
  ],
  imports: [
    CommonModule,
    CommitteeRoutingModule,
    FormsModule, 
    RouterModule, 
    PagesRoutingModule,
    MatTabsModule,
    MatDialogModule,
    ReactiveFormsModule,
    OverlayModule,
    CdkMenuModule,
    TableModule,
    ButtonModule, // Import ButtonModule here
    MultiSelectModule,
    DropdownModule, 
    RadioButtonModule,
    InputTextModule,
    ProgressSpinnerModule,
    TagModule,
    ToastModule,
    FloatLabelModule,
    SidebarModule,
    RatingModule,
    InputTextareaModule,
    DialogModule,
    CardModule,
    MenuModule,SplitterModule,TabViewModule,CalendarModule
  ]
})
export class CommitteeModule { }
