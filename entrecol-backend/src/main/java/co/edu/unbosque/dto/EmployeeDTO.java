package co.edu.unbosque.dto;

import java.math.BigDecimal;
import java.util.Date;

import lombok.Data;

@Data
public class EmployeeDTO {
    private Long id;
    private String code;
    private String fullName;
    private Long departmentId;
    private Long positionId;
    private Date hireDate;
    private Long epsId;
    private Long arlId;
    private Long pensionFundId;
    private BigDecimal salary;
}