// product-categories-list.component.ts
import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { SwitchComponent } from '../../../../shared/components/form/input/switch.component';
import { CategoryService } from '../../../../services/services/category.service';
import { Category } from '../../../../services/models/category.model';
import { InputFieldComponent } from '@/shared/components/form/input/input-field.component';
import { SelectComponent } from '@/shared/components/form/select/select.component';

@Component({
  selector: 'app-product-categories-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, SwitchComponent, InputFieldComponent, SelectComponent],
  templateUrl: './product-categories-list.component.html',
  styleUrl: './product-categories-list.component.css',
})
export class ProductCategoriesListComponent {

  // Setter so we can keep a mutable local copy
  @Input() set categories(value: Category[]) { this._categories = [...value]; }
  get categories(): Category[] { return this._categories; }
  private _categories: Category[] = [];

  // ── UI state ──────────────────────────────────────────────────────────────
  errorMessage   = '';
  successMessage = '';
  isLoading      = signal(false);

  // ── Inline edit state ─────────────────────────────────────────────────────
  editingId: string | null = null;   // _id of the row currently being edited
  draftName        = '';
  draftDescription = '';
  draftIsActive    = false;
  draftParentId    = '';             // just the _id string for the <select>

  // ── Delete confirm state ──────────────────────────────────────────────────
  confirmDeleteId: string | null = null;

  // Parent <select> options — excludes the row being edited (can't be own parent)
  get parentOptions(): { value: string; label: string }[] {
    return this._categories
      .filter(c => c._id !== this.editingId)
      .map(c => ({ value: c._id, label: c.name }));
  }

  constructor(private categoryService: CategoryService) {}

  // ─────────────────────────────────────────────────────────────────────────
  // TOGGLE isActive
  // ─────────────────────────────────────────────────────────────────────────

  toggleIsActive(category: Category): void {
    if (!category._id) return;
    const newState = !category.isActive;

    this.categoryService.setActive(category._id, newState).subscribe({
      next: () => {
        category.isActive = newState;
        this.showSuccess(`"${category.name}" ${newState ? 'activated' : 'deactivated'}.`);
      },
      error: (err) => this.handleError(err, 'Failed to update status.')
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // INLINE EDIT
  // ─────────────────────────────────────────────────────────────────────────

  startEdit(category: Category): void {
    this.editingId        = category._id;
    this.draftName        = category.name;
    this.draftDescription = category.description ?? '';
    this.draftIsActive    = category.isActive;
    this.draftParentId    = category.parent?._id ?? '';
    this.confirmDeleteId  = null; // close any open confirm
    this.clearMessages();
  }

  cancelEdit(): void {
    this.editingId = null;
  }

  saveEdit(category: Category): void {
    if (!this.draftName.trim()) {
      this.errorMessage = 'Name is required.';
      return;
    }

    const payload: Partial<Category> = {
      name:        this.draftName.trim(),
      description: this.draftDescription.trim(),
      isActive:    this.draftIsActive,
      // API expects the _id; wrap only if a parent is selected
      parent: this.draftParentId
        ? { _id: this.draftParentId, name: this.getParentName(this.draftParentId) }
        : null,
    };

    this.isLoading.set(true);
    this.clearMessages();

    this.categoryService.update(category._id, payload).subscribe({
      next: (updated) => {
        // Patch in-place so the row refreshes without a full reload
        const idx = this._categories.findIndex(c => c._id === category._id);
        if (idx !== -1) {
          this._categories[idx] = { ...this._categories[idx], ...updated };
          this._categories = [...this._categories]; // trigger change detection
        }
        this.editingId = null;
        this.isLoading.set(false);
        this.showSuccess(`"${updated.name}" updated successfully.`);
      },
      error: (err) => this.handleError(err, 'Failed to update category.')
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // DELETE
  // ─────────────────────────────────────────────────────────────────────────

  requestDelete(category: Category): void {
    this.confirmDeleteId = category._id;
    this.editingId = null; // close any open edit row
  }

  cancelDelete(): void {
    this.confirmDeleteId = null;
  }

  confirmDelete(category: Category): void {
    if (!category._id) return;
    this.isLoading.set(true);

    this.categoryService.delete(category._id).subscribe({
      next: () => {
        this._categories    = this._categories.filter(c => c._id !== category._id);
        this.confirmDeleteId = null;
        this.isLoading.set(false);
        this.showSuccess(`"${category.name}" deleted.`);
      },
      error: (err) => {
        this.confirmDeleteId = null;
        this.handleError(err, 'Failed to delete category.');
      }
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────────────────────────────────

  getParentName(id: string): string {
    return this._categories.find(c => c._id === id)?.name ?? '';
  }

  private clearMessages(): void {
    this.errorMessage  = '';
    this.successMessage = '';
  }

  private showSuccess(msg: string): void {
    this.successMessage = msg;
    setTimeout(() => (this.successMessage = ''), 3000);
  }

  private handleError(err: any, fallback: string): void {
    this.errorMessage = err?.error?.message ?? fallback;
    this.isLoading.set(false);
  }
}
