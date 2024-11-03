package co.edu.unbosque.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import co.edu.unbosque.model.EmployeeNoveltyStats;

public interface EmployeeNoveltyStatsRepository extends JpaRepository<EmployeeNoveltyStats, Long> {
    @Query("SELECT e FROM EmployeeNoveltyStats e WHERE " +
            "((e.disabilityRecord = true AND " +
            "((e.disabilityStartDate BETWEEN :startDate AND :endDate) OR " +
            "(e.disabilityEndDate BETWEEN :startDate AND :endDate) OR " +
            "(e.disabilityStartDate <= :startDate AND e.disabilityEndDate >= :endDate))) OR " +
            "(e.vacationRecord = true AND " +
            "((e.vacationStartDate BETWEEN :startDate AND :endDate) OR " +
            "(e.vacationEndDate BETWEEN :startDate AND :endDate) OR " +
            "(e.vacationStartDate <= :startDate AND e.vacationEndDate >= :endDate))))")
    List<EmployeeNoveltyStats> findNoveltyStatsByDateRange(
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate);

    @Query("SELECT COUNT(DISTINCT e.employeeId) FROM EmployeeNoveltyStats e WHERE " +
            "e.departmentId = :departmentId AND " +
            "((e.disabilityRecord = true AND " +
            "((e.disabilityStartDate BETWEEN :startDate AND :endDate) OR " +
            "(e.disabilityEndDate BETWEEN :startDate AND :endDate) OR " +
            "(e.disabilityStartDate <= :startDate AND e.disabilityEndDate >= :endDate))) OR " +
            "(e.vacationRecord = true AND " +
            "((e.vacationStartDate BETWEEN :startDate AND :endDate) OR " +
            "(e.vacationEndDate BETWEEN :startDate AND :endDate) OR " +
            "(e.vacationStartDate <= :startDate AND e.vacationEndDate >= :endDate))))")
    Long countNoveltyByDepartmentAndDateRange(
            @Param("departmentId") Long departmentId,
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate);

    @Query("SELECT COUNT(DISTINCT e.employeeId) FROM EmployeeNoveltyStats e WHERE " +
            "e.departmentId = :departmentId AND e.positionId = :positionId AND " +
            "((e.disabilityRecord = true AND " +
            "((e.disabilityStartDate BETWEEN :startDate AND :endDate) OR " +
            "(e.disabilityEndDate BETWEEN :startDate AND :endDate) OR " +
            "(e.disabilityStartDate <= :startDate AND e.disabilityEndDate >= :endDate))) OR " +
            "(e.vacationRecord = true AND " +
            "((e.vacationStartDate BETWEEN :startDate AND :endDate) OR " +
            "(e.vacationEndDate BETWEEN :startDate AND :endDate) OR " +
            "(e.vacationStartDate <= :startDate AND e.vacationEndDate >= :endDate))))")
    Long countNoveltyByDepartmentPositionAndDateRange(
            @Param("departmentId") Long departmentId,
            @Param("positionId") Long positionId,
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate);
}