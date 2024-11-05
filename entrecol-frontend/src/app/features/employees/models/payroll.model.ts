import { ARL } from './arl.model';
import { Department } from './department.model';
import { EPS } from './eps.model';
import { PensionFund } from './pension-fund.model';
import { Position } from './position.model';

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
