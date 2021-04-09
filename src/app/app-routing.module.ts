import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePage } from './connectFour/home.page';
import { SettingsPage } from './connectFour/settings/settings.page';

const routes: Routes = [
  {path: '' , component: HomePage},
  {path: 'home', component: HomePage},
  {path: 'settings', component: SettingsPage}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
