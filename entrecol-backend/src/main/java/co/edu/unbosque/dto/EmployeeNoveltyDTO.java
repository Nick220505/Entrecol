package co.edu.unbosque.dto;

import java.math.BigDecimal;
import java.util.Date;

import lombok.Data;

@Data
public class EmployeeNoveltyDTO {
    private Long employeeId;
    private String fullName;
    private String code;
    private String departmentName;
    private String positionName;
    private Boolean disabilityRecord;
    private Boolean vacationRecord;
    private Integer disabilityDays;
    private Integer vacationDays;
    private Date disabilityStartDate;
    private Date disabilityEndDate;
    private Date vacationStartDate;
    private Date vacationEndDate;
    private BigDecimal bonus;
    private BigDecimal transportAllowance;
    private Date recordDate;
}