import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeamLeaderRoutingModule } from './team-leader-routing.module';
import { TeamLeaderComponent } from './team-leader/team-leader.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PagesRoutingModule } from '../pages-routing.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { OverlayModule } from 'primeng/overlay';
import { CdkMenuModule } from '@angular/cdk/menu';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';


import { FloatLabelModule } from 'primeng/floatlabel';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { TagModule } from 'primeng/tag';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { MatMenuModule } from '@angular/material/menu';
import { ToastModule } from 'primeng/toast';
import { SplitterModule } from 'primeng/splitter';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CardModule } from 'primeng/card';
import { FileUploadModule } from 'primeng/fileupload';
import { TabViewModule } from 'primeng/tabview';

@NgModule({
  declarations: [
    TeamLeaderComponent
  ],
  imports: [
    CommonModule,
    TeamLeaderRoutingModule,
    FormsModule, 
    RouterModule, 
    PagesRoutingModule,
    MatTabsModule,
    MatDialogModule,
    ReactiveFormsModule,
    OverlayModule,
    CdkMenuModule,
    TableModule,
    FloatLabelModule,//done
    RadioButtonModule,//done
    ButtonModule, // Import ButtonModule here
    InputTextModule,//done
    ProgressSpinnerModule,//done
    TableModule,//done
    TagModule,//done
    MultiSelectModule,//done
    DropdownModule,//done
     MatMenuModule,
     CdkMenuModule,
     ToastModule,//done
     SplitterModule,

     DialogModule,InputTextareaModule,TooltipModule,CardModule,FileUploadModule,TabViewModule 
  ]
})
export class TeamLeaderModule { }
