import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgApexchartsModule, ApexAxisChartSeries, ApexChart, ApexXAxis, ApexYAxis, ApexPlotOptions, ApexDataLabels, ApexStroke, ApexLegend, ApexGrid, ApexFill, ApexTooltip } from 'ng-apexcharts';
import { AdminDashboardData, AdminStatsService, ShopOption } from '../../../services/services/admin-stats.service';


@Component({
  selector: 'app-ecommerce',
  standalone: true,
  imports: [CommonModule, FormsModule, NgApexchartsModule],
  templateUrl: './ecommerce.component.html',
})
export class EcommerceComponent implements OnInit {

  isLoading = true;
  hasError = false;
  chartsReady = false;

  data!: AdminDashboardData;
  shops: ShopOption[] = [];
  selectedShopId: string = '';

  // Orders over time chart
  ordersChart: ApexChart = { fontFamily: 'Outfit, sans-serif', type: 'area', height: 310, toolbar: { show: false } };
  ordersSeries: ApexAxisChartSeries = [];
  ordersXaxis: ApexXAxis = { type: 'category', categories: [], axisBorder: { show: false }, axisTicks: { show: false } };
  ordersColors = ['#465FFF', '#9CB9FF'];
  ordersStroke: ApexStroke = { curve: 'straight', width: [2, 2] };
  ordersFill: ApexFill = { type: 'gradient', gradient: { opacityFrom: 0.45, opacityTo: 0 } };
  ordersGrid: ApexGrid = { xaxis: { lines: { show: false } }, yaxis: { lines: { show: true } } };
  ordersDataLabels: ApexDataLabels = { enabled: false };
  ordersTooltip: ApexTooltip = { enabled: true };
  ordersLegend: ApexLegend = { show: true, position: 'top', horizontalAlign: 'left', fontFamily: 'Outfit' };
  ordersYaxis: ApexYAxis = { labels: { style: { fontSize: '12px', colors: ['#6B7280'] } } };

  // Revenue per shop chart
  revenueChart: ApexChart = { fontFamily: 'Outfit, sans-serif', type: 'bar', height: 310, toolbar: { show: false } };
  revenueSeries: ApexAxisChartSeries = [];
  revenueXaxis: ApexXAxis = { categories: [], axisBorder: { show: false }, axisTicks: { show: false } };
  revenuePlotOptions: ApexPlotOptions = { bar: { horizontal: false, columnWidth: '39%', borderRadius: 5, borderRadiusApplication: 'end' } };
  revenueColors = ['#465FFF'];
  revenueDataLabels: ApexDataLabels = { enabled: false };
  revenueStroke: ApexStroke = { show: true, width: 4, colors: ['transparent'] };
  revenueGrid: ApexGrid = { yaxis: { lines: { show: true } } };
  revenueFill: ApexFill = { opacity: 1 };
  revenueTooltip: ApexTooltip = { y: { formatter: (val) => `MGA ${val.toLocaleString()}` } };
  revenueLegend: ApexLegend = { show: true, position: 'top', horizontalAlign: 'left', fontFamily: 'Outfit' };
  revenueYaxis: ApexYAxis = { labels: { style: { fontSize: '12px', colors: ['#6B7280'] } } };

  // Monthly comparison chart
  comparisonChart: ApexChart = { fontFamily: 'Outfit, sans-serif', type: 'bar', height: 310, toolbar: { show: false } };
  comparisonSeries: ApexAxisChartSeries = [];
  comparisonXaxis: ApexXAxis = { categories: [], axisBorder: { show: false }, axisTicks: { show: false } };
  comparisonColors = ['#465FFF', '#9CB9FF'];
  comparisonPlotOptions: ApexPlotOptions = { bar: { horizontal: false, columnWidth: '39%', borderRadius: 5, borderRadiusApplication: 'end' } };
  comparisonDataLabels: ApexDataLabels = { enabled: false };
  comparisonStroke: ApexStroke = { show: true, width: 4, colors: ['transparent'] };
  comparisonGrid: ApexGrid = { yaxis: { lines: { show: true } } };
  comparisonFill: ApexFill = { opacity: 1 };
  comparisonTooltip: ApexTooltip = { y: { formatter: (val) => `MGA ${val.toLocaleString()}` } };
  comparisonLegend: ApexLegend = { show: true, position: 'top', horizontalAlign: 'left', fontFamily: 'Outfit' };
  comparisonYaxis: ApexYAxis = { labels: { style: { fontSize: '12px', colors: ['#6B7280'] } } };

  constructor(private adminStatsService: AdminStatsService) { }

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(shopId?: string): void {
    this.isLoading = true;
    this.chartsReady = false;
    this.hasError = false;

    this.adminStatsService.getDashboardData(shopId).subscribe({
      next: (response: any) => {
        this.data = response.data;
        this.shops = response.data.allShops;

        // Orders over time
        this.ordersSeries = [...this.data.ordersOverTime.series];
        this.ordersXaxis = { ...this.ordersXaxis, categories: [...this.data.ordersOverTime.categories] };

        // Revenue per shop
        const indices = this.data.revenuePerShop.categories.map((_, i) => i)
          .sort(() => Math.random() - 0.5);

        this.revenueSeries = this.data.revenuePerShop.series.map(serie => ({
          ...serie,
          data: indices.map(i => serie.data[i]),
        }));

        this.revenueXaxis = {
          ...this.revenueXaxis,
          categories: indices.map(i => this.data.revenuePerShop.categories[i]),
        };
        // Monthly comparison
        this.comparisonSeries = [...this.data.monthlySalesComparison.series];
        this.comparisonXaxis = { ...this.comparisonXaxis, categories: [...this.data.monthlySalesComparison.categories] };

        this.isLoading = false;
        setTimeout(() => { this.chartsReady = true; }, 0);
      },
      error: (err) => {
        console.error('Failed to load admin dashboard', err);
        this.hasError = true;
        this.isLoading = false;
      },
    });
  }

  onShopChange(): void {
    this.loadDashboard(this.selectedShopId || undefined);
  }

  formatCurrency(value: number): string {
    if (value >= 1000000) return `MGA ${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `MGA ${(value / 1000).toFixed(1)}K`;
    return `MGA ${value}`;
  }
}