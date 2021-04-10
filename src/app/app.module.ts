import { HomePage } from './connectFour/home.page';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BoardComponent } from './connectFour/board/board.component';
import { SettingsComponent } from './connectFour/settings/settings.component';
import { SettingsPage } from './connectFour/settings/settings.page';
import { SidemenuComponent } from './connectFour/sidemenu/sidemenu.component';
import { CookieService } from 'ngx-cookie-service';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    SidemenuComponent,
    HomePage,
    BoardComponent,
    SettingsPage,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatGridListModule
  ],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy,
    },
    CookieService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
