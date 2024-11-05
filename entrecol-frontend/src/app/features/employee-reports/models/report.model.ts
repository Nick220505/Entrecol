import { Employee } from './payroll.model';

export interface EmployeeReport {
  totalEmployees: number;
  employees: Employee[];
  departmentStats: Record<string, number>;
  departmentPositionStats: Record<string, Record<string, number>>;
}
