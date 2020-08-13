import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { ChatDashboardComponent } from './chat/chat-dashboard/chat-dashboard.component';
import { LoginComponent } from './login/login.component';

import { AuthGuard } from './guards/auth.guard';
import { LogoutComponent } from './logout/logout.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: ChatDashboardComponent, canActivate: [AuthGuard]},
  { path: 'logout', component: LogoutComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
