import { Component, OnInit } from '@angular/core';
import {
  ApexNonAxisChartSeries,
  ApexChart,
  ApexPlotOptions,
  ApexFill,
  ApexStroke,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { DropdownComponent } from '../../../../shared/components/ui/dropdown/dropdown.component';
import { DropdownItemComponent } from '../../../../shared/components/ui/dropdown/dropdown-item/dropdown-item.component';
import { MonthlyTarget, ShopStatsService } from '../../../../services/services/shop-stats.service';

@Component({
  selector: 'app-shop-target',
  standalone: true,
  imports: [NgApexchartsModule, DropdownComponent, DropdownItemComponent],
  templateUrl: './shop-target.component.html',
  styleUrl: './shop-target.component.css',
})
export class ShopTargetComponent implements OnInit {

  isLoading = true;
  hasError = false;
  chartReady = false;

  target = 0;
  targetTrend: 'up' | 'down' = 'up';
  revenue = 0;
  revenueTrend: 'up' | 'down' = 'up';
  today = 0;
  todayTrend: 'up' | 'down' = 'up';

  public series: ApexNonAxisChartSeries = [0];
  public chart: ApexChart = {
    fontFamily: 'Outfit, sans-serif',
    type: 'radialBar',
    height: 330,
    sparkline: { enabled: true },
  };
  public plotOptions: ApexPlotOptions = {
    radialBar: {
      startAngle: -85,
      endAngle: 85,
      hollow: { size: '80%' },
      track: {
        background: '#E4E7EC',
        strokeWidth: '100%',
        margin: 5,
      },
      dataLabels: {
        name: { show: false },
        value: {
          fontSize: '36px',
          fontWeight: '600',
          offsetY: -40,
          color: '#1D2939',
          formatter: (val: number) => `${val}%`,
        },
      },
    },
  };
  public fill: ApexFill = { type: 'solid', colors: ['#465FFF'] };
  public stroke: ApexStroke = { lineCap: 'round' };
  public labels: string[] = ['Progress'];
  public colors: string[] = ['#465FFF'];

  isOpen = false;

  constructor(private shopStatsService: ShopStatsService) {}

  ngOnInit(): void {
    this.shopStatsService.getMonthlyTarget().subscribe({
      next: (response: any) => {
        const data: MonthlyTarget = response.data;

        this.series = [data.progressPercent];

        this.target = data.target.value;
        this.targetTrend = data.target.trend;

        this.revenue = data.revenue.value;
        this.revenueTrend = data.revenue.trend;

        this.today = data.today.value;
        this.todayTrend = data.today.trend;

        this.isLoading = false;
        setTimeout(() => { this.chartReady = true; }, 0);
      },
      error: (err) => {
        console.error('Failed to load monthly target', err);
        this.hasError = true;
        this.isLoading = false;
      },
    });
  }

  formatCurrency(value: number): string {
    if (value >= 1000) return `MGA ${(value / 1000).toFixed(0)}K`;
    return `MGA ${value}`;
  }

  toggleDropdown() { this.isOpen = !this.isOpen; }
  closeDropdown() { this.isOpen = false; }
}