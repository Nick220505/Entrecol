package co.edu.unbosque.service;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import co.edu.unbosque.model.ARL;
import co.edu.unbosque.model.Department;
import co.edu.unbosque.model.EPS;
import co.edu.unbosque.model.Employee;
import co.edu.unbosque.model.EmployeeRecord;
import co.edu.unbosque.model.PensionFund;
import co.edu.unbosque.model.Position;
import co.edu.unbosque.repository.ARLRepository;
import co.edu.unbosque.repository.DepartmentRepository;
import co.edu.unbosque.repository.EPSRepository;
import co.edu.unbosque.repository.EmployeeRecordRepository;
import co.edu.unbosque.repository.EmployeeRepository;
import co.edu.unbosque.repository.PensionFundRepository;
import co.edu.unbosque.repository.PositionRepository;

@Service
public class EmployeeService {
    private final EmployeeRepository employeeRepository;
    private final EmployeeRecordRepository employeeRecordRepository;
    private final DepartmentRepository departmentRepository;
    private final PositionRepository positionRepository;
    private final EPSRepository epsRepository;
    private final ARLRepository arlRepository;
    private final PensionFundRepository pensionFundRepository;

    public EmployeeService(
            EmployeeRepository employeeRepository,
            EmployeeRecordRepository employeeRecordRepository,
            DepartmentRepository departmentRepository,
            PositionRepository positionRepository,
            EPSRepository epsRepository,
            ARLRepository arlRepository,
            PensionFundRepository pensionFundRepository) {
        this.employeeRepository = employeeRepository;
        this.employeeRecordRepository = employeeRecordRepository;
        this.departmentRepository = departmentRepository;
        this.positionRepository = positionRepository;
        this.epsRepository = epsRepository;
        this.arlRepository = arlRepository;
        this.pensionFundRepository = pensionFundRepository;
    }

