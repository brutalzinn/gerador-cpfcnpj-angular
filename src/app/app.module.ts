import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CpfComponent } from './documento/documento.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { GeradorCpfCnpjService } from './gerador-cpf-cnpj.service';

@NgModule({
  declarations: [
    AppComponent,
    CpfComponent,
    HeaderComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [GeradorCpfCnpjService],
  bootstrap: [AppComponent]
})
export class AppModule { }
