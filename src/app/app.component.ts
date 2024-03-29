import { Component, ViewChild, AfterViewInit, Renderer2 } from '@angular/core';
import { timer } from 'rxjs/internal/observable/timer';
import { MenuDocumentoComponent } from './menu/menu.component';
import $ from 'jquery';
import { IPessoa } from './interfaces/pessoa.interface';
import { AcessibilidadeService } from './services/acessibilidade.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements AfterViewInit {

  @ViewChild(MenuDocumentoComponent) child: any;

  title = 'Gerador CPFCNPJ';

  constructor (private acessibilidadeService: AcessibilidadeService, private renderer: Renderer2) {}

  public pessoas: Array<IPessoa> = [];


  ngAfterViewInit() {
    timer(1500).subscribe(() => {
      this.pessoas = this.child.items
    })
  }

    ngOnInit(): void {
    this.acessibilidadeService.themeChanges().subscribe(theme => {
      if (theme.oldValue) {
        this.renderer.setAttribute(document.body, "data-bs-theme", theme.oldValue);
      }
      this.renderer.setAttribute(document.body, "data-bs-theme", theme.newValue);
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
  public exibirDetalhes(index: number) {
    this.child.exibirDetalhes(index);
  }

  public excluirDocumento(index: number) {
    this.child.deletar(index);
  }

}
