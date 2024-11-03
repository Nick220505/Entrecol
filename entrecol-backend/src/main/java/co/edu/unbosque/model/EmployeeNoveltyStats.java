package co.edu.unbosque.model;

import java.math.BigDecimal;
import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "employee_novelty_stats")
public class EmployeeNoveltyStats {
    @Id
    @Column(name = "employee_id")
    private Long employeeId;

    @Column(name = "full_name")
    private String fullName;

    private String code;

    @Column(name = "department_id")
    private Long departmentId;

    @Column(name = "department_name")
    private String departmentName;

    @Column(name = "position_id")
    private Long positionId;

    @Column(name = "position_name")
    private String positionName;

    @Column(name = "record_date")
    private Date recordDate;

    @Column(name = "disability_record")
    private Boolean disabilityRecord;

    @Column(name = "vacation_record")
    private Boolean vacationRecord;

    @Column(name = "disability_days")
    private Integer disabilityDays;

    @Column(name = "vacation_days")
    private Integer vacationDays;

    @Column(name = "disability_start_date")
    private Date disabilityStartDate;

    @Column(name = "disability_end_date")
    private Date disabilityEndDate;

    @Column(name = "vacation_start_date")
    private Date vacationStartDate;

    @Column(name = "vacation_end_date")
    private Date vacationEndDate;

    private BigDecimal bonus;

    @Column(name = "transport_allowance")
    private BigDecimal transportAllowance;

    @Column(name = "has_novelty")
    private Boolean hasNovelty;
}