import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeamLeaderComponent } from './team-leader/team-leader.component';

const routes: Routes = [
  { path: 'Team_Leader', component: TeamLeaderComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamLeaderRoutingModule { }
