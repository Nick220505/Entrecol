package co.edu.unbosque.repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import co.edu.unbosque.model.EmployeeRecord;

public interface EmployeeRecordRepository extends JpaRepository<EmployeeRecord, Long> {
        @Query("SELECT er FROM EmployeeRecord er WHERE er.recordDate BETWEEN :startDate AND :endDate")
        List<EmployeeRecord> findByDateRange(
                        @Param("startDate") Date startDate,
                        @Param("endDate") Date endDate);

        @Query("SELECT er FROM EmployeeRecord er WHERE er.employee.id = :employeeId AND er.recordDate BETWEEN :startDate AND :endDate")
        List<EmployeeRecord> findByEmployeeAndDateRange(
                        @Param("employeeId") Long employeeId,
                        @Param("startDate") Date startDate,
                        @Param("endDate") Date endDate);

        @Query("SELECT COUNT(er) FROM EmployeeRecord er WHERE er.employee.department.id = :departmentId AND er.recordDate BETWEEN :startDate AND :endDate")
        Long countByDepartmentAndDateRange(
                        @Param("departmentId") Long departmentId,
                        @Param("startDate") Date startDate,
                        @Param("endDate") Date endDate);

        @Query("SELECT COUNT(er) FROM EmployeeRecord er WHERE er.employee.position.id = :positionId AND er.recordDate BETWEEN :startDate AND :endDate")
        Long countByPositionAndDateRange(
                        @Param("positionId") Long positionId,
                        @Param("startDate") Date startDate,
                        @Param("endDate") Date endDate);

        Optional<EmployeeRecord> findFirstByEmployeeIdOrderByRecordDateDesc(Long employeeId);
}
