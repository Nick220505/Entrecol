package co.edu.unbosque.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import co.edu.unbosque.model.EmployeeNoveltyStats;

public interface EmployeeNoveltyStatsRepository extends JpaRepository<EmployeeNoveltyStats, Long> {
    @Query("SELECT e FROM EmployeeNoveltyStats e WHERE e.recordDate BETWEEN :startDate AND :endDate " +
            "AND (e.disabilityRecord = true OR e.vacationRecord = true)")
    List<EmployeeNoveltyStats> findNoveltyStatsByDateRange(
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate);

    @Query("SELECT COUNT(DISTINCT e.employeeId) FROM EmployeeNoveltyStats e " +
            "WHERE e.departmentId = :departmentId AND e.recordDate BETWEEN :startDate AND :endDate " +
            "AND (e.disabilityRecord = true OR e.vacationRecord = true)")
    Long countNoveltyByDepartmentAndDateRange(
            @Param("departmentId") Long departmentId,
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate);

    @Query("SELECT COUNT(DISTINCT e.employeeId) FROM EmployeeNoveltyStats e " +
            "WHERE e.departmentId = :departmentId AND e.positionId = :positionId " +
            "AND e.recordDate BETWEEN :startDate AND :endDate " +
            "AND (e.disabilityRecord = true OR e.vacationRecord = true)")
    Long countNoveltyByDepartmentPositionAndDateRange(
            @Param("departmentId") Long departmentId,
            @Param("positionId") Long positionId,
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate);
}