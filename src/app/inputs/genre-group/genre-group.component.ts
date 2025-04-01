import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ToggleKey } from '../models/toggleKey.model';
import { ToggleComponent } from "../toggle/toggle.component";

@Component({
  selector: 'app-genre-group',
  imports: [ToggleComponent],
  template: `
  <div class="genre-group" #genreGroup [style.width]="width" [style.gap]="gapValue">
    @for (genre of genres; track genre.key) {
      <app-toggle 
        #genre
        [class.mb-5]="isHover"
        [data]="genre" 
        [(value)]="genre.value"
        (valueChange)="onToggleChange($event)">
      </app-toggle>
    }
  </div>
  `,
  styleUrl: './genre-group.component.css'
})
export class GenreGroupComponent implements OnInit, AfterViewInit {
  @Input() genres: ToggleKey[] = [];
  @Input() width: string = '575px';
  @Output() selectedGenresChange = new EventEmitter<ToggleKey[]>();
  @ViewChild('genreGroup') genreGroup: ElementRef | undefined;
  @ViewChild('genre') genre: ElementRef | undefined;

  gapValue: string = '21px'
  isHover: boolean = false;
  private timer: any;

  ngOnInit() {
    this.updateGap();
  }

  ngAfterViewInit() {

    if (this.genreGroup) {
      this.genreGroup.nativeElement.addEventListener('mouseenter', () => {
        this.showScroll();
        this.resetTimer();
      });

      this.genreGroup.nativeElement.addEventListener('mouseleave', () => {
        this.startTimer();
      });
    }
  }

  showScroll() {
    if (this.genreGroup && this.genres.length > 3) {
      this.genreGroup.nativeElement.style.overflowX = 'auto';
      this.isHover = true;
    }
  }

  hideScroll() {
    if (this.genreGroup && this.genres.length > 3) {
      this.genreGroup.nativeElement.style.overflowX = 'hidden';
      this.isHover = false
    }
  }

  startTimer() {
    this.timer = setTimeout(() => {
      this.hideScroll();
    }, 3000);
  }

  resetTimer() {
    clearTimeout(this.timer);
  }

  updateGap() {
    if (this.genres && this.genres.length > 3) {
      this.gapValue = '25px';
    } else {
      this.gapValue = '21px';
    }
    console.log(this.gapValue);
    
  }

  onToggleChange(genre: ToggleKey) {
    const index = this.genres.findIndex(g => g.key === genre.key);

    if (index !== -1) this.genres[index].value = genre.value;

    this.selectedGenresChange.emit(this.genres.filter(g => g.value));
  }
}

