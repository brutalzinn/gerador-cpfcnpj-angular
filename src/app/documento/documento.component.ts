import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { saveAs } from 'file-saver';
import { GeradorCpfCnpjService } from '../gerador-cpf-cnpj.service';
///Exemplo de gerador de CPF/CNPJ 
///Testando compenetização e árvore de modificação no DOM com Angular
///https://codepen.io/WalterNascimento/pen/xxVRKgm
///https://medium.com/walternascimentobarroso-pt/gerador-de-cpf-e-cnpj-com-javascript-408b751f3afc

export interface IPessoa {
  document: string;
  type: string;
  creatAt: Date;
  updatedAt: Date;
  used: boolean;
}

@Component({
  selector: 'module-documento',
  templateUrl: './documento.component.html',
})

export class CpfComponent implements OnInit {

  public items: Array<IPessoa> = [];
  public geradorCpfCnpjService: GeradorCpfCnpjService;
  public mainForm: FormGroup;

  constructor(private service: GeradorCpfCnpjService) {
    this.mainForm = new FormGroup({
      quantidade: new FormControl(1, [Validators.required, Validators.min(1), Validators.pattern("^[0-9]*$")]),
      tipo: new FormControl('cpf'),
      mascara: new FormControl(false)
    })
    this.geradorCpfCnpjService = service;
  }

  public clear() {
    this.items.length = 0
    ///infelizmente o observer não enxerga essa alteração.
    // this.items = [];
  }

  public handleClick() {
    for (var i = 0; i < this.quantidade.value; i++) {
      const documento: IPessoa = {
        creatAt: new Date(),
        updatedAt: new Date(),
        type: this.tipo.value.toUpperCase(),
        document: this.gerarDocumento(),
        used: false,
      }
      this.add(documento);
    }
  }

  public add(cpfModel: IPessoa) {
    this.items.push(cpfModel);
  }

  public deletar(index: number) {
    this.items.splice(index, 1)
  }

  get mascara() {
    return this.mainForm.get('mascara')!;
  }
  get tipo() {
    return this.mainForm.get('tipo')!;
  }
  get quantidade() {
    return this.mainForm.get('quantidade')!;
  }

  get controls() {
    return this.mainForm.controls;
  }

  ngOnInit(): void { }

  public gerarDocumento(): string {
    let tipoDocumento: boolean = this.mascara.value;
    return this.tipo.value == "cnpj" ? this.geradorCpfCnpjService.cnpj(tipoDocumento) : this.geradorCpfCnpjService.cpf(tipoDocumento);
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

  public marcarUsado(index: number, used: boolean) {
    this.items[index].used = used;
  }

  public alternarUsado(index: number) {
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

