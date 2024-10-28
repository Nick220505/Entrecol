package co.edu.unbosque.controller;

import java.util.Date;
import java.util.Map;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import co.edu.unbosque.service.EmployeeService;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {
    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllEmployees(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "asc") String sort) {
        return ResponseEntity.ok(employeeService.getAllEmployees(page, size, sort));
    }

    @GetMapping("/department/{departmentId}")
    public ResponseEntity<Map<String, Object>> getEmployeesByDepartment(
            @PathVariable Long departmentId,
            @RequestParam(defaultValue = "asc") String sort) {
        return ResponseEntity.ok(employeeService.getEmployeesByDepartment(departmentId, sort));
    }

    @GetMapping("/department/{departmentId}/position/{positionId}")
    public ResponseEntity<Map<String, Object>> getEmployeesByDepartmentAndPosition(
            @PathVariable Long departmentId,
            @PathVariable Long positionId,
            @RequestParam(defaultValue = "asc") String sort) {
        return ResponseEntity.ok(employeeService.getEmployeesByDepartmentAndPosition(departmentId, positionId, sort));
    }

    @GetMapping("/statistics/department")
    public ResponseEntity<Map<String, Long>> getEmployeeCountByDepartment() {
        return ResponseEntity.ok(employeeService.getEmployeeCountByDepartment());
    }

    @GetMapping("/statistics/department/position")
    public ResponseEntity<Map<String, Map<String, Long>>> getEmployeeCountByDepartmentAndPosition() {
        return ResponseEntity.ok(employeeService.getEmployeeCountByDepartmentAndPosition());
    }

    @GetMapping("/statistics/eps")
    public ResponseEntity<Map<String, Long>> getEmployeeCountByEPS() {
        return ResponseEntity.ok(employeeService.getEmployeeCountByEPS());
    }

    @GetMapping("/statistics/pension")
    public ResponseEntity<Map<String, Long>> getEmployeeCountByPensionFund() {
        return ResponseEntity.ok(employeeService.getEmployeeCountByPensionFund());
    }

    @GetMapping("/statistics/eps/department")
    public ResponseEntity<Map<String, Map<String, Long>>> getEmployeeCountByEPSAndDepartment() {
        return ResponseEntity.ok(employeeService.getEmployeeCountByEPSAndDepartment());
    }

    @GetMapping("/statistics/pension/department")
    public ResponseEntity<Map<String, Map<String, Long>>> getEmployeeCountByPensionFundAndDepartment() {
        return ResponseEntity.ok(employeeService.getEmployeeCountByPensionFundAndDepartment());
    }

    @GetMapping("/{id}/records")
    public ResponseEntity<Map<String, Object>> getEmployeeRecords(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(pattern = "MM/yyyy") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "MM/yyyy") Date endDate) {
        return ResponseEntity.ok(employeeService.getEmployeeRecords(id, startDate, endDate));
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadEmployees(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(employeeService.processEmployeeUpload(file));
    }

    @GetMapping("/records")
    public ResponseEntity<Map<String, Object>> getEmployeeRecordsByDateRange(
            @RequestParam @DateTimeFormat(pattern = "MM/yyyy") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "MM/yyyy") Date endDate) {
        return ResponseEntity.ok(employeeService.getEmployeeRecordsByDateRange(startDate, endDate));
    }

    @GetMapping("/records/statistics")
    public ResponseEntity<Map<String, Object>> getEmployeeRecordsStatistics(
            @RequestParam @DateTimeFormat(pattern = "MM/yyyy") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "MM/yyyy") Date endDate) {
        return ResponseEntity.ok(employeeService.getEmployeeRecordsStatistics(startDate, endDate));
    }
}
