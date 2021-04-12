import { Component, Output, Input, EventEmitter } from '@angular/core';
import { SettingsModel } from './settings.model';
import { CookieService } from 'ngx-cookie-service';
import { properties } from '../properties/properties';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.component.html',
  styleUrls: ['settings.component.scss']
})
export class SettingsComponent {
  @Input() settingsModel: SettingsModel;
  @Output() settingsModelChanged = new EventEmitter<SettingsModel>();

  constructor(private cookieService: CookieService){
    this.loadSettings();
  }

  loadSettings(){
    const cookie = this.cookieService.get(properties.cookie.names.settings);
    if (cookie.length === 0){
      this.settingsModel = new SettingsModel();
    }else{
      try{
        const savedSettingsModel: SettingsModel = JSON.parse(cookie);
        this.settingsModel = savedSettingsModel;
      } catch (e) {
        // ignore
      }
    }
    if (this.settingsModel === undefined){
      this.settingsModel = new SettingsModel();
    }
  }

  onChange(){
    this.cookieService.set(properties.cookie.names.settings, JSON.stringify(this.settingsModel));
  }

  onChangeRow(value){
    this.settingsModel.numRow = this.settingsModel.numRow > 20 ? 20 : this.settingsModel.numRow;
    this.settingsModel.numRow = this.settingsModel.numRow < 4 ? 4 : this.settingsModel.numRow;
    this.onChange();
    this.settingsModelChanged.emit(this.settingsModel);
  }

  onChangeColumn(value){
    this.settingsModel.numColumn = this.settingsModel.numColumn > 20 ? 20 : this.settingsModel.numColumn;
    this.settingsModel.numColumn = this.settingsModel.numColumn < 4 ? 4 : this.settingsModel.numColumn;
    this.onChange();
    this.settingsModelChanged.emit(this.settingsModel);
  }

  onFocusOut(){
    window.location.reload();
  }
}
