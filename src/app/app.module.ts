import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { DetalhesComponent } from './detalhes/detalhes.component';
import { MenuDocumentoComponent } from './menu/menu.component';
import { GeradorService } from './services/gerador.service';
import { HttpClientModule } from '@angular/common/http';
import { AcessibilidadeComponent } from './acessibilidade/acessibilidade.component';
import { TipsComponent } from './tips/tips.component';
import { QRCodeModule } from 'angular2-qrcode';


@NgModule({
  declarations: [
  MenuDocumentoComponent,
    AppComponent,
    FooterComponent,
    DetalhesComponent,
    AcessibilidadeComponent,
    TipsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    QRCodeModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [GeradorService],
  bootstrap: [AppComponent]
})
export class AppModule { }
