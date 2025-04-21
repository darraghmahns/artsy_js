import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss']
})
export class SearchFormComponent {

  constructor() {
    console.log('[SearchFormComponent] initialized');
  }

  @Output() search = new EventEmitter<string>();
  query = new FormControl('');

  submit() {
    const trimmedQuery = this.query.value?.trim();
    console.log('[SearchForm] submit() called with:', trimmedQuery);
    if (trimmedQuery) {
      this.search.emit(trimmedQuery);
    }
  }
  
  submitFromKey(event: any) {
    event.preventDefault(); // stop native browser form submission
    this.submit();
  }
  
  clear() {
    console.log('[SearchForm] clear() called');
    this.query.setValue('');
    this.search.emit('');
  }
}