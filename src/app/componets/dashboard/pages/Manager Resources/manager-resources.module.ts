import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagerResourcesRoutingModule } from './manager-resources-routing.module';
import { UsersComponent } from './users/users.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PagesRoutingModule } from '../pages-routing.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { CdkMenuModule } from '@angular/cdk/menu';
import { OverlayModule } from '@angular/cdk/overlay';
import { FilterPipe } from '../../../../filter.pipe';
import { CommitteesComponent } from './committees/committees.component';
import { TeamLeaderComponent } from './team-leader/team-leader.component';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
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
import { SupervisorComponent } from './supervisor/supervisor.component';

@NgModule({
  declarations: [
    UsersComponent,
    FilterPipe,
    CommitteesComponent,
    TeamLeaderComponent,
    SupervisorComponent,
  ],
  imports: [
    CommonModule,
    ManagerResourcesRoutingModule, FormsModule,
    RouterModule, 
    PagesRoutingModule,
    MatTabsModule,MatDialogModule,ReactiveFormsModule ,  OverlayModule ,
    CdkMenuModule,
    ButtonModule, // Import ButtonModule here
    TableModule,
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
    MenuModule,
    SplitterModule



  ]
})
export class ManagerResourcesModule { }
