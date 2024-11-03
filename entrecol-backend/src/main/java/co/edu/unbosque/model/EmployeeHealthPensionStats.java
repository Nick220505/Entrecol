package co.edu.unbosque.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "employee_health_pension_stats")
public class EmployeeHealthPensionStats {
    @Id
    @Column(name = "code")
    private String code;

    @Column(name = "department_name")
    private String departmentName;

    @Column(name = "eps_id")
    private Long epsId;

    @Column(name = "eps_name")
    private String epsName;

    @Column(name = "pension_fund_id")
    private Long pensionFundId;

    @Column(name = "pension_fund_name")
    private String pensionFundName;

    @Column(name = "position_name")
    private String positionName;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "eps_count")
    private Long epsCount;

    @Column(name = "pension_fund_count")
    private Long pensionFundCount;

    @Column(name = "eps_department_count")
    private Long epsDepartmentCount;

    @Column(name = "pension_fund_department_count")
    private Long pensionFundDepartmentCount;
}