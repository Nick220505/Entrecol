export interface Department {
  id: number;
  name: string;
}

export interface Position {
  id: number;
  name: string;
}

export interface EPS {
  id: number;
  name: string;
}

export interface ARL {
  id: number;
  name: string;
}

export interface PensionFund {
  id: number;
  name: string;
}

export interface Employee {
  id: number;
  code: string;
  fullName: string;
  department: Department;
  position: Position;
  hireDate: Date;
  eps: EPS;
  arl: ARL;
  pensionFund: PensionFund;
  salary: number;
}

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
