import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CpfComponent } from './documento/documento.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements AfterViewInit {

  @ViewChild(CpfComponent) child: any;

  constructor() { }

  public handleClick: any;

  ngAfterViewInit(): void {
    this.handleClick = this.child.handleClick
  }


  title = 'Gerador CPFCNPJ';
}
