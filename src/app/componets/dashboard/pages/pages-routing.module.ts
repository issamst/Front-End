import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';






import { MasterDataModule } from './Master Data/master-data.module';


import { ManagerResourcesModule } from './Manager Resources/manager-resources.module';
import { ProposeIdeaComponent } from './Propose Idea/propose-idea/propose-idea.component';
import { CommitteeModule } from './committee/committee.module';
import { TeamLeaderModule } from './team-leader/team-leader.module';

const routes: Routes = [
  { path: '', component: ProposeIdeaComponent },
  {
    path: 'masterdata',
    loadChildren: () => MasterDataModule,
  },
  { path: 'proposeidea', component: ProposeIdeaComponent },
  
  {
    path: 'managerresources',
    loadChildren: () => ManagerResourcesModule,
  },
  
  {
    path: 'Approval_committee',
    loadChildren: () => CommitteeModule,
  }
  ,
  {
    path: 'Approval_teamleader',
    loadChildren: () => TeamLeaderModule,
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
