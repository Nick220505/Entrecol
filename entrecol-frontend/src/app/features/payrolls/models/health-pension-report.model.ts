export interface HealthPensionReport {
  epsCounts: Record<string, number>;
  pensionFundCounts: Record<string, number>;
  epsByDepartment: Record<string, Record<string, number>>;
  pensionFundByDepartment: Record<string, Record<string, number>>;
}
