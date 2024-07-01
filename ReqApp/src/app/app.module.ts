import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { ContentLayoutComponent } from './layout/content-layout/content-layout.component';
import { HeaderComponent } from './layout/header/header.component';
import { SidenavComponent } from './layout/sidenav/sidenav.component';
import { FooterComponent } from './layout/footer/footer.component';

import { AuthModule } from './modules/auth/auth.module';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidenavService } from './layout/sidenav/sidenav.service';
import { RequestModule } from './modules/request/request.module';
import { AboutComponent } from './modules/about/about.component';
import { ContactComponent } from './modules/contact/contact.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

 
@NgModule({
  declarations: [
    AppComponent,
    ContentLayoutComponent,
    HeaderComponent,
    SidenavComponent,
    FooterComponent,
    AuthLayoutComponent,
    AboutComponent,
    ContactComponent 
  ], 
  imports: [
    BrowserModule, 
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    AuthModule,
    CoreModule,
    RequestModule,
  //   ServiceWorkerModule.register('ngsw-worker.js', {
  //     enabled: environment.production,
  //     // Register the ServiceWorker as soon as the application is stable
  //     // or after 30 seconds (whichever comes first).
  //     registrationStrategy: 'registerWhenStable:30000'
  //   }) , 
  ],
  providers: [SidenavService],
  bootstrap: [AppComponent]
})
export class AppModule { }
