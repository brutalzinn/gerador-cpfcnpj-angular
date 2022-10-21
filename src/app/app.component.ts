import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { timer } from 'rxjs/internal/observable/timer';
import { CpfComponent, IPessoa } from './documento/documento.component';
import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements AfterViewInit {

  @ViewChild(CpfComponent) child: any;

  title = 'Gerador CPFCNPJ';

  constructor() {

  }
  public pessoas: Array<IPessoa> = [];


  ngAfterViewInit() {
    timer(1500).subscribe(() => {
      this.pessoas = this.child.items
    })
  }

  public copiarDocumento(index: number) {
    this.child.copiarDocumento(index);
    this.child.marcarUsado(index, true);
    this.avisarAreaTransferencia(index);
  }
  //usando jquery pra me readaptar
  public avisarAreaTransferencia(index: number) {
    let classeAlerta: string = '#alert-' + index
    $(classeAlerta).fadeIn();
    setTimeout(function () {
      $(classeAlerta).fadeOut(1000);
    }, 1300);
  }

  public alternarUsado(index: number) {
    this.child.alternarUsado(index, true);
  }

  public excluirDocumentos() {
    this.child.clear();
  }


  public excluirDocumento(index: number) {
    this.child.deletar(index);
  }
}
