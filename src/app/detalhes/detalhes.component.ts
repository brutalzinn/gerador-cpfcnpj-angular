import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as $ from 'jquery';
import { timer } from 'rxjs/internal/observable/timer';
import { GeradorDeDadosService } from '../gerador-cpf-cnpj.service';

@Component({
  selector: 'app-detalhes',
  templateUrl: './detalhes.component.html',
  styleUrls: ['./detalhes.component.css']
})
export class DetalhesComponent implements OnInit {
  @Input('metadata') metadata: any;
  public documento: any;

  constructor(private service: GeradorDeDadosService) {

  }

  ngOnInit(): void {
    this.documento = this.metadata.documento.replace(/[^\w\s]/gi, '')
  }

  displayStyle = "none";

  openPopup() {
    this.displayStyle = "block";
  }
  closePopup() {
    this.displayStyle = "none";
  }

  copiarDado(item: any)
  {
    let chave = item.key;
    let valor = item.value;
    navigator.clipboard.writeText(valor).then(function () {
      console.log("Copiada para a área de transferência", valor);
    }, function (err) {
      console.log("Ocorreu um erro ao copiar", valor);
    });
    this.notificarDado(chave)
  }

  notificarDado(chave: string){
  let documento = this.documento
  let classeAlerta: string = `#alert-${documento}-${chave}`
  console.log(classeAlerta)
    $(classeAlerta).fadeIn();
    setTimeout(function () {
      $(classeAlerta).fadeOut(1000);
    }, 1300);
  }

  eventoMascaraToggle(event: any){
  let ativarMascara = event.target.checked
  let aplicarMascara = ['rg', 'documento']
  for(let item in this.metadata){
    let valor = this.metadata[item]
  if(ativarMascara && aplicarMascara.includes(item))
  {
     this.metadata[item] = this.service.aplicarMascara(valor);
  }
  if(ativarMascara == false && aplicarMascara.includes(item)){
  this.metadata[item] = valor.replace(/[^\w\s]/gi, '')
  }
}

  }


}
