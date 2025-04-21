import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { forkJoin } from 'rxjs';
import { ArtworkCardComponent } from '../artwork-card/artwork-card.component';
import { CategoriesModalComponent } from '../categories-modal/categories-modal.component';
import { ArtistCardComponent } from '../artist-card/artist-card.component';

@Component({
  selector: 'app-artist-detail-tabs',
  standalone: true,
  imports: [CommonModule, ArtworkCardComponent, CategoriesModalComponent, ArtistCardComponent],
  templateUrl: './artist-detail-tabs.component.html',
  styleUrls: ['./artist-detail-tabs.component.scss']
})
export class ArtistDetailTabsComponent implements OnChanges {
  @Input() artistId!: string;

  loading = true;
  artist: any;
  artworks: any[] = [];
  similarArtists: any[] = [];
  selectedTab: 'info' | 'artworks' | 'similar' = 'info';
  showCategoriesModal = false;
  selectedArtworkForCategories: any = null;

  constructor(private api: ApiService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['artistId'] && changes['artistId'].currentValue !== changes['artistId'].previousValue) {
      console.log('[ArtistDetailTabs] ngOnChanges triggered for artist:', this.artistId);
      this.initializeTabFromHash();
      this.loadArtistDetails(this.artistId);
    }
  }

  private initializeTabFromHash(): void {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'artworks' || hash === 'similar') {
      this.selectedTab = hash as 'artworks' | 'similar';
    }
  }

  private loadArtistDetails(artistId: string): void {
    console.log('[ArtistDetailTabs] Loading details for artist ID:', artistId);
    this.loading = true;

    forkJoin({
      artist: this.api.getArtist(artistId),
      artworks: this.api.getArtworks(artistId),
      similarArtists: this.api.getSimilarArtists(artistId)
    }).subscribe({
      next: ({ artist, artworks, similarArtists }) => {
        this.artist = artist;
        this.artworks = artworks._embedded?.artworks || [];
        console.log('[ArtistDetailTabs] Loaded artworks:', this.artworks);
        this.similarArtists = similarArtists._embedded?.artists || [];
        this.loading = false;
        console.log('[ArtistDetailTabs] Loaded artist, artworks and similar artists:', this.artist, this.artworks, this.similarArtists);
      },
      error: (err) => {
        console.error('[ArtistDetailTabs] Error loading artist details:', err);
        this.artist = null;
        this.artworks = [];
        this.similarArtists = [];
        this.loading = false;
      }
    });
  }

  selectTab(tab: 'info' | 'artworks' | 'similar') {
    this.selectedTab = tab;
  }

  isTabSelected(tab: 'info' | 'artworks' | 'similar'): boolean {
    return this.selectedTab === tab;
  }

  selectSimilarArtist(artist: any) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.location.hash = '';
    window.location.href = `/search#info`;

    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('select-artist', { detail: artist }));
    }, 100);
  }

  openCategoriesModal(artwork: any): void {
    console.log('[ArtistDetailTabs] Open categories modal for artwork:', artwork);
    this.selectedArtworkForCategories = artwork;
    this.showCategoriesModal = true;
  }

  closeCategoriesModal(): void {
    this.showCategoriesModal = false;
  }
}
