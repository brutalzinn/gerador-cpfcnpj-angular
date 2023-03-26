export interface IReceitaWS {
  status: string
  ultimaAtualizacao: string
  cnpj: string
  tipo: string
  porte: string
  nome: string
  fantasia: string
  abertura: string
  atividadePrincipal: AtividadePrincipal[]
  atividadesSecundarias: AtividadesSecundaria[]
  naturezaJuridica: string
  logradouro: string
  numero: string
  complemento: string
  cep: string
  bairro: string
  municipio: string
  uf: string
  email: string
  telefone: string
  efr: string
  situacao: string
  dataSituacao: string
  motivoSituacao: string
  situacaoEspecial: string
  dataSituacaoEspecial: string
  capitalSocial: string
  qsa: Qsa[]
  billing: Billing
}

export interface AtividadePrincipal {
  code: string
  text: string
}

export interface AtividadesSecundaria {
  code: string
  text: string
}

export interface Qsa {
  nome: string
  qual: string
  paisOrigem: any
  nomeRepLegal: any
  qualRepLegal: any
}

export interface Billing {
  free: boolean
  database: boolean
}
