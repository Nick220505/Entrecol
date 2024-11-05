import { Employee } from './payroll.model';

export interface EmployeeRecord {
  id: number;
  employee: Employee;
  disabilityRecord: boolean;
  vacationRecord: boolean;
  workedDays: number;
  disabilityDays: number;
  vacationDays: number;
  vacationStartDate?: Date;
  vacationEndDate?: Date;
  disabilityStartDate?: Date;
  disabilityEndDate?: Date;
  bonus: number;
  transportAllowance: number;
  recordDate: Date;
}
