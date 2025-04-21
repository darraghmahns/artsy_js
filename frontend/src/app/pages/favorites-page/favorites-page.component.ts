import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { catchError, forkJoin, of, map } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorites-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorites-page.component.html',
  styleUrls: ['./favorites-page.component.scss']
})
export class FavoritesPageComponent implements OnInit, OnDestroy {
  favorites: any[] = [];
  loading = true;
  private timerInterval: any;

  constructor(
    private api: ApiService, 
    private auth: AuthService, 
    private router: Router
  ) {}

  ngOnInit(): void {

    const user = this.auth.getCurrentUser();

    if (!user) {
      this.router.navigate(['/']);
      return;
    }

    this.auth.getFavorites().subscribe({
      next: (favoritesData: { artistId: string, addedAt: string }[]) => {
        if (!favoritesData.length) {
          this.loading = false;
          return;
        }
  
        const chunkSize = 5;
        const delayMs = 1000; // 1 second between chunks
        const chunks: { artistId: string, addedAt: string }[][] = [];
  
        for (let i = 0; i < favoritesData.length; i += chunkSize) {
          chunks.push(favoritesData.slice(i, i + chunkSize));
        }
  
        let batchIndex = 0;
  
        const processNextBatch = () => {
          if (batchIndex >= chunks.length) {
            this.loading = false;
            this.startTimer();
            return;
          }
  
          const currentChunk = chunks[batchIndex];
          const requests = currentChunk.map(fav =>
            this.api.getArtist(fav.artistId).pipe(
              catchError(err => {
                console.warn('[Favorites] Failed to fetch artist:', fav.artistId, err);
                return of(null);
              }),
              map(artist => artist ? { ...artist, addedAt: fav.addedAt } : null)
            )
          );
  
          forkJoin(requests).subscribe(results => {
            this.favorites.push(...results.filter(Boolean));
            batchIndex++;
            setTimeout(processNextBatch, delayMs); // throttle next batch
          });
        };
  
        processNextBatch();
      },
      error: () => this.loading = false
    });
  }

  getRelativeTime(date: string): string {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  
    if (seconds < 60) {
      return `${seconds} second${seconds === 1 ? '' : 's'} ago`;
    }
  
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    }
  
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    }
  
    const days = Math.floor(hours / 24);
    return `${days} day${days === 1 ? '' : 's'} ago`;
  }

  removeFromFavorites(artistId: string): void {
    this.auth.removeFavorite(artistId).subscribe({
      next: () => {
        this.favorites = this.favorites.filter(artist => artist.id !== artistId);
      },
      error: err => {
        console.error('Error removing favorite:', err);
      }
    });
  }

  private startTimer(): void {
    this.timerInterval = setInterval(() => {
      this.favorites = [...this.favorites]; // trigger change detection
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
}