export interface EmployeePersonalInfo {
  id: number;
  fullName: string;
  code: string;
  departmentName: string;
  positionName: string;
  hireDate: Date;
  epsName: string;
  pensionFundName: string;
  salary: number;
  disabilityRecord: boolean;
  vacationRecord: boolean;
  workedDays: number;
  disabilityDays: number;
  vacationDays: number;
  vacationStartDate: Date;
  vacationEndDate: Date;
  disabilityStartDate: Date;
  disabilityEndDate: Date;
  bonus: number;
  transportAllowance: number;
  recordDate: Date;
}
