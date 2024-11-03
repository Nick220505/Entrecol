package co.edu.unbosque.dto;

import lombok.Data;

@Data
public class EmployeeHealthPensionStatsDTO {
    private String departmentName;
    private Long epsId;
    private String epsName;
    private Long pensionFundId;
    private String pensionFundName;
    private String positionName;
    private String fullName;
    private String code;
    private Long epsCount;
    private Long pensionFundCount;
    private Long epsDepartmentCount;
    private Long pensionFundDepartmentCount;
}