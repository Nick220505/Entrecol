import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { PayrollService } from '@payrolls/services/payroll.service';
import {
  LegendPosition,
  NgxChartsModule,
  ScaleType,
} from '@swimlane/ngx-charts';

@Component({
  selector: 'app-pension-department-bar-chart',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  template: `
    <div class="chart-container">
      <ngx-charts-bar-vertical-2d
        [view]="view"
        [results]="chartData()"
        [gradient]="true"
        [xAxis]="true"
        [yAxis]="true"
        [legend]="true"
        [legendTitle]="'Fondo de Pensión'"
        [showXAxisLabel]="true"
        [showYAxisLabel]="true"
        [xAxisLabel]="'Departamento'"
        [yAxisLabel]="'Cantidad'"
        [legendPosition]="legendPosition"
        [scheme]="colorScheme"
        [animations]="true"
        [barPadding]="3"
        [groupPadding]="10"
        [roundDomains]="true"
        [showGridLines]="true"
        [noBarWhenZero]="true"
        [yAxisTickFormatting]="formatYAxisTick"
        [yAxisTicks]="yAxisTicks()"
        [xAxisTickFormatting]="formatXAxisTick"
      >
      </ngx-charts-bar-vertical-2d>
    </div>
  `,
  styles: [
    `
      .chart-container {
        height: 500px;
        margin: 16px 0;
        padding: 0 24px 40px 0;
        overflow: visible;

        ::ng-deep {
          .ngx-charts {
            text {
              font-size: 14px !important;
              font-weight: 500 !important;
            }

            .legend-title {
              font-size: 14px !important;
              font-weight: 600 !important;
            }

            .legend-label {
              font-size: 14px !important;
            }
          }
        }
      }
    `,
  ],
})
export class PensionDepartmentBarChartComponent {
  private readonly payrollService = inject(PayrollService);

  protected readonly legendPosition = LegendPosition.Right;
  protected readonly view: [number, number] = [window.innerWidth / 1.2, 550];
  protected readonly colorScheme = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: [
      '#E91E63',
      '#9C27B0',
      '#673AB7',
      '#3F51B5',
      '#2196F3',
      '#03A9F4',
      '#00BCD4',
      '#009688',
    ],
  };

  protected readonly chartData = computed(() => {
    const data = this.payrollService.healthPensionReport().data;
    if (!data) return [];

    return Object.entries(data.pensionFundByDepartment).map(
      ([department, pensionMap]) => ({
        name: department,
        series: Object.entries(pensionMap)
          .map(([pension, count]) => ({
            name: pension,
            value: count,
          }))
          .filter((item) => item.value > 0)
          .sort((a, b) => b.value - a.value),
      }),
    );
  });

  protected readonly yAxisTicks = computed(() => {
    const data = this.payrollService.healthPensionReport().data;
    if (!data) return [0];

    const maxValue = Math.max(
      ...Object.values(data.pensionFundByDepartment).flatMap((pensionMap) =>
        Object.values(pensionMap),
      ),
    );
    return Array.from({ length: maxValue + 1 }, (_, i) => i);
  });

  formatYAxisTick(value: number): string {
    return `${value}`;
  }

  formatXAxisTick(value: string): string {
    return value.length > 15 ? value.substring(0, 15) + '...' : value;
  }
}
