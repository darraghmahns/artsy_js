import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import type { FavoriteEntry } from '../../services/auth.service';

@Component({
  selector: 'app-artist-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './artist-card.component.html',
  styleUrls: ['./artist-card.component.scss']
})
export class ArtistCardComponent implements OnChanges, OnDestroy {
  @Input() artist: any;
  private userSub?: Subscription;
  favorite: boolean = false;
  currentFavorites: FavoriteEntry[] = [];

  constructor(private auth: AuthService) {
    this.userSub = this.auth.user$.subscribe(user => {
      this.currentFavorites = user?.favorites ?? [];
      this.updateFavoriteStatus(); // re-check when user data changes
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['artist'] && this.artist) {
      this.updateFavoriteStatus(); // re-check when artist changes
    }
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
  }

  private updateFavoriteStatus(): void {
    const artistId = this.artistId;
    this.favorite = this.currentFavorites.some(fav => fav.artistId === artistId);
    console.log('[ArtistCard] Checking favorite for:', artistId, '=>', this.favorite);
  }

  get artistId(): string {
    if (this.artist?.id) return this.artist.id;
    if (this.artist?._links?.self?.href) {
      const parts = this.artist._links.self.href.split('/');
      return parts[parts.length - 1];
    }
    return '';
  }

  get isLoggedIn(): boolean {
    return !!this.auth.getCurrentUser();
  }

  isFavorite(): boolean {
    return this.favorite;
  }

  toggleFavorite(): void {
    const artistId = this.artistId;
    if (!this.isLoggedIn || !artistId) return;

    if (this.favorite) {
      this.auth.removeFavorite(artistId).subscribe();
    } else {
      this.auth.addFavorite(artistId).subscribe();
    }
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/artsy_logo.svg';
  }
}