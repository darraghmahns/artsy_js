import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { SearchFormComponent } from '../../components/search-form/search-form.component';
import { ArtistCardComponent } from '../../components/artist-card/artist-card.component';
import { ArtistDetailTabsComponent } from '../../components/artist-detail-tabs/artist-detail-tabs.component';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [CommonModule, SearchFormComponent, ArtistCardComponent, ArtistDetailTabsComponent],
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent {
  results: any[] = [];
  loading = false;
  selectedArtistId: string | any = null;
  hasSearched = false;

  constructor(private api: ApiService) {}

  onSearch(query: string) {
    console.log('[Search submitted]', query);
    
    this.hasSearched = true;

    if (!query) {
      this.results = [];
      return;
    }

    this.loading = true;
    this.api.searchArtists(query).subscribe({
      next: (res: any) => {
        console.log('[Search results]', res);
        this.results = res._embedded?.results?.filter((r: any) => r.type === 'artist') || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('[Search error]', err);
        this.results = [];
        this.loading = false;
      }
    });
  }

  selectArtist(artist: any) {
    if (!artist || !artist._links?.self?.href) {
      console.error('[SearchPage] Invalid artist object:', artist);
      return;
    }
  
    const artistId = artist._links.self.href.split('/').pop();
    console.log('[SearchPage] Artist selected:', artist, 'ID:', artistId);
    this.selectedArtistId = artistId ?? '';
  }
}