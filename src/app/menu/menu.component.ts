import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IPessoa } from '../pessoa.interface';
import { saveAs } from 'file-saver';
import { GeradorService } from '../gerador.service';
import { HttpGeradorDeDadosService } from '../http-gerador-de-dados/http-gerador-de-dados.service';
import { IReceitaWS } from '../receitaws.intefaces';
import { FiltroSocio } from '../filtrosocio.enum';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
})

export class MenuDocumentoComponent implements OnInit {

  public items: Array<IPessoa> = [];
  public mainForm: FormGroup;
  constructor(private geradorDeDados: GeradorService, private httpGeradorDeDadosService: HttpGeradorDeDadosService) {
    this.mainForm = new FormGroup({
      quantidade: new FormControl(1, [Validators.required, Validators.min(1),Validators.max(10), Validators.pattern("^[0-9]*$")]),
      tipo: new FormControl('cpf'),
      mascara: new FormControl(false),
      receitaWS: new FormControl(false),
      filtroSocio: new FormControl<FiltroSocio>(FiltroSocio.Aleatorio)
    })
  }

  public clear() {
    this.items.length = 0
    ///infelizmente o observer não enxerga essa alteração.
    // this.items = [];
  }

  private criarMetadataPF(pessoa : IPessoa) : object{
      let documento = pessoa.documento.replace(/[^\w\s]/gi, '')
      return {
            documento: documento,
            rg: this.geradorDeDados.rg(false),
            DataNascimento: this.geradorDeDados.DataNascimento().toLocaleDateString(),
        }
  }

  private criarMetadataPJ(pessoa: IPessoa) : object {
      let documento = pessoa.documento.replace(/[^\w\s]/gi, '')
      return {
          documento: documento,
          cnae: this.geradorDeDados.cnae(false),
          naturezaJuridica: this.geradorDeDados.naturezaJuridica(false),
          razaoSocial: this.geradorDeDados.razaoSocial()
      }
  }
    private criarMetadataReceitaWS(receitaws: IReceitaWS) : object {
      let documento = receitaws.cnpj.replace(/[^\w\s]/gi, '')
      return {
          nome: receitaws.nome,
          documento: documento,
          quantidadeSocios: receitaws.qsa.length,
          cnae: receitaws.atividadePrincipal[0].code,
          naturezaJuridica: receitaws.naturezaJuridica,
          razaoSocial: receitaws.porte
      }
  }

  public criarPessoas() {
    for (var i = 0; i < this.quantidade.value; i++) {
      const pessoa: IPessoa = {
        criadoEm: new Date(),
        atualizadoEm: new Date(),
        tipoPF: this.tipo.value === "cpf",
        documento: this.gerarDocumento(),
        usado: false,
        receitaWS: false
      }
      if(pessoa.tipoPF) {
          pessoa.metadata = this.criarMetadataPF(pessoa);
      }
      if(this.receitaWS.value && pessoa.tipoPF == false){
          pessoa.documento = "Solicitando.."
          this.httpGeradorDeDadosService.obterDadosReceitaWS(this.filtroSocio.value, true).subscribe(response => {
            pessoa.documento = response.cnpj
            pessoa.metadata = this.criarMetadataReceitaWS(response);
            pessoa.receitaWS = true;
          },(error) => {

          })
      }else{
            pessoa.metadata = this.criarMetadataPJ(pessoa);
      }
      this.add(pessoa);
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
  get receitaWS() {
    return this.mainForm.get('receitaWS')!;
  }

  get filtroSocio() {
    return this.mainForm.get('filtroSocio')!;
  }
  get controls() {
    return this.mainForm.controls;
  }

  ngOnInit(): void { }


  private obterPessoa(index: number): IPessoa {
    return this.items[index]
  }

  public tipoPessoaFisica() : boolean {
    return this.tipo.value == "cpf"
  }

  public gerarDocumento(): string {
    let mascara: boolean = this.mascara.value;
    return this.tipoPessoaFisica() ? this.geradorDeDados.cpf(mascara) : this.geradorDeDados.cnpj(mascara);
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
  public obterFiltroSocio () : FiltroSocio[]{
    return [FiltroSocio.Aleatorio, FiltroSocio.UnicoSocio, FiltroSocio.VariosSocios]
  }

  public mostrarOpcaoPessoaJuridica() : boolean{
    return this.tipoPessoaFisica() == false
  }
  public mostrarOpcaoReceitaWS() : boolean{
    return this.tipoPessoaFisica() == false && this.receitaWS.value
  }

  public baixarArquivoDocumento() {
    let data = JSON.stringify(this.items);
    const blob = new Blob([data], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, "lista_documentos.json");
  }
}

