package co.edu.unbosque.model;

import java.math.BigDecimal;
import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.Data;

@Data
@Entity
@Table(name = "employee_record")
public class EmployeeRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "disability_record")
    private Boolean disabilityRecord = false;

    @Column(name = "vacation_record")
    private Boolean vacationRecord = false;

    @Column(name = "worked_days", nullable = false)
    private Integer workedDays;

    @Column(name = "disability_days")
    private Integer disabilityDays = 0;

    @Column(name = "vacation_days")
    private Integer vacationDays = 0;

    @Temporal(TemporalType.DATE)
    @Column(name = "vacation_start_date")
    private Date vacationStartDate;

    @Temporal(TemporalType.DATE)
    @Column(name = "vacation_end_date")
    private Date vacationEndDate;

    @Temporal(TemporalType.DATE)
    @Column(name = "disability_start_date")
    private Date disabilityStartDate;

    @Temporal(TemporalType.DATE)
    @Column(name = "disability_end_date")
    private Date disabilityEndDate;

    @Column
    private BigDecimal bonus = BigDecimal.ZERO;

    @Column(name = "transport_allowance")
    private BigDecimal transportAllowance = BigDecimal.ZERO;

    @Temporal(TemporalType.DATE)
    @Column(name = "record_date", nullable = false)
    private Date recordDate;
}
