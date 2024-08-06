import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterDataRoutingModule } from './master-data-routing.module';
import { PlantsComponent } from './plants/plants.component';
import { AreasComponent } from './areas/areas.component';
import { RolesComponent } from './roles/roles.component';
import { MachinesComponent } from './machines/machines.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PagesRoutingModule } from '../pages-routing.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { OverlayModule } from '@angular/cdk/overlay';
import { CdkMenuModule } from '@angular/cdk/menu';
import { TitlesComponent } from './titles/titles.component';
import { DepartementsComponent } from './departements/departements.component';
import { ProjectComponent } from './project/project.component';
import { ImpactComponent } from './impact/impact.component';
import { FilterPipe } from '../../../../filter.pipe';
import { FilterUsersPipe } from '../../../../FilterUsersPipe.pipe';
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
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { TooltipModule } from 'primeng/tooltip';
import { StatusComponent } from './status/status.component';


@NgModule({
  declarations: [
    
    MachinesComponent,
    DepartementsComponent,
    ImpactComponent,
    PlantsComponent,
    TitlesComponent,
    RolesComponent,
    AreasComponent,
    ProjectComponent,

    FilterUsersPipe,
      StatusComponent
  ],
  imports: [
    MasterDataRoutingModule,
    FormsModule,
    CommonModule,
    FormsModule, 
    RouterModule, 
    PagesRoutingModule,
    MatTabsModule,
    MatDialogModule,
    ReactiveFormsModule,
    OverlayModule ,
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
    DialogModule,
    CardModule,
    ScrollPanelModule,
    TooltipModule,
  ]
})
export class MasterDataModule { }
