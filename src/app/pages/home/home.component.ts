import { Component, HostListener, OnInit  } from '@angular/core';
import { SelectComponent } from "../../inputs/select/select.component";
import { BarComponent } from "../../ui/bar/bar.component";
import { ToggleKey } from '../../inputs/models/toggleKey.model';
import { GenreGroupComponent } from "../../inputs/genre-group/genre-group.component";
import { SearchComponent } from "../../inputs/search/search.component";

@Component({
  selector: 'app-home',
  imports: [SelectComponent, BarComponent, GenreGroupComponent, SearchComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  genres: ToggleKey[] = [
    { key: 'action', value: false },
    { key: 'comedy', value: false },
    { key: 'drama', value: false },

    
  ];
  isMobile: boolean = false;
  selectValue?: string;

  ngOnInit(){
    this.checkScreenSize()
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    if (typeof window !== 'undefined') {
      this.isMobile = window.innerWidth < 768;
    }
  }

  onSelectionChange(value: string) {
    this.selectValue = value;
  }
  
  onSelectedGenresChange(selectedGenres: ToggleKey[]) {
    console.log('Géneros seleccionados:', selectedGenres);
  }

  onSearch(term: string){
    console.log(term);
    
  }
}
