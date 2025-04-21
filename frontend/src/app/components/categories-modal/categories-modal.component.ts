import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-categories-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories-modal.component.html',
  styleUrls: ['./categories-modal.component.scss']
})
export class CategoriesModalComponent implements OnChanges {
  @Input() artwork: any;
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();

  loading = false;
  categories: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['artwork'] && this.artwork?.id) {
      this.loadCategories(this.artwork.id);
    }
  }

  private loadCategories(artworkId: string) {
    this.categories = [];
    this.loading = true;

    this.apiService.getCategories(artworkId).subscribe({
      next: (response) => {
        this.categories = response._embedded?.genes || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('[CategoriesModal] Error loading categories:', err);
        this.loading = false;
      }
    });
  }

  closeModal() {
    this.close.emit();
  }
}