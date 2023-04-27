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

@NgModule({
  declarations: [
  MenuDocumentoComponent,
    AppComponent,
    FooterComponent,
    DetalhesComponent,
    AcessibilidadeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [GeradorService],
  bootstrap: [AppComponent]
})
export class AppModule { }
