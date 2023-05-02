export interface IPessoa {
  documento: string;
  tipoPF: boolean;
  criadoEm: Date;
  atualizadoEm: Date;
  usado: boolean;
  receitaWS: boolean;
  metadata?: object;
}

