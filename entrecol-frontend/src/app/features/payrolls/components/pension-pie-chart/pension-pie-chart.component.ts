import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { PayrollService } from '@payrolls/services/payroll.service';
import {
  LegendPosition,
  NgxChartsModule,
  ScaleType,
} from '@swimlane/ngx-charts';

@Component({
  selector: 'app-pension-pie-chart',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  template: `
    <div class="chart-container">
      <ngx-charts-pie-chart
        [view]="view"
        [results]="chartData()"
        [animations]="true"
        [gradient]="true"
        [legend]="true"
        [legendPosition]="legendPosition"
        [legendTitle]="'Fondo de Pensión'"
        [labels]="true"
        [doughnut]="false"
        [scheme]="colorScheme"
        [labelFormatting]="formatLabel"
      >
      </ngx-charts-pie-chart>
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

            .pie-label-line {
              stroke: rgba(0, 0, 0, 0.7) !important;
            }

            .pie-label {
              fill: rgba(0, 0, 0, 0.87) !important;
              font-weight: 500 !important;
            }

            .pie-grid {
              .arc {
                path {
                  stroke: white !important;
                  stroke-width: 2px !important;
                }

                &:hover {
                  opacity: 0.8;
                }
              }
            }

            .legend-entries {
              margin-left: 16px !important;
            }
          }
        }
      }

      :host-context(.dark-theme) {
        ::ng-deep {
          .ngx-charts {
            text {
              fill: rgba(255, 255, 255, 0.87) !important;
            }

            .pie-label {
              fill: rgba(255, 255, 255, 0.87) !important;
            }
          }
        }
      }
    `,
  ],
})
export class PensionPieChartComponent {
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

    return Object.entries(data.pensionFundCounts)
      .map(([name, value]) => ({
        name,
        value,
      }))
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value);
  });

  formatLabel(value: number): string {
    return `${value}`;
  }
}
