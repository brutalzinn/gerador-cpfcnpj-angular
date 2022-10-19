import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { timer } from 'rxjs/internal/observable/timer';
import { CpfComponent } from './documento/documento.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements AfterViewInit {

  @ViewChild(CpfComponent) child: any;

  title = 'Gerador CPFCNPJ';

  constructor() { }
  public pessoas: any;


  ngAfterViewInit() {
    timer(1000).subscribe(() => {
      this.pessoas = this.child.items
    })
  }

}
