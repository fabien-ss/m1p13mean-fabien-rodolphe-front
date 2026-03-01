import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { ProductService } from '../../../../services/services/product.service';
import { PromotionService } from '../../../../services/services/promotion.service';
import { CategoryService } from '../../../../services/services/category.service';
import { Product } from '../../../../services/models/product.models';
import { Promotion } from '../../../../services/models/promotion.model';
import { Category } from '../../../../services/models/category.model';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-shop-promotions',
  standalone: true,
  imports: [CommonModule, FormsModule, FullCalendarModule],
  templateUrl: './shop-promotions.component.html',
  styleUrl: './shop-promotions.component.css',
})
export class ShopPromotionsComponent implements OnInit {

  readonly apiUrl = environment.apiUrl;

  products: Product[] = [];
  promotions: Promotion[] = [];
  categories: Category[] = [];

  isLoadingProducts = signal(false);
  isSaving = signal(false);
  globalError = '';
  globalSuccess = '';
  isLoadingPromos = signal(false);


  selectedProduct: Product | null = null;
  activePanel: 'none' | 'create' = 'none';

  // Filters sidebar state
  searchTerm = '';
  selectedCatId = '';

  get filteredProducts(): Product[] {
    const q = this.searchTerm.toLowerCase();
    return this.products.filter(p => {
      const mQ = !q || p.name?.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q);
      const mCat = !this.selectedCatId || (p.category as Category)?._id === this.selectedCatId;
      return mQ && mCat;
    });
  }

  // for the form of promo
  promoTitle = '';
  promoDescription = '';
  promoDiscountType: 'PERCENT' | 'FIXED' = 'PERCENT';
  promoValue: number | null = null;
  promoStart = '';
  promoEnd = '';
  formError = '';

  get previewPrice(): number | null {
    if (!this.selectedProduct?.price || !this.promoValue) return null;
    const base = Number(this.selectedProduct.price);
    return this.promoDiscountType === 'PERCENT'
      ? Math.max(0, base * (1 - this.promoValue / 100))
      : Math.max(0, base - this.promoValue);
  }

  // Fullcalendar
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: '',
    },
    events: [],
    eventClick: (arg) => this.onEventClick(arg),
    dateClick: (arg) => this.onDateClick(arg),
    eventDisplay: 'block',
    displayEventTime: false,
    height: 'auto',
    firstDay: 1,           // Monday
    dayMaxEvents: 3,           // "+N more" after 3
    eventDidMount: (info) => {
      // tooltip on hover
      info.el.title = info.event.extendedProps['tooltip'] ?? info.event.title;
    },
  };

  constructor(
    private productService: ProductService,
    private promotionService: PromotionService,
    private categoryService: CategoryService,
  ) { }

  ngOnInit(): void {
    const shopId = localStorage.getItem('selectedShopId');
    if (!shopId) { this.globalError = 'No shop selected.'; return; }
    this.loadProducts(shopId);
    this.loadCategories(shopId);
    this.loadPromotions(shopId);
  }

  // load the data I need :DD
  private loadPromotions(shopId: string): void {
    this.isLoadingPromos.set(true);
    this.promotionService.getAllByShop(shopId).subscribe({
      next: data => {
        this.promotions = data;
        this.refreshCalendar();        // paint them all on the calendar
        this.isLoadingPromos.set(false);
      },
      error: e => {
        this.globalError = e?.error?.message ?? 'Failed to load promotions.';
        this.isLoadingPromos.set(false);
      }
    });
  }

  private loadProducts(shopId: string): void {
    this.isLoadingProducts.set(true);
    this.productService.getByShop(shopId).subscribe({
      next: d => {
        this.products = d;
        this.isLoadingProducts.set(false);
      },
      error: e => {
        this.globalError = e?.error?.message ?? 'Failed to load products.';
        this.isLoadingProducts.set(false);
      }
    });
  }

  private loadCategories(shopId: string): void {
    this.categoryService.getAllByShop(shopId).subscribe({
      next: d => { this.categories = d; }
    });
  }

  // Resaka mamadika promotion ho event calendar
  private promotionsToEvents(promos: Promotion[]): EventInput[] {
    const COLORS = [
      '#f59e0b', '#38bdf8', '#f43f5e', '#34d399',
      '#a78bfa', '#f472b6', '#2dd4bf', '#fb923c',
    ];

    return promos.map((p, i) => {
      const color = COLORS[i % COLORS.length];
      // FullCalendar end date is exclusive — add 1 day for inclusive display
      const end = p.endDate
        ? new Date(new Date(p.endDate).getTime() + 86_400_000).toISOString().split('T')[0]
        : undefined;

      return {
        id: p._id,
        title: `${p.discountType === 'PERCENT' ? `-${p.value}%` : `-${p.value}`} ${p.title}`,
        start: p.startDate,
        end,
        allDay: true,
        backgroundColor: color,
        borderColor: color,
        extendedProps: {
          promotion: p,
          tooltip: `${p.title} · ${p.discountType === 'PERCENT' ? p.value + '%' : p.value + ' off'} · ${p.startDate} → ${p.endDate ?? 'open-ended'}`,
        },
      } as EventInput;
    });
  }

  private refreshCalendar(): void {
    // Replace the events array — FullCalendar reacts to the options object change
    this.calendarOptions = {
      ...this.calendarOptions,
      events: this.promotionsToEvents(this.promotions),
    };
  }

  isEventModalOpen = signal(false);
  modalPromo: any | null = null;
  showDisableConfirm = signal(false);
  isDisabling = signal(false);
  disableError = '';

  closeEventModal = () => this.isEventModalOpen.set(false);
  requestDisable(): void {
    this.showDisableConfirm.set(true);
  }


  confirmDisable(): void {
    if (!this.modalPromo?._id) return;
    this.promotionService.disable(this.modalPromo._id).subscribe({
      next: () => {
        // Update the local promotion's endDate to now
        const idx = this.promotions.findIndex(p => p._id === this.modalPromo._id);
        if (idx !== -1) {
          const now = new Date().toISOString();
          this.promotions[idx].endDate = now;
          this.refreshCalendar(); // update the calendar display
        }
        this.showDisableConfirm.set(false);
        this.closeEventModal();
        this.flash(`Promotion "${this.modalPromo.title}" ended.`);
      },
      error: (err) => {
        this.showDisableConfirm.set(false);
        this.disableError = err?.error?.message ?? 'Failed to end promotion.';
        setTimeout(() => (this.disableError = ''), 5000);
      }
    });
  }

  handleError(err: any, fallbackMsg: string): void {
    this.globalError = err?.error?.message ?? fallbackMsg;
    setTimeout(() => (this.globalError = ''), 5000);
  }

  isPromoActive(promo: Promotion): boolean {
    const now = new Date();
    const start = new Date(promo.startDate);
    const end = promo.endDate ? new Date(promo.endDate) : null;
    return now >= start && (!end || now <= end);
  }

  onEventClick(arg: EventClickArg): void {
    const promo = arg.event.extendedProps['promotion'] as Promotion;
    this.modalPromo = promo;
    console.log('Clicked promotion:', promo);
    this.isEventModalOpen.set(true);
  }


  onDateClick(arg: DateClickArg): void {
    // Optionally pre-fill promoStart when user clicks a date
    if (this.activePanel === 'create') {
      this.promoStart = arg.dateStr;
    }
  }



  openCreate(product: Product): void {
    this.selectedProduct = product;
    this.activePanel = 'create';
    this.clearForm();
  }

  closeCreate(): void {
    this.activePanel = 'none';
    this.selectedProduct = null;
    this.clearForm();
  }

  submit(): void {
    this.formError = '';
    if (!this.selectedProduct?._id) { this.formError = 'No product selected.'; return; }
    if (!this.promoTitle.trim()) { this.formError = 'Title is required.'; return; }
    if (!this.promoValue || this.promoValue <= 0) { this.formError = 'Discount must be > 0.'; return; }
    if (this.promoDiscountType === 'PERCENT' && this.promoValue > 100) { this.formError = 'Max 100%.'; return; }
    if (!this.promoStart) { this.formError = 'Start date required.'; return; }

    const payload: Partial<Promotion> = {
      product: this.selectedProduct._id,
      title: this.promoTitle.trim(),
      description: this.promoDescription.trim() || undefined,
      discountType: this.promoDiscountType,
      value: this.promoValue,
      startDate: this.promoStart,
      endDate: this.promoEnd || null,
      createdBy: localStorage.getItem('userId') ?? '',
    };

    this.isSaving.set(true);
    this.promotionService.create(payload).subscribe({
      next: created => {
        this.promotions = [...this.promotions, created];
        this.refreshCalendar();            // push new event to FullCalendar
        this.isSaving.set(false);
        this.flash(`"${created.title}" created!`);
        this.closeCreate();
      },
      error: e => {
        this.formError = e?.error?.message ?? 'Failed to create promotion.';
        this.isSaving.set(false);
      }
    });
  }

  promoCount(id: string) { return this.promotions.filter(p => p.product === id).length; }
  hasActive(id: string) {
    const now = new Date();
    return this.promotions.some(p => {
      const s = new Date(p.startDate);
      const e = p.endDate ? new Date(p.endDate) : null;
      return p.product === id && now >= s && (!e || now <= e);
    });
  }
  fmtDate(d?: string | null) {
    return d ? new Date(d).toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' }) : 'open-ended';
  }

  clearForm(): void {
    this.promoTitle = this.promoDescription = this.promoStart = this.promoEnd = '';
    this.promoDiscountType = 'PERCENT';
    this.promoValue = null;
    this.formError = '';
  }

  private flash(msg: string): void {
    this.globalSuccess = msg;
    setTimeout(() => (this.globalSuccess = ''), 4000);
  }
}