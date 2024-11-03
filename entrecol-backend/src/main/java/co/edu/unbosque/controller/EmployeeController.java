package co.edu.unbosque.controller;

import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import co.edu.unbosque.dto.EmployeePersonalInfoDTO;
import co.edu.unbosque.dto.HealthPensionReportDTO;
import co.edu.unbosque.dto.NoveltyReportDTO;
import co.edu.unbosque.model.Employee;
import co.edu.unbosque.service.EmployeeService;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {
    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping
    public ResponseEntity<List<Employee>> getAllEmployees() {
        return ResponseEntity.ok(employeeService.getAllEmployees());
    }

    @GetMapping("/department/{id}")
    public ResponseEntity<Map<String, Object>> getEmployeesByDepartment(
            @PathVariable Long id,
            @RequestParam(defaultValue = "asc") String sort) {
        return ResponseEntity.ok(employeeService.getEmployeesByDepartment(id, sort));
    }

    @GetMapping("/department/{departmentId}/position/{positionId}")
    public ResponseEntity<Map<String, Object>> getEmployeesByDepartmentAndPosition(
            @PathVariable Long departmentId,
            @PathVariable Long positionId,
            @RequestParam(defaultValue = "asc") String sort) {
        return ResponseEntity.ok(employeeService.getEmployeesByDepartmentAndPosition(departmentId, positionId, sort));
    }

    @GetMapping("/count/department")
    public ResponseEntity<Map<String, Long>> getEmployeeCountByDepartment() {
        return ResponseEntity.ok(employeeService.getEmployeeCountByDepartment());
    }

    @GetMapping("/count/department/position")
    public ResponseEntity<Map<String, Map<String, Long>>> getEmployeeCountByDepartmentAndPosition() {
        return ResponseEntity.ok(employeeService.getEmployeeCountByDepartmentAndPosition());
    }

    @GetMapping("/count/eps")
    public ResponseEntity<Map<String, Long>> getEmployeeCountByEPS() {
        return ResponseEntity.ok(employeeService.getEmployeeCountByEPS());
    }

    @GetMapping("/count/pension-fund")
    public ResponseEntity<Map<String, Long>> getEmployeeCountByPensionFund() {
        return ResponseEntity.ok(employeeService.getEmployeeCountByPensionFund());
    }

    @GetMapping("/records/{id}")
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

    @GetMapping("/report")
    public ResponseEntity<Map<String, Object>> getEmployeeReport() {
        try {
            Map<String, Object> report = employeeService.getEmployeeReport();
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    @GetMapping("/export/pdf")
    public ResponseEntity<byte[]> exportPdf() {
        try {
            List<Employee> employees = employeeService.getAllEmployees();
            byte[] pdfBytes = employeeService.generatePayrollPdf(employees);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("filename", "nomina.pdf");

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/{id}/personal-info")
    public ResponseEntity<EmployeePersonalInfoDTO> getEmployeePersonalInfo(@PathVariable Long id) {
        return ResponseEntity.ok(employeeService.getEmployeePersonalInfo(id));
    }

    @GetMapping("/{id}/personal-info/export/pdf")
    public ResponseEntity<byte[]> exportPersonalInfoPdf(@PathVariable Long id) {
        try {
            byte[] pdfBytes = employeeService.generatePersonalInfoPdf(id);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("filename", "informacion-personal.pdf");

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/health-pension-report")
    public ResponseEntity<Map<String, Object>> getHealthPensionReport() {
        try {
            HealthPensionReportDTO report = employeeService.getHealthPensionReport();
            return ResponseEntity.ok(Map.of("data", report));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    @GetMapping("/health-pension-report/export/pdf")
    public ResponseEntity<byte[]> exportHealthPensionReportPdf() {
        try {
            byte[] pdfBytes = employeeService.generateHealthPensionReportPdf();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("filename", "reporte-salud-pension.pdf");

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/eps-frequency")
    public ResponseEntity<Map<String, Object>> getEpsFrequency() {
        try {
            Map<String, Long> epsCounts = employeeService.getEpsFrequency();
            return ResponseEntity.ok(Map.of("data", epsCounts));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    @GetMapping("/pension-frequency")
    public ResponseEntity<Map<String, Object>> getPensionFrequency() {
        try {
            Map<String, Long> pensionCounts = employeeService.getPensionFrequency();
            return ResponseEntity.ok(Map.of("data", pensionCounts));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    @GetMapping("/novelty-report")
    public ResponseEntity<Map<String, Object>> getNoveltyReport(
            @RequestParam @DateTimeFormat(pattern = "MM/yyyy") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "MM/yyyy") Date endDate) {
        try {
            NoveltyReportDTO report = employeeService.getNoveltyReport(startDate, endDate);
            return ResponseEntity.ok(Map.of("data", report));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    @GetMapping("/novelty-report/export/pdf")
    public ResponseEntity<byte[]> exportNoveltyReportPdf(
            @RequestParam @DateTimeFormat(pattern = "MM/yyyy") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "MM/yyyy") Date endDate) {
        try {
            byte[] pdfBytes = employeeService.generateNoveltyReportPdf(startDate, endDate);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("filename", "reporte-novedades.pdf");

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