    public Map<String, Object> getAllEmployees(int page, int size, String sort) {
        Page<Employee> employeePage = employeeRepository.findAll(
                PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(sort), "fullName")));

        Map<String, Object> response = new HashMap<>();
        response.put("content", employeePage.getContent());
        response.put("currentPage", employeePage.getNumber());
        response.put("totalItems", employeePage.getTotalElements());
        response.put("totalPages", employeePage.getTotalPages());

        return response;
    }

    public Map<String, Object> getEmployeesByDepartment(Long departmentId, String sort) {
        List<Employee> employees = employeeRepository.findByDepartmentId(departmentId);
        if (sort.equalsIgnoreCase("desc")) {
            employees = employees.stream()
                    .sorted((e1, e2) -> e2.getFullName().compareTo(e1.getFullName()))
                    .collect(Collectors.toList());
        } else {
            employees = employees.stream()
                    .sorted((e1, e2) -> e1.getFullName().compareTo(e2.getFullName()))
                    .collect(Collectors.toList());
        }

        Map<String, Object> response = new HashMap<>();
        response.put("employees", employees);
        response.put("count", employees.size());
        return response;
    }

    public Map<String, Object> getEmployeesByDepartmentAndPosition(Long departmentId, Long positionId, String sort) {
        List<Employee> employees = employeeRepository.findByDepartmentAndPosition(departmentId, positionId);
        if (sort.equalsIgnoreCase("desc")) {
            employees = employees.stream()
                    .sorted((e1, e2) -> e2.getFullName().compareTo(e1.getFullName()))
                    .collect(Collectors.toList());
        } else {
            employees = employees.stream()
                    .sorted((e1, e2) -> e1.getFullName().compareTo(e2.getFullName()))
                    .collect(Collectors.toList());
        }

        Map<String, Object> response = new HashMap<>();
        response.put("employees", employees);
        response.put("count", employees.size());
        return response;
    }

    public Map<String, Long> getEmployeeCountByDepartment() {
        Map<String, Long> counts = new HashMap<>();
        departmentRepository.findAll().forEach(department -> {
            counts.put(department.getName(), employeeRepository.countByDepartmentId(department.getId()));
        });
        return counts;
    }

    public Map<String, Map<String, Long>> getEmployeeCountByDepartmentAndPosition() {
        Map<String, Map<String, Long>> counts = new HashMap<>();
        departmentRepository.findAll().forEach(department -> {
            Map<String, Long> positionCounts = new HashMap<>();
            positionRepository.findAll().forEach(position -> {
                positionCounts.put(position.getName(),
                        employeeRepository.countByDepartmentAndPosition(department.getId(), position.getId()));
            });
            counts.put(department.getName(), positionCounts);
        });
        return counts;
    }

    public Map<String, Long> getEmployeeCountByEPS() {
        Map<String, Long> counts = new HashMap<>();
        epsRepository.findAll().forEach(eps -> {
            counts.put(eps.getName(),
                    employeeRepository.findByEpsId(eps.getId(), PageRequest.of(0, Integer.MAX_VALUE))
                            .getTotalElements());
        });
        return counts;
    }

    public Map<String, Long> getEmployeeCountByPensionFund() {
        Map<String, Long> counts = new HashMap<>();
        pensionFundRepository.findAll().forEach(pensionFund -> {
            counts.put(pensionFund.getName(), employeeRepository
                    .findByPensionFundId(pensionFund.getId(), PageRequest.of(0, Integer.MAX_VALUE)).getTotalElements());
        });
        return counts;
    }

    public Map<String, Map<String, Long>> getEmployeeCountByEPSAndDepartment() {
        Map<String, Map<String, Long>> counts = new HashMap<>();
        departmentRepository.findAll().forEach(department -> {
            Map<String, Long> epsCounts = new HashMap<>();
            epsRepository.findAll().forEach(eps -> {
                epsCounts.put(eps.getName(), employeeRepository
                        .findByEpsId(eps.getId(), PageRequest.of(0, Integer.MAX_VALUE)).getTotalElements());
            });
            counts.put(department.getName(), epsCounts);
        });
        return counts;
    }

    public Map<String, Map<String, Long>> getEmployeeCountByPensionFundAndDepartment() {
        Map<String, Map<String, Long>> counts = new HashMap<>();
        departmentRepository.findAll().forEach(department -> {
            Map<String, Long> pensionCounts = new HashMap<>();
            pensionFundRepository.findAll().forEach(pensionFund -> {
                pensionCounts.put(pensionFund.getName(), employeeRepository
                        .findByPensionFundId(pensionFund.getId(), PageRequest.of(0, Integer.MAX_VALUE))
                        .getTotalElements());
            });
            counts.put(department.getName(), pensionCounts);
        });
        return counts;
    }

    public Map<String, Object> getEmployeeRecords(Long employeeId, Date startDate, Date endDate) {
        List<EmployeeRecord> records = employeeRecordRepository.findByEmployeeAndDateRange(employeeId, startDate,
                endDate);
        Map<String, Object> response = new HashMap<>();
        response.put("records", records);
        return response;
    }

    @Transactional
    public Map<String, Object> processEmployeeUpload(MultipartFile file) {
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            // Process employee data from first sheet
            Sheet employeeSheet = workbook.getSheetAt(0);
            Map<String, Employee> processedEmployees = processEmployeeSheet(employeeSheet);

            // Process employee records from second sheet
            Sheet recordSheet = workbook.getSheetAt(1);
            int processedRecords = processEmployeeRecordSheet(recordSheet, processedEmployees);

            Map<String, Object> response = new HashMap<>();
            response.put("message", String.format("Successfully processed %d employees and %d records",
                    processedEmployees.size(), processedRecords));
            response.put("processedEmployees", processedEmployees.size());
            response.put("processedRecords", processedRecords);
            return response;

        } catch (IOException e) {
            throw new RuntimeException("Failed to process employee upload: " + e.getMessage());
        }
    }

    public Map<String, Object> getEmployeeRecordsByDateRange(Date startDate, Date endDate) {
        List<EmployeeRecord> records = employeeRecordRepository.findByDateRange(startDate, endDate);
        Map<String, Object> response = new HashMap<>();
        response.put("records", records);
        return response;
    }

    public Map<String, Object> getEmployeeRecordsStatistics(Date startDate, Date endDate) {
        Map<String, Object> statistics = new HashMap<>();

        departmentRepository.findAll().forEach(department -> {
            Long count = employeeRecordRepository.countByDepartmentAndDateRange(department.getId(), startDate, endDate);
            statistics.put(department.getName(), count);

            Map<String, Long> positionStats = new HashMap<>();
            positionRepository.findAll().forEach(position -> {
                Long positionCount = employeeRecordRepository.countByPositionAndDateRange(position.getId(), startDate,
                        endDate);
                positionStats.put(position.getName(), positionCount);
            });
            statistics.put(department.getName() + "_positions", positionStats);
        });

        return statistics;
    }

    private Map<String, Employee> processEmployeeSheet(Sheet sheet) {
        Map<String, Employee> processedEmployees = new HashMap<>();

        for (Row row : sheet) {
            if (row.getRowNum() == 0)
                continue; // Skip header row

            String code = row.getCell(0).getStringCellValue();
            if (employeeRepository.existsByCode(code)) {
                continue; // Skip existing employees
            }

            Employee employee = new Employee();
            employee.setCode(code);
            employee.setFullName(row.getCell(1).getStringCellValue());

            // Process Department
            String departmentName = row.getCell(2).getStringCellValue();
            Department department = departmentRepository.findByName(departmentName)
                    .orElseGet(() -> {
                        Department newDepartment = new Department();
                        newDepartment.setName(departmentName);
                        return departmentRepository.save(newDepartment);
                    });
            employee.setDepartment(department);

            // Process Position
            String positionName = row.getCell(3).getStringCellValue();
            Position position = positionRepository.findByName(positionName)
                    .orElseGet(() -> {
                        Position newPosition = new Position();
                        newPosition.setName(positionName);
                        return positionRepository.save(newPosition);
                    });
            employee.setPosition(position);

            // Process hire date
            employee.setHireDate(row.getCell(4).getDateCellValue());

            // Process EPS
            String epsName = row.getCell(5).getStringCellValue();
            EPS eps = epsRepository.findByName(epsName)
                    .orElseGet(() -> {
                        EPS newEps = new EPS();
                        newEps.setName(epsName);
                        return epsRepository.save(newEps);
                    });
            employee.setEps(eps);

            // Process ARL
            String arlName = row.getCell(6).getStringCellValue();
            ARL arl = arlRepository.findByName(arlName)
                    .orElseGet(() -> {
                        ARL newArl = new ARL();
                        newArl.setName(arlName);
                        return arlRepository.save(newArl);
                    });
            employee.setArl(arl);

            // Process Pension Fund
            String pensionName = row.getCell(7).getStringCellValue();
            PensionFund pensionFund = pensionFundRepository.findByName(pensionName)
                    .orElseGet(() -> {
                        PensionFund newPensionFund = new PensionFund();
                        newPensionFund.setName(pensionName);
                        return pensionFundRepository.save(newPensionFund);
                    });
            employee.setPensionFund(pensionFund);

            // Process salary
            employee.setSalary(BigDecimal.valueOf(row.getCell(8).getNumericCellValue()));

            Employee savedEmployee = employeeRepository.save(employee);
            processedEmployees.put(code, savedEmployee);
        }

        return processedEmployees;
    }

    private int processEmployeeRecordSheet(Sheet sheet, Map<String, Employee> employees) {
        int processedRecords = 0;

        for (Row row : sheet) {
            if (row.getRowNum() == 0)
                continue; // Skip header row

            String employeeCode = row.getCell(0).getStringCellValue();
            Employee employee = employees.get(employeeCode);
            if (employee == null)
                continue; // Skip records for non-existent employees

            EmployeeRecord record = new EmployeeRecord();
            record.setEmployee(employee);

            // Process disability record
            Cell disabilityCell = row.getCell(1);
            record.setDisabilityRecord(disabilityCell != null && !disabilityCell.getStringCellValue().isEmpty());

            // Process vacation record
            Cell vacationCell = row.getCell(2);
            record.setVacationRecord(vacationCell != null && !vacationCell.getStringCellValue().isEmpty());

            // Process worked days
            record.setWorkedDays((int) row.getCell(3).getNumericCellValue());

            // Process disability days
            record.setDisabilityDays((int) row.getCell(4).getNumericCellValue());

            // Process vacation days
            record.setVacationDays((int) row.getCell(5).getNumericCellValue());

            // Process dates
            Cell vacationStartCell = row.getCell(6);
            if (vacationStartCell != null && vacationStartCell.getCellType() != CellType.BLANK) {
                record.setVacationStartDate(vacationStartCell.getDateCellValue());
            }

            Cell vacationEndCell = row.getCell(7);
            if (vacationEndCell != null && vacationEndCell.getCellType() != CellType.BLANK) {
                record.setVacationEndDate(vacationEndCell.getDateCellValue());
            }

            Cell disabilityStartCell = row.getCell(8);
            if (disabilityStartCell != null && disabilityStartCell.getCellType() != CellType.BLANK) {
                record.setDisabilityStartDate(disabilityStartCell.getDateCellValue());
            }

            Cell disabilityEndCell = row.getCell(9);
            if (disabilityEndCell != null && disabilityEndCell.getCellType() != CellType.BLANK) {
                record.setDisabilityEndDate(disabilityEndCell.getDateCellValue());
            }

            // Process bonus and transport allowance
            record.setBonus(BigDecimal.valueOf(row.getCell(10).getNumericCellValue()));
            record.setTransportAllowance(BigDecimal.valueOf(row.getCell(11).getNumericCellValue()));

            // Set record date
            record.setRecordDate(new Date()); // Or extract from filename/metadata if needed

            employeeRecordRepository.save(record);
            processedRecords++;
        }

        return processedRecords;
    }
}
