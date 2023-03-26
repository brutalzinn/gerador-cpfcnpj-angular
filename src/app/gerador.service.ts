import { Injectable } from '@angular/core';
import cnaeMock from "./mocks/cnae.json";
import naturezaMock from "./mocks/natureza.json";
import razaoSocialMock from "./mocks/razao_social.json";
@Injectable({
  providedIn: 'root'
})
export class GeradorService {

 constructor() { }

  public number_random = (number: number) => (Math.round(Math.random() * number));
  public create_array = (total: number, numero: number) => Array.from(Array(total), () => this.number_random(numero));
  public mod = (dividendo: number, divisor: number) => Math.round(dividendo - (Math.floor(dividendo / divisor) * divisor));
  public text_to_array = (texto: string) =>  texto.split('');



  public aplicarMascara(text: string){
  //preciso tratar isso para remover qualquer tipo de formatação no string.
  text = text.replace(/[^\w\s]/gi, '')
  let ehCpf = text.length == 11
  let ehCNPJ = text.length == 14
  let ehRG = text.length == 9
  let ehCnae = text.length == 7
  let ehNaturezaJuridica = text.length == 4

  if(ehCpf){
      let [n1, n2, n3, n4, n5, n6, n7, n8,n9,d1,d2] = this.text_to_array(text);
      return `${n1}${n2}${n3}.${n4}${n5}${n6}.${n7}${n8}${n9}-${d1}${d2}`;
  }
  if(ehCNPJ){
      let [n1, n2, n3, n4, n5, n6, n7, n8,n9,n10,n11,n12, d1,d2] = this.text_to_array(text);
      return `${n1}${n2}.${n3}${n4}${n5}.${n6}${n7}${n8}/${n9}${n10}${n11}${n12}-${d1}${d2}`;
  }
  if(ehRG){
    let [n1, n2, n3, n4, n5, n6, n7, n8,d1] = this.text_to_array(text);
    return `${n1}${n2}.${n3}${n4}${n5}.${n6}${n7}${n8}-${d1}`;
  }

 if(ehCnae){
    let [n1, n2, n3, n4, n5, n6, n7] = this.text_to_array(text);
    return `${n1}${n2}${n3}${n4}-${n5}/${n6}${n7}`;
  }

   if(ehNaturezaJuridica){
    let [n1, n2, n3, n4] = this.text_to_array(text);
    return `${n1}${n2}${n3}-${n4}`;
  }

  return text;
}

public razaoSocial(){
    let randomIndex =  this.number_random(razaoSocialMock.length);
    let razaoSocial = razaoSocialMock[randomIndex];
    return razaoSocial;
}

public cnae(mascara: boolean){
    let randomIndex =  this.number_random(cnaeMock.length);
    let cnae = cnaeMock[randomIndex];
    let [n1, n2, n3, n4, n5, n6, n7] = this.text_to_array(cnae.cod);
    if (mascara)
      return `${n1}${n2}${n3}${n4}-${n5}/${n6}${n7}`;
    else
      return `${n1}${n2}${n3}${n4}${n5}${n6}${n7}`;
}

public naturezaJuridica(mascara: boolean){
    let randomIndex =  this.number_random(naturezaMock.length);
    let naturezaJuridica = naturezaMock[randomIndex];
    let [n1, n2, n3, n4] = this.text_to_array(naturezaJuridica.cod);
    if (mascara)
      return `${n1}${n2}${n3}-${n4}`;
    else
      return `${n1}${n2}${n3}${n4}`;
}

  public rg(mascara: boolean){
    let total_array = 9;
    let n = 9;
    let [n1, n2, n3, n4, n5, n6, n7, n8, d1] = this.create_array(total_array, n);
    if (mascara)
      return `${n1}${n2}.${n3}${n4}${n5}.${n6}${n7}${n8}-${d1}`;
    else
      return `${n1}${n2}${n3}${n4}${n5}${n6}${n7}${n8}${d1}`;
  }
  public cnpj(mascara: boolean) {
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

    if (mascara)
      return `${n1}${n2}.${n3}${n4}${n5}.${n6}${n7}${n8}/${n9}${n10}${n11}${n12}-${d1}${d2}`;
    else
      return `${n1}${n2}${n3}${n4}${n5}${n6}${n7}${n8}${n9}${n10}${n11}${n12}${d1}${d2}`;
  }

  public cpf(mascara: boolean) {
    let total_array = 9;
    let n = 9;
    let [n1, n2, n3, n4, n5, n6, n7, n8, n9] = this.create_array(total_array, n);

    let d1 = n9 * 2 + n8 * 3 + n7 * 4 + n6 * 5 + n5 * 6 + n4 * 7 + n3 * 8 + n2 * 9 + n1 * 10;
    d1 = 11 - (this.mod(d1, 11));
    if (d1 >= 10) d1 = 0;

    let d2 = d1 * 2 + n9 * 3 + n8 * 4 + n7 * 5 + n6 * 6 + n5 * 7 + n4 * 8 + n3 * 9 + n2 * 10 + n1 * 11;
    d2 = 11 - (this.mod(d2, 11));
    if (d2 >= 10) d2 = 0;

    if (mascara) {
      return `${n1}${n2}${n3}.${n4}${n5}${n6}.${n7}${n8}${n9}-${d1}${d2}`;
    }

    return `${n1}${n2}${n3}${n4}${n5}${n6}${n7}${n8}${n9}${d1}${d2}`;
  }

  public DataNascimento() : Date {
   var dataAtual = new Date();
   let n = 9;
   dataAtual.setFullYear(dataAtual.getFullYear() - (18 + this.number_random(n)));
    return dataAtual;
  }
}
