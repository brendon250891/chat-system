import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import  { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { ChatDashboardComponent } from './chat/chat-dashboard/chat-dashboard.component';
import { UserGroupsComponent } from './chat/chat-dashboard/side-panel/user-groups/user-groups.component';
import { GroupSearchComponent } from './chat/chat-dashboard/main-panel/group-search/group-search.component';
import { ChatWindowComponent } from './chat/chat-dashboard/main-panel/chat-window/chat-window.component';
import { GroupComponent } from './chat/chat-dashboard/side-panel/group/group.component';
import { ControlsComponent } from './chat/chat-dashboard/users/admin/controls/controls.component';
import { AccountSettingsComponent } from './chat/chat-dashboard/main-panel/account-settings/account-settings.component';
import { OptionsComponent } from './chat/chat-dashboard/side-panel/options/options.component';
import { LoginComponent } from './login/login.component';
import { AuthenticationService } from './services/authentication.service';
import { LogoutComponent } from './logout/logout.component';
import { MessageComponent } from './message/message.component';
import { AddGroupComponent } from './chat/chat-dashboard/main-panel/add-group/add-group.component';
import { AddUserComponent } from './chat/chat-dashboard/main-panel/user-management/add-user/add-user.component';
import { UserManagementComponent } from './chat/chat-dashboard/main-panel/user-management/user-management.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RegisterComponent,
    ChatDashboardComponent,
    UserGroupsComponent,
    GroupSearchComponent,
    ChatWindowComponent,
    GroupComponent,
    ControlsComponent,
    AccountSettingsComponent,
    OptionsComponent,
    LoginComponent,
    LogoutComponent,
    MessageComponent,
    AddGroupComponent,
    AddUserComponent,
    UserManagementComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
  ],
  providers: [AuthenticationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
