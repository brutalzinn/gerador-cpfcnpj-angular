import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IPessoa } from './../interfaces';
import { saveAs } from 'file-saver';
import { GeradorDeDadosService } from '../gerador-cpf-cnpj.service';

@Component({
  selector: 'module-documento',
  templateUrl: './documento.component.html',
})

export class CpfComponent implements OnInit {

  public items: Array<IPessoa> = [];
  public geradorCpfCnpjService: GeradorDeDadosService;
  public mainForm: FormGroup;

  constructor(private service: GeradorDeDadosService) {
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

  private criarMetadata(pessoa : IPessoa) : object{
      let documento = pessoa.documento.replace(/[^\w\s]/gi, '')
      if(pessoa.tipoPF){
        return {
        documento: documento,
        rg: this.geradorCpfCnpjService.rg(false),
        DataNascimento: this.geradorCpfCnpjService.DataNascimento().toLocaleDateString(),
      }
      }
      return {
        documento: documento,
        cnae: this.geradorCpfCnpjService.cnae(false),
        naturezaJuridica: this.geradorCpfCnpjService.naturezaJuridica(false),
        razaoSocial: this.geradorCpfCnpjService.razaoSocial()
      }
  }

  public criarPessoas() {
    for (var i = 0; i < this.quantidade.value; i++) {
      const documento: IPessoa = {
        criadoEm: new Date(),
        atualizadoEm: new Date(),
        tipoPF: this.tipo.value === "cpf",
        documento: this.gerarDocumento(),
        usado: false,
      }
      documento.metadata = this.criarMetadata(documento);
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
    let mascara: boolean = this.mascara.value;
    return this.tipoPessoaFisica() ? this.geradorCpfCnpjService.cpf(mascara) : this.geradorCpfCnpjService.cnpj(mascara);
  }

  private tipoPessoaFisica() : boolean {
  return this.tipo.value == "cpf"
  }

  private obterPessoa(index: number): IPessoa {
    return this.items[index]
  }

  public copiarDocumento(index: number) {
    var documento = this.obterPessoa(index).documento;
    navigator.clipboard.writeText(documento).then(function () {
      console.log("Copiada para a área de transferência", documento);
    }, function (err) {
      console.log("Ocorreu um erro ao copiar", documento);
    });
  }

  public marcarUsado(index: number, used: boolean) {
    this.items[index].usado = used;
  }

  public alternarUsado(index: number) {
    var obterUsedPessoa = this.obterPessoa(index).usado;
    this.items[index].usado = !obterUsedPessoa;
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

