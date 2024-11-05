export interface NoveltyReport {
  employees: EmployeeNovelty[];
  departmentStats: Record<string, number>;
  departmentPositionStats: Record<string, Record<string, number>>;
  totalNovelties: number;
}

export interface EmployeeNovelty {
  employeeId: number;
  fullName: string;
  code: string;
  departmentName: string;
  positionName: string;
  disabilityRecord: boolean;
  vacationRecord: boolean;
  disabilityDays: number;
  vacationDays: number;
  disabilityStartDate: string;
  disabilityEndDate: string;
  vacationStartDate: string;
  vacationEndDate: string;
  bonus: number;
  transportAllowance: number;
  recordDate: string;
}
