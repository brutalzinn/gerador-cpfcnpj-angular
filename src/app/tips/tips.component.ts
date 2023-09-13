import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tips',
  templateUrl: './tips.component.html',
  styleUrls: ['./tips.component.scss']
})
export class TipsComponent implements OnInit {
  public showTips : boolean = false;
  public chavePix : string = ""
  constructor() { }
  ngOnInit(): void {
      this.chavePix = environment.envVar.chavePix
      setTimeout(() => {
      this.showTips = true
    }, environment.envVar.tipsTime);
  }
  hide(){
      this.showTips = false
  }
}