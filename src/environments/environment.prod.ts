//O vercel é um cado chato de configurar as variaveis de ambiente com o Angular.

export const environment = {
  production: true,
  baseUrl: process.env['baseUrl'],
  apiKey: process.env['apiKey']
};
