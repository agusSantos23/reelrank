import { Component, inject, OnInit } from '@angular/core';
import { DataLink, TitleLinkComponent } from '../../ui/title-link/title-link.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-error',
  imports: [TitleLinkComponent],
  templateUrl: './error.component.html',
  styleUrl: './error.component.css'
})
export class ErrorComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute)

  protected errorCode: string | null = null;

  protected dataLink: DataLink = {
    name: 'home',
    link: ''
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.errorCode = params.get('errorCode');
    })
  }

}
