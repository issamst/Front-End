import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolesComponent } from './roles/roles.component';
import { AreasComponent } from './areas/areas.component';
import { MachinesComponent } from './machines/machines.component';
import { PlantsComponent } from './plants/plants.component';
import { TitlesComponent } from './titles/titles.component';

import { DepartementsComponent } from './departements/departements.component';
import { ProjectComponent } from './project/project.component';
import { ImpactComponent } from './impact/impact.component';
import { StatusComponent } from './status/status.component';

const routes: Routes = [
  {path:'plants',component:PlantsComponent},
  {path:'areas',component:AreasComponent},
  {path:'roles',component:RolesComponent},
  {path:'titles',component:TitlesComponent},
  {path:'machines',component:MachinesComponent},
  {path:'departement',component:DepartementsComponent},
  {path:'project',component:ProjectComponent},
  {path:'status',component:StatusComponent},
  {path:'impact',component:ImpactComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterDataRoutingModule { }
