import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './componets/login/login.component';
import { SignupComponent } from './componets/signup/signup.component';
import { AuthGuard } from './guards/auth.guard';




import { ResetPasswordComponent } from './componets/reset-password/reset-password.component';
import { DashboardRoutingModule } from './componets/dashboard/dashboard-routing.module';
import { NewPasswordComponent } from './componets/new-password/new-password.component';


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'dashboard',
    loadChildren: () => DashboardRoutingModule,
    canActivate: [AuthGuard],
    data: { role: ['Admin', 'Assistant'] },
  },
  /* {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  }, */

  { path: 'resetPassword', component: ResetPasswordComponent },
  { path: 'NewPassword', component: NewPasswordComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
