import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-artwork-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './artwork-card.component.html',
  styleUrls: ['./artwork-card.component.scss']
})
export class ArtworkCardComponent {
  @Input() artwork: any;
  @Output() viewCategories = new EventEmitter<any>();

  onViewCategories() {
    this.viewCategories.emit(this.artwork);
  }
}
