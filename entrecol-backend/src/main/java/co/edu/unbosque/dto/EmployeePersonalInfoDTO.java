package co.edu.unbosque.dto;

import java.math.BigDecimal;
import java.util.Date;

import lombok.Data;

@Data
public class EmployeePersonalInfoDTO {
    private Long id;
    private String fullName;
    private String code;
    private String departmentName;
    private String positionName;
    private Date hireDate;
    private String epsName;
    private String pensionFundName;
    private BigDecimal salary;
    private Boolean disabilityRecord;
    private Boolean vacationRecord;
    private Integer workedDays;
    private Integer disabilityDays;
    private Integer vacationDays;
    private Date vacationStartDate;
    private Date vacationEndDate;
    private Date disabilityStartDate;
    private Date disabilityEndDate;
    private BigDecimal bonus;
    private BigDecimal transportAllowance;
    private Date recordDate;
}