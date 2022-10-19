import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { timer } from 'rxjs/internal/observable/timer';
import { CpfComponent, IPessoa } from './documento/documento.component';

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

  ///MOVER PARA OUTRO COMPONENTE DEPOIS. O PAI NEM DEVERIA TER OPÇÕES DE AÇÕES AQUI
  ///estou modificando uma pseudo list que pode ter sido modificado antes :V

  public obterPessoa(index: number): IPessoa {
    return this.pessoas[index]
  }

  public copiarDocumento(index: number) {
    var documento = this.obterPessoa(index).document;
    navigator.clipboard.writeText(documento).then(function () {
      console.log("Copiada para a área de transferência", documento);
    }, function (err) {
      console.log("Ocorreu um erro ao copiar", documento);
    });
  }

  public marcarUsado(index: number) {
    var obterUsedPessoa = this.obterPessoa(index).used;
    this.pessoas[index].used = !obterUsedPessoa
  }

}
