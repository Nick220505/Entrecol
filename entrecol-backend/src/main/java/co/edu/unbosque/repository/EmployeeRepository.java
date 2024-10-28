package co.edu.unbosque.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import co.edu.unbosque.model.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    boolean existsByCode(String code);

    @Query("SELECT e FROM Employee e WHERE e.department.id = :departmentId")
    List<Employee> findByDepartmentId(@Param("departmentId") Long departmentId);

    @Query("SELECT e FROM Employee e WHERE e.department.id = :departmentId AND e.position.id = :positionId")
    List<Employee> findByDepartmentAndPosition(
            @Param("departmentId") Long departmentId,
            @Param("positionId") Long positionId);

    @Query("SELECT e FROM Employee e WHERE e.eps.id = :epsId")
    Page<Employee> findByEpsId(@Param("epsId") Long epsId, Pageable pageable);

    @Query("SELECT e FROM Employee e WHERE e.pensionFund.id = :pensionFundId")
    Page<Employee> findByPensionFundId(@Param("pensionFundId") Long pensionFundId, Pageable pageable);

    @Query("SELECT COUNT(e) FROM Employee e WHERE e.department.id = :departmentId")
    Long countByDepartmentId(@Param("departmentId") Long departmentId);

    @Query("SELECT COUNT(e) FROM Employee e WHERE e.department.id = :departmentId AND e.position.id = :positionId")
    Long countByDepartmentAndPosition(
            @Param("departmentId") Long departmentId,
            @Param("positionId") Long positionId);
}
