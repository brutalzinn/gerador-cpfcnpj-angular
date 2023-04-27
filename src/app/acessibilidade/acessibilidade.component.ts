import { Component, OnInit } from '@angular/core';
import { AcessibilidadeService } from '../services/acessibilidade.service';

@Component({
  selector: 'app-acessibilidade',
  templateUrl: './acessibilidade.component.html',
})
export class AcessibilidadeComponent implements OnInit {

  theme: string = 'light';

  constructor(private acessibilidadeService: AcessibilidadeService) { }

  ngOnInit(): void {
    this.theme = this.acessibilidadeService.getTheme()
  }

  toggleTheme() {
    if (this.theme === 'light') {
      this.theme = 'dark';
    } else  {
      this.theme = 'light';
    }
    this.acessibilidadeService.setTheme(this.theme)
  }

}
