import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IPessoa } from '../interfaces/pessoa.interface';
import { saveAs } from 'file-saver';
import { GeradorService } from '../services/gerador.service';
import { HttpGeradorDeDadosService } from '../services/http-gerador-de-dados.service';
import { IReceitaWS } from '../interfaces/receitaws.intefaces';
import { IFiltroSituacao, IFiltroSocio } from '../interfaces/filtro.interface';
import { environment } from 'src/environments/environment';
import { IErro } from '../interfaces/erro.interface';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
})

export class MenuDocumentoComponent implements OnInit {
  private quantidadeMaxima : number = 10
  public mensagemDeErro: IErro;
  public carregando: boolean;
  public items: Array<IPessoa> = [];
  public mainForm: FormGroup;

  constructor(private geradorDeDados: GeradorService, private httpGeradorDeDadosService: HttpGeradorDeDadosService) {
    this.mainForm = new FormGroup({
      quantidade: new FormControl(1, [Validators.required, Validators.min(1),Validators.max(this.quantidadeMaxima), Validators.pattern("^[0-9]*$")]),
      tipo: new FormControl('cpf'),
      mascara: new FormControl(false),
      receitaWS: new FormControl(false),
      filtroSituacao: new FormControl<IFiltroSituacao>(IFiltroSituacao.Aleatorio),
      filtroSocio: new FormControl<IFiltroSocio>(IFiltroSocio.Aleatorio),
    })
   this.mensagemDeErro = {mostrar: false, mensagem: "", tipo:"negocio"}
   this.carregando = false
  }

  public clear() {
    this.items.length = 0
    ///infelizmente o observer não enxerga essa alteração.
    // this.items = [];
  }
  

  private criarMetadataPessoaFisica(pessoa : IPessoa) : object{
      let documento = pessoa.documento.replace(/[^\w\s]/gi, '')
      return {
            documento: documento,
            email: this.geradorDeDados.gerarTuaMaeAquelaUrsaEmail(),
            rg: this.geradorDeDados.rg(false),
            DataNascimento: this.geradorDeDados.DataNascimento().toLocaleDateString(),
        }
  }

  private criarMetadataPessoaJuridica(pessoa: IPessoa) : object {
      let documento = pessoa.documento.replace(/[^\w\s]/gi, '')
      return {
          documento: documento,
          email: this.geradorDeDados.gerarTuaMaeAquelaUrsaEmail(),
          cnae: this.geradorDeDados.cnae(false),
          naturezaJuridica: this.geradorDeDados.naturezaJuridica(false),
          razaoSocial: this.geradorDeDados.razaoSocial()
      }
  }
    private criarMetadataReceitaWS(receitaws: IReceitaWS) : object {
      let documento = receitaws.cnpj.replace(/[^\w\s]/gi, '')
      return {
          documento,
          email: this.geradorDeDados.gerarTuaMaeAquelaUrsaEmail(),
          nome: receitaws.nome,
          nomeFantasia: receitaws.fantasia,
          tipo: receitaws.tipo,
          quantidadeSocios: receitaws.qsa.length,
          cnae: receitaws.atividadePrincipal[0].code,
          cnaeAleatorio: this.geradorDeDados.cnae(false),
          naturezaJuridica: receitaws.naturezaJuridica,
          razaoSocial: receitaws.porte,
          motivoSituacao: receitaws.motivoSituacao,
          dataSituacao: receitaws.dataSituacao,
          nomeSocioPrincipal: receitaws?.qsa[0]?.nome ?? "",
          nomeTituloSocioPrincipal: receitaws?.qsa[0]?.qual ?? "",
          capitalSocial: receitaws.capitalSocial,
          cep: receitaws.cep,
          logradouro: receitaws.logradouro,
          numero: receitaws.numero,
          telefone: receitaws.telefone,
      }
  }

  public criarPessoas() {
    if(this.quantidade.invalid)
    {
      return
    }
    let mascara: boolean = this.mascara.value;
    this.mensagemDeErro.mostrar = false;
    this.carregando = true
    for (var i = 0; i < this.quantidade.value; i++) {
      if(this.tipoPessoaFisica()) {
         this.criarPessoaFisica(mascara);
      }
      else if(this.receitaWS.value && this.tipoPessoaFisica() == false){
          this.criarPessoaJuridicaReceitaWS();
      }
      else{
        this.criarPessoaJuridica(mascara);
      }
    }
  }


  private criarPessoaJuridica(mascara: boolean){
    const pessoa: IPessoa = {
          criadoEm: new Date(),
          atualizadoEm: new Date(),
          tipoPF: false,
          documento: this.geradorDeDados.cnpj(mascara),
          usado: false,
          receitaWS: false,
        }
        pessoa.metadata = this.criarMetadataPessoaJuridica(pessoa);
        this.add(pessoa);
        this.esconderCarregando()
  }

  private criarPessoaJuridicaReceitaWS(){
  const pessoa: IPessoa = {
        criadoEm: new Date(),
        atualizadoEm: new Date(),
        tipoPF: false,
        documento: "",
        usado: false,
        receitaWS: true,
      }
      this.httpGeradorDeDadosService.obterDadosReceitaWS(this.filtroSocio.value,this.filtroSituacao.value, true, false)
       .subscribe(response => {
            pessoa.documento = response.cnpj
            pessoa.metadata = this.criarMetadataReceitaWS(response);
            this.add(pessoa);
            this.esconderCarregando()
          },(error) => {
            this.mensagemDeErro.mensagem = `A solicitação para ${environment.envVar.baseUrl} falhou. \n ${error.error.Mensagem}`
            this.mensagemDeErro.mostrar = true
        })

  }
  private criarPessoaFisica(mascara: boolean){

   const pessoa: IPessoa = {
        criadoEm: new Date(),
        atualizadoEm: new Date(),
        tipoPF: true,
        documento: this.geradorDeDados.cpf(mascara),
        usado: false,
        receitaWS: false,
      }
      pessoa.metadata = this.criarMetadataPessoaFisica(pessoa)
      this.add(pessoa);
      this.esconderCarregando()
  }

  private esconderCarregando(){
      this.carregando = false
  }

  public add(pessoaModel: IPessoa) {
    this.items.push(pessoaModel);
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
  get filtroSituacao() {
    return this.mainForm.get('filtroSituacao')!;
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
      console.log("Ocorreu um erro ao copiar e você só vai saber se abrir o console :)", documento);
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
      console.log("Ocorreu um erro ao ler o arquivo e você só vai saber se abrir o console :)")
    }
  }
  public obterFiltroSocio () : IFiltroSocio[]{
    return [IFiltroSocio.Aleatorio, IFiltroSocio.UnicoSocio, IFiltroSocio.VariosSocios]
  }

  public obterFiltroSituacao () : IFiltroSituacao[]{
    return [IFiltroSituacao.Aleatorio, IFiltroSituacao.Ativa, IFiltroSituacao.Baixada]
  }


  public mostrarOpcaoPessoaJuridica() : boolean{
    return this.tipoPessoaFisica() == false
  }
  public mostrarOpcaoReceitaWS() : boolean{
    return this.tipoPessoaFisica() == false && this.receitaWS.value
  }

  public mostrarCarregando() : boolean{
    return this.carregando
  }

  public baixarArquivoDocumento() {
    let data = JSON.stringify(this.items);
    const blob = new Blob([data], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, "lista_documentos.json");
  }
}

