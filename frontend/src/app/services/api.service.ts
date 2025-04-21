import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  searchArtists(query: string): Observable<any> {
    return this.http.get(`/api/search?q=${encodeURIComponent(query)}`);
  }

  getArtist(id: string): Observable<any> {
    console.log('[Api] Fetching artist:', id);
    return this.http.get(`/api/artist/${id}`);
  }

  getArtworks(artistId: string): Observable<any> {
    console.log('[Api] Fetching artworks for artist:', artistId);
    return this.http.get('/api/artist/artworks', {
      params: { artist_id: artistId }
    });
  }

  getCategories(artworkId: string): Observable<any> {
    return this.http.get(`/api/artist/categories`, {
      params: { artwork_id: artworkId }
    });
  }

  getSimilarArtists(artistId: string): Observable<any> {
    return this.http.get(`/api/artist/similar-artists?artist_id=${artistId}`);
  }
}