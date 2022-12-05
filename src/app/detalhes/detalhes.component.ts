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
  public mainForm: FormGroup;
  @Input('metadata') metadata: any;
  @Input('mascaraAtiva') mascaraAtiva: any;

  constructor(private service: GeradorDeDadosService) {
  this.mainForm = new FormGroup({
      mascara: new FormControl(false)
  })

  }
  ngOnInit(): void {
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
  let documento = this.metadata.documento;
  let classeAlerta: string = `#alert-${documento}-${chave}`
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

  ngAfterViewInit() {
    timer(1500).subscribe(() => {
     // this.pessoas = this.child.items
    })
  }

    get mascara() {
    return this.mainForm.get('mascara')!;
  }
}
