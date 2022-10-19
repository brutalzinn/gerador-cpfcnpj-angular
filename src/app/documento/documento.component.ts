import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { saveAs } from 'file-saver';
///Exemplo de gerador de CPF/CNPJ 
///Testando compenetização e árvore de modificação no DOM com Angular
///https://codepen.io/WalterNascimento/pen/xxVRKgm
///https://medium.com/walternascimentobarroso-pt/gerador-de-cpf-e-cnpj-com-javascript-408b751f3afc

export interface IPessoa {
  document: string;
  creatAt: Date;
  used: boolean;
}

@Component({
  selector: 'module-documento',
  templateUrl: './documento.component.html',
})

export class CpfComponent implements OnInit {

  public items: Array<IPessoa> = [];

  public mainForm: FormGroup;

  constructor() {
    this.mainForm = new FormGroup({
      documento: new FormControl(''),
      tipo: new FormControl(''),
      mascara: new FormControl('')
    })
  }

  public clear() {
    ///pra notificar a mudança
    this.items.length = 0
    ///infelizmente o observer não enxerga essa alteração.
    // this.items = [];
  }

  public handleClick() {
    const documento: IPessoa = {
      creatAt: new Date,
      document: this.gerarDocumento(),
      used: false,
    }
    this.add(documento);
  }

  public add(cpfModel: IPessoa) {
    this.items.push(cpfModel);
  }

  public number_random = (number: number) => (Math.round(Math.random() * number));
  public create_array = (total: number, numero: number) => Array.from(Array(total), () => this.number_random(numero));
  public mod = (dividendo: number, divisor: number) => Math.round(dividendo - (Math.floor(dividendo / divisor) * divisor));

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

  get mascara() {
    return this.mainForm.get('mascara')!;
  }
  get tipo() {
    return this.mainForm.get('tipo')!;
  }
  get documento() {
    return this.mainForm.get('documento')!;
  }

  ngOnInit(): void { }

  public gerarDocumento(): string {
    return this.tipo.value == "cnpj" ? this.cnpj() : this.cpf();
  }

  private obterPessoa(index: number): IPessoa {
    return this.items[index]
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
    this.items[index].used = !obterUsedPessoa;
  }
  public carregarArquivoDocumentos(event: any) {
    const reader = new FileReader();
    try {
      reader.onload = (e: any) => {
        let conteudoArquivoJson = JSON.parse(reader.result!.toString());
        let pessoas = Array.from<IPessoa>(conteudoArquivoJson)
        this.clear();
        pessoas.map(item => {
          this.add(item)
        })
      };
      reader.readAsText(event.target.files[0], 'utf-8');
    }
    catch (exception) {
      console.log("Ocorreu um erro ao ler o arquivo")
    }
  }


  public baixarArquivoDocumento() {
    let data = JSON.stringify(this.items);
    const blob = new Blob([data], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, "lista_documentos.json");
  }

}

