import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
///Exemplo de gerador de CPF/CNPJ 
///Testando compenetização e árvore de modificação no DOM com Angular
///https://codepen.io/WalterNascimento/pen/xxVRKgm


export interface IDocumento {
  document: string;
  creatAt: Date;
  used: boolean;
}

@Component({
  selector: 'module-documento',
  templateUrl: './documento.component.html',
})

export class CpfComponent implements OnInit {

  numero = new FormControl('');
  tipo = new FormControl('');
  mascara = new FormControl('');


  public items: Array<IDocumento> = [];

  constructor() {
    this.items = []
  }

  public clear() {
    this.items = [];
  }

  public handleClick(event: Event) {
    console.log("Chamado")

    const documento: IDocumento = {
      creatAt: new Date,
      document: "00000000",
      used: true,
    }

    console.log(JSON.stringify(this.items))
    this.items.push(documento);
  }

  public add(cpfModel: IDocumento) {
    this.items.push(cpfModel);
  }

  public setUsed(cpf: string) {
    var cpfModel = this.items.findIndex(x => x.document == cpf);
    if (cpfModel != -1) {
      this.items[cpfModel].used = true;
    }
  }
  public number_random = (number: number) => (Math.round(Math.random() * number));
  public create_array = (total: number, numero: number) => Array.from(Array(total), () => this.number_random(numero));
  public mod = (dividendo: number, divisor: number) => Math.round(dividendo - (Math.floor(dividendo / divisor) * divisor));


  public gera() {
    this.numero.setValue(this.tipo.value == "cpf" ? this.cnpj() : this.cpf());
  }

  public cnpj() {
    let total_array = 8;
    let n = 9;
    let [n1, n2, n3, n4, n5, n6, n7, n8] = this.create_array(total_array, n);
    let n9 = 0;
    let n10 = 0;
    let n11 = 0;
    let n12 = 1;

    let d1 = n12 * 2 + n11 * 3 + n10 * 4 + n9 * 5 + n8 * 6 + n7 * 7 + n6 * 8 + n5 * 9 + n4 * 2 + n3 * 3 + n2 * 4 + n1 * 5;
    d1 = 11 - (this.mod(d1, 11));
    if (d1 >= 10) d1 = 0;

    let d2 = d1 * 2 + n12 * 3 + n11 * 4 + n10 * 5 + n9 * 6 + n8 * 7 + n7 * 8 + n6 * 9 + n5 * 2 + n4 * 3 + n3 * 4 + n2 * 5 + n1 * 6;
    d2 = 11 - (this.mod(d2, 11));
    if (d2 >= 10) d2 = 0;

    if (this.mascara.value)
      return `${n1}${n2}.${n3}${n4}${n5}.${n6}${n7}${n8}/${n9}${n10}${n11}${n12}-${d1}${d2}`;
    else
      return `${n1}${n2}${n3}${n4}${n5}${n6}${n7}${n8}${n9}${n10}${n11}${n12}${d1}${d2}`;
  }

  public cpf() {
    let total_array = 9;
    let n = 9;
    let [n1, n2, n3, n4, n5, n6, n7, n8, n9] = this.create_array(total_array, n);

    let d1 = n9 * 2 + n8 * 3 + n7 * 4 + n6 * 5 + n5 * 6 + n4 * 7 + n3 * 8 + n2 * 9 + n1 * 10;
    d1 = 11 - (this.mod(d1, 11));
    if (d1 >= 10) d1 = 0;

    let d2 = d1 * 2 + n9 * 3 + n8 * 4 + n7 * 5 + n6 * 6 + n5 * 7 + n4 * 8 + n3 * 9 + n2 * 10 + n1 * 11;
    d2 = 11 - (this.mod(d2, 11));
    if (d2 >= 10) d2 = 0;

    if (this.mascara.value) {
      return `${n1}${n2}${n3}.${n4}${n5}${n6}.${n7}${n8}${n9}-${d1}${d2}`;
    }

    return `${n1}${n2}${n3}${n4}${n5}${n6}${n7}${n8}${n9}${d1}${d2}`;
  }

  ngOnInit(): void {
    this.items = []
  }

}
