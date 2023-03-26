import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { DetalhesComponent } from './detalhes/detalhes.component';
import { MenuDocumentoComponent } from './menu/menu.component';
import { GeradorService } from './gerador.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
  MenuDocumentoComponent,
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DetalhesComponent,
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
