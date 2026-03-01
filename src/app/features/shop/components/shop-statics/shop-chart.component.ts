import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill,
  ApexGrid, ApexLegend, ApexMarkers, ApexStroke, ApexTooltip,
  ApexXAxis, ApexYAxis,
} from 'ng-apexcharts';
import { ShopStatsService, SalesStatistics } from '../../../../services/services/shop-stats.service';

@Component({
  selector: 'app-shop-chart',
  standalone: true,
  imports: [CommonModule, FormsModule, NgApexchartsModule],
  templateUrl: './shop-chart.component.html',
})
export class ShopChartComponent implements OnInit {

  isLoading = true;
  hasError = false;
  chartReady = false;

  isTargetModalOpen = false;
  newSalesValue: number = 0;
  newRevenueValue: number = 0;
  selectedMonthIndex: number = 11;

  public series: ApexAxisChartSeries = [];

  public chart: ApexChart = {
    fontFamily: 'Outfit, sans-serif',
    height: 310,
    type: 'area',
    toolbar: { show: false },
  };

  public colors: string[] = ['#465FFF', '#9CB9FF'];
  public stroke: ApexStroke = { curve: 'straight', width: [2, 2] };
  public fill: ApexFill = {
    type: 'gradient',
    gradient: { opacityFrom: 0.55, opacityTo: 0 },
  };
  public markers: ApexMarkers = {
    size: 0,
    strokeColors: '#fff',
    strokeWidth: 2,
    hover: { size: 6 },
  };
  public grid: ApexGrid = {
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: true } },
  };
  public dataLabels: ApexDataLabels = { enabled: false };
  public tooltip: ApexTooltip = { enabled: true, x: { format: 'dd MMM yyyy' } };
  public xaxis: ApexXAxis = {
    type: 'category',
    categories: [],
    axisBorder: { show: false },
    axisTicks: { show: false },
    tooltip: { enabled: false },
  };
  public yaxis: ApexYAxis = {
    labels: { style: { fontSize: '12px', colors: ['#6B7280'] } },
  };
  public legend: ApexLegend = { show: false };

  constructor(private shopStatsService: ShopStatsService) {}

  ngOnInit(): void {
    this.loadSalesStatistics();
  }

  loadSalesStatistics(): void {
    this.shopStatsService.getSalesStatistics().subscribe({
      next: (response: any) => {
        const data: SalesStatistics = response.data;
        this.series = [...data.series];
        this.xaxis = { ...this.xaxis, categories: [...data.categories] };
        this.isLoading = false;
        setTimeout(() => { this.chartReady = true; }, 0);
      },
      error: (err) => {
        console.error('Failed to load sales statistics', err);
        this.hasError = true;
        this.isLoading = false;
      },
    });
  }

  openTargetModal() {
    const salesSeries = this.series.find(s => s.name === 'Sales');
    const revenueSeries = this.series.find(s => s.name === 'Revenue');
    this.newSalesValue = (salesSeries?.data[this.selectedMonthIndex] as number) ?? 0;
    this.newRevenueValue = (revenueSeries?.data[this.selectedMonthIndex] as number) ?? 0;
    this.isTargetModalOpen = true;
  }

  closeTargetModal() {
    this.isTargetModalOpen = false;
  }

  updateChartData() {
    this.shopStatsService.updateSalesStatistics(
      this.selectedMonthIndex,
      this.newSalesValue,
      this.newRevenueValue
    ).subscribe({
      next: (response: any) => {
        const data: SalesStatistics = response.data;
        this.series = [...data.series];
        this.xaxis = { ...this.xaxis, categories: [...data.categories] };
        this.closeTargetModal();
      },
      error: (err) => {
        console.error('Failed to update sales statistics', err);
      },
    });
  }
}