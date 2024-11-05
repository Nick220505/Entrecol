import { Component, computed, inject } from '@angular/core';
import { PayrollService } from '@employees/services/payroll.service';
import {
  LegendPosition,
  NgxChartsModule,
  ScaleType,
} from '@swimlane/ngx-charts';

@Component({
  selector: 'app-eps-frequency-chart',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './eps-frequency-chart.component.html',
  styleUrl: './eps-frequency-chart.component.scss',
})
export class EpsFrequencyChartComponent {
  private readonly payrollService = inject(PayrollService);

  protected readonly legendPosition = LegendPosition.Right;
  protected readonly view: [number, number] = [window.innerWidth / 1.2, 550];
  protected readonly colorScheme = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: [
      '#2196F3',
      '#FF9800',
      '#4CAF50',
      '#E91E63',
      '#9C27B0',
      '#00BCD4',
      '#FFC107',
      '#3F51B5',
    ],
  };

  protected readonly chartData = computed(() => {
    const data = this.payrollService.epsFrequency().data;
    if (!Object.keys(data).length) return [];

    return Object.entries(data)
      .map(([name, value]) => ({
        name,
        value: Number(value),
      }))
      .filter((item) => item.value > 0)
      .sort((a, b) => a.name.localeCompare(b.name));
  });

  protected readonly yAxisTicks = computed(() => {
    const data = this.chartData();
    if (!data.length) return [0];

    const maxValue = Math.max(...data.map((item) => item.value));
    return Array.from({ length: maxValue + 1 }, (_, i) => i);
  });

  formatYAxisTick(value: number): string {
    return value.toString();
  }

  formatXAxisTick(value: string): string {
    return value.length > 15 ? value.substring(0, 15) + '...' : value;
  }
}
