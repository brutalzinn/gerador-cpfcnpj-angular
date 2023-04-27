import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ThemeObject {
  oldValue: string;
  newValue: string;
};

@Injectable({
  providedIn: 'root'
})
export class AcessibilidadeService {

 initialSetting: ThemeObject = {
    oldValue: '',
    newValue: 'light'
  };

  themeSelection: BehaviorSubject<ThemeObject> =  new BehaviorSubject<ThemeObject>(this.initialSetting);

  constructor() {
      let storageTheme = this.getTheme()
      this.setTheme(storageTheme)
   }

  setTheme(theme: string) {
    this.themeSelection.next(
      {
        oldValue: this.themeSelection.value.newValue,
        newValue: theme
      });
      localStorage.setItem("theme", theme)
  }

  themeChanges(): Observable<ThemeObject> {
    return this.themeSelection.asObservable();
  }

  getTheme(){
    let theme = localStorage.getItem("theme")
    return theme || 'light';
  }
}
