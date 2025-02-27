package co.edu.unbosque.service;

import java.awt.Color;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.Calendar;
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
import org.jfree.chart.ChartFactory;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.plot.CategoryPlot;
import org.jfree.chart.plot.PiePlot;
import org.jfree.chart.plot.PlotOrientation;
import org.jfree.chart.renderer.category.BarRenderer;
import org.jfree.data.category.DefaultCategoryDataset;
import org.jfree.data.general.DefaultPieDataset;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Chunk;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.FontFactory;
import com.itextpdf.text.Image;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;

import co.edu.unbosque.dto.EmployeeDTO;
import co.edu.unbosque.dto.EmployeeNoveltyDTO;
import co.edu.unbosque.dto.EmployeePersonalInfoDTO;
import co.edu.unbosque.dto.HealthPensionReportDTO;
import co.edu.unbosque.dto.NoveltyReportDTO;
import co.edu.unbosque.model.ARL;
import co.edu.unbosque.model.Department;
import co.edu.unbosque.model.EPS;
import co.edu.unbosque.model.Employee;
import co.edu.unbosque.model.EmployeeHealthPensionStats;
import co.edu.unbosque.model.EmployeeNoveltyStats;
import co.edu.unbosque.model.EmployeeRecord;
import co.edu.unbosque.model.PensionFund;
import co.edu.unbosque.model.Position;
import co.edu.unbosque.repository.ARLRepository;
import co.edu.unbosque.repository.DepartmentRepository;
import co.edu.unbosque.repository.EPSRepository;
import co.edu.unbosque.repository.EmployeeNoveltyStatsRepository;
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
    private final EmployeeNoveltyStatsRepository employeeNoveltyStatsRepository;
    private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("dd/MM/yyyy");

    public EmployeeService(
            EmployeeRepository employeeRepository,
            EmployeeRecordRepository employeeRecordRepository,
            DepartmentRepository departmentRepository,
            PositionRepository positionRepository,
            EPSRepository epsRepository,
            ARLRepository arlRepository,
            PensionFundRepository pensionFundRepository,
            EmployeeNoveltyStatsRepository employeeNoveltyStatsRepository) {
        this.employeeRepository = employeeRepository;
        this.employeeRecordRepository = employeeRecordRepository;
        this.departmentRepository = departmentRepository;
        this.positionRepository = positionRepository;
        this.epsRepository = epsRepository;
        this.arlRepository = arlRepository;
        this.pensionFundRepository = pensionFundRepository;
        this.employeeNoveltyStatsRepository = employeeNoveltyStatsRepository;
    }

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll(Sort.by(Sort.Direction.ASC, "fullName"));
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
            Sheet employeeSheet = workbook.getSheetAt(0);
            Map<String, Employee> processedEmployees = processEmployeeSheet(employeeSheet);

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
                continue;

            try {
                Cell codeCell = row.getCell(0);
                String code;
                if (codeCell == null) {
                    throw new RuntimeException("Employee code is required");
                }

                try {
                    if (codeCell.getCellType() == CellType.NUMERIC) {
                        code = String.format("%.0f", codeCell.getNumericCellValue());
                    } else if (codeCell.getCellType() == CellType.STRING) {
                        code = codeCell.getStringCellValue();
                    } else {
                        throw new RuntimeException("Invalid employee code format");
                    }
                } catch (Exception e) {
                    throw new RuntimeException("Error processing employee code: " + e.getMessage());
                }

                if (code == null || code.trim().isEmpty()) {
                    throw new RuntimeException("Employee code cannot be empty");
                }

                if (employeeRepository.existsByCode(code)) {
                    continue;
                }

                Employee employee = new Employee();
                employee.setCode(code);
                employee.setFullName(row.getCell(1).getStringCellValue());

                String departmentName = row.getCell(2).getStringCellValue();
                Department department = departmentRepository.findByName(departmentName)
                        .orElseGet(() -> {
                            Department newDepartment = new Department();
                            newDepartment.setName(departmentName);
                            return departmentRepository.save(newDepartment);
                        });
                employee.setDepartment(department);

                String positionName = row.getCell(3).getStringCellValue();
                Position position = positionRepository.findByName(positionName)
                        .orElseGet(() -> {
                            Position newPosition = new Position();
                            newPosition.setName(positionName);
                            return positionRepository.save(newPosition);
                        });
                employee.setPosition(position);

                Cell hireDateCell = row.getCell(4);
                if (hireDateCell != null) {
                    try {
                        if (hireDateCell.getCellType() == CellType.NUMERIC) {
                            String dateStr = String.valueOf((long) hireDateCell.getNumericCellValue());

                            int year = Integer.parseInt(dateStr.substring(0, 4));
                            int month = Integer.parseInt(dateStr.substring(4, 6));
                            int day = Integer.parseInt(dateStr.substring(6));

                            Calendar calendar = Calendar.getInstance();
                            calendar.set(year, month - 1, day);
                            Date hireDate = calendar.getTime();

                            employee.setHireDate(hireDate);
                        } else if (hireDateCell.getCellType() == CellType.STRING) {
                            String dateStr = hireDateCell.getStringCellValue();

                            try {
                                SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
                                Date parsedDate = sdf.parse(dateStr);
                                employee.setHireDate(parsedDate);
                            } catch (Exception e1) {
                                try {
                                    SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy");
                                    Date parsedDate = sdf.parse(dateStr);
                                    employee.setHireDate(parsedDate);
                                } catch (Exception e2) {
                                    throw new RuntimeException("Invalid date format. Expected YYYYMMDD or DD/MM/YYYY");
                                }
                            }
                        } else {
                            throw new RuntimeException("Invalid hire date cell type for employee code: " + code);
                        }
                    } catch (Exception e) {
                        throw new RuntimeException("Invalid date format in hire date for employee code: " + code
                                + ". Error: " + e.getMessage());
                    }
                } else {
                    throw new RuntimeException("Hire date is required for employee code: " + code);
                }

                String epsName = row.getCell(5).getStringCellValue();
                EPS eps = epsRepository.findByName(epsName)
                        .orElseGet(() -> {
                            EPS newEps = new EPS();
                            newEps.setName(epsName);
                            return epsRepository.save(newEps);
                        });
                employee.setEps(eps);

                String arlName = row.getCell(6).getStringCellValue();
                ARL arl = arlRepository.findByName(arlName)
                        .orElseGet(() -> {
                            ARL newArl = new ARL();
                            newArl.setName(arlName);
                            return arlRepository.save(newArl);
                        });
                employee.setArl(arl);

                String pensionName = row.getCell(7).getStringCellValue();
                PensionFund pensionFund = pensionFundRepository.findByName(pensionName)
                        .orElseGet(() -> {
                            PensionFund newPensionFund = new PensionFund();
                            newPensionFund.setName(pensionName);
                            return pensionFundRepository.save(newPensionFund);
                        });
                employee.setPensionFund(pensionFund);

                Cell salaryCell = row.getCell(8);
                if (salaryCell != null && salaryCell.getCellType() == CellType.NUMERIC) {
                    double salaryValue = salaryCell.getNumericCellValue();
                    employee.setSalary(BigDecimal.valueOf(salaryValue));
                }

                Employee savedEmployee = employeeRepository.save(employee);
                processedEmployees.put(code, savedEmployee);

            } catch (Exception e) {
                throw new RuntimeException("Error processing row " + (row.getRowNum() + 1) + ": " + e.getMessage());
            }
        }

        return processedEmployees;
    }

    private int processEmployeeRecordSheet(Sheet sheet, Map<String, Employee> employees) {
        int processedRecords = 0;

        for (Row row : sheet) {
            if (row.getRowNum() == 0)
                continue;

            try {
                Cell codeCell = row.getCell(0);
                String employeeCode;
                if (codeCell.getCellType() == CellType.NUMERIC) {
                    employeeCode = String.format("%.0f", codeCell.getNumericCellValue());
                } else {
                    employeeCode = codeCell.getStringCellValue();
                }

                Employee employee = employees.get(employeeCode);
                if (employee == null) {
                    continue;
                }

                EmployeeRecord record = new EmployeeRecord();
                record.setEmployee(employee);

                Cell disabilityCell = row.getCell(1);
                record.setDisabilityRecord(disabilityCell != null && disabilityCell.getCellType() == CellType.STRING
                        && !disabilityCell.getStringCellValue().isEmpty());

                Cell vacationCell = row.getCell(2);
                record.setVacationRecord(vacationCell != null && vacationCell.getCellType() == CellType.STRING
                        && !vacationCell.getStringCellValue().isEmpty());

                Cell workedDaysCell = row.getCell(3);
                if (workedDaysCell != null && workedDaysCell.getCellType() == CellType.NUMERIC) {
                    record.setWorkedDays((int) workedDaysCell.getNumericCellValue());
                }

                Cell disabilityDaysCell = row.getCell(4);
                if (disabilityDaysCell != null && disabilityDaysCell.getCellType() == CellType.NUMERIC) {
                    record.setDisabilityDays((int) disabilityDaysCell.getNumericCellValue());
                }

                Cell vacationDaysCell = row.getCell(5);
                if (vacationDaysCell != null && vacationDaysCell.getCellType() == CellType.NUMERIC) {
                    record.setVacationDays((int) vacationDaysCell.getNumericCellValue());
                }

                Cell vacationStartCell = row.getCell(6);
                if (vacationStartCell != null && vacationStartCell.getCellType() == CellType.NUMERIC) {
                    double excelDate = vacationStartCell.getNumericCellValue();
                    Date javaDate = org.apache.poi.ss.usermodel.DateUtil.getJavaDate(excelDate);
                    record.setVacationStartDate(javaDate);
                }

                Cell vacationEndCell = row.getCell(7);
                if (vacationEndCell != null && vacationEndCell.getCellType() == CellType.NUMERIC) {
                    double excelDate = vacationEndCell.getNumericCellValue();
                    Date javaDate = org.apache.poi.ss.usermodel.DateUtil.getJavaDate(excelDate);
                    record.setVacationEndDate(javaDate);
                }

                Cell disabilityStartCell = row.getCell(8);
                if (disabilityStartCell != null && disabilityStartCell.getCellType() == CellType.NUMERIC) {
                    double excelDate = disabilityStartCell.getNumericCellValue();
                    Date javaDate = org.apache.poi.ss.usermodel.DateUtil.getJavaDate(excelDate);
                    record.setDisabilityStartDate(javaDate);
                }

                Cell disabilityEndCell = row.getCell(9);
                if (disabilityEndCell != null && disabilityEndCell.getCellType() == CellType.NUMERIC) {
                    double excelDate = disabilityEndCell.getNumericCellValue();
                    Date javaDate = org.apache.poi.ss.usermodel.DateUtil.getJavaDate(excelDate);
                    record.setDisabilityEndDate(javaDate);
                }

                Cell bonusCell = row.getCell(10);
                if (bonusCell != null && bonusCell.getCellType() == CellType.NUMERIC) {
                    record.setBonus(BigDecimal.valueOf(bonusCell.getNumericCellValue()));
                }

                Cell transportCell = row.getCell(11);
                if (transportCell != null && transportCell.getCellType() == CellType.NUMERIC) {
                    record.setTransportAllowance(BigDecimal.valueOf(transportCell.getNumericCellValue()));
                }

                record.setRecordDate(new Date());

                employeeRecordRepository.save(record);
                processedRecords++;

            } catch (Exception e) {
                throw new RuntimeException(
                        "Error processing record row " + (row.getRowNum() + 1) + ": " + e.getMessage());
            }
        }

        return processedRecords;
    }

    public Map<String, Object> getEmployeeReport() {
        Map<String, Object> report = new HashMap<>();
        List<Employee> allEmployees = getAllEmployeesSorted();
        report.put("totalEmployees", allEmployees.size());
        report.put("employees", allEmployees);
        report.put("departmentStats", getEmployeeCountByDepartment());
        report.put("departmentPositionStats", getEmployeeCountByDepartmentAndPosition());
        return report;
    }

    private List<Employee> getAllEmployeesSorted() {
        return employeeRepository.findAll(Sort.by(Sort.Direction.ASC, "fullName"));
    }

    public byte[] generatePayrollPdf(List<Employee> employees) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4.rotate());
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 12);

            Paragraph mainTitle = new Paragraph("Reporte de Nómina", titleFont);
            mainTitle.setAlignment(Element.ALIGN_CENTER);
            mainTitle.setSpacingAfter(20);
            document.add(mainTitle);

            Paragraph total = new Paragraph(
                    "Total de Empleados: " + employees.size(),
                    normalFont);
            total.setSpacingAfter(20);
            document.add(total);

            addEmployeeTable(document, employees);

            document.newPage();

            PdfPTable chartsTable = new PdfPTable(1);
            chartsTable.setWidthPercentage(100);

            PdfPCell titleCell = new PdfPCell(new Paragraph("Empleados por Departamento", titleFont));
            titleCell.setBorder(0);
            titleCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            titleCell.setPaddingBottom(10);
            chartsTable.addCell(titleCell);

            JFreeChart pieChart = createDepartmentPieChart();
            BufferedImage pieChartImage = pieChart.createBufferedImage(700, 400);
            Image pieChartPdfImage = Image.getInstance(pieChartImage, null);
            PdfPCell chartCell = new PdfPCell(pieChartPdfImage);
            chartCell.setBorder(0);
            chartCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            chartsTable.addCell(chartCell);

            document.add(chartsTable);

            document.newPage();

            PdfPTable barChartsTable = new PdfPTable(1);
            barChartsTable.setWidthPercentage(100);

            PdfPCell barTitleCell = new PdfPCell(new Paragraph("Empleados por Cargo y Departamento", titleFont));
            barTitleCell.setBorder(0);
            barTitleCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            barTitleCell.setPaddingBottom(10);
            barChartsTable.addCell(barTitleCell);

            JFreeChart barChart = createDepartmentPositionBarChart();
            BufferedImage barChartImage = barChart.createBufferedImage(700, 400);
            Image barChartPdfImage = Image.getInstance(barChartImage, null);
            PdfPCell barChartCell = new PdfPCell(barChartPdfImage);
            barChartCell.setBorder(0);
            barChartCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            barChartsTable.addCell(barChartCell);

            document.add(barChartsTable);

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF", e);
        }
    }

    private void addEmployeeTable(Document document, List<Employee> employees) throws DocumentException {
        PdfPTable table = new PdfPTable(9);
        table.setWidthPercentage(100);
        float[] columnWidths = { 3f, 1.5f, 2f, 2f, 2f, 1.5f, 1.5f, 2f, 2f };
        table.setWidths(columnWidths);

        String[] headers = {
                "Nombre", "Código", "Departamento", "Cargo",
                "Fecha de Ingreso", "EPS", "ARL", "Fondo de Pensión", "Salario"
        };

        Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10);
        for (String header : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(header, headerFont));
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
            cell.setPadding(5);
            table.addCell(cell);
        }

        Font dataFont = FontFactory.getFont(FontFactory.HELVETICA, 10);
        for (Employee employee : employees) {
            addCell(table, employee.getFullName(), dataFont, Element.ALIGN_LEFT);
            addCell(table, employee.getCode(), dataFont, Element.ALIGN_CENTER);
            addCell(table, employee.getDepartment().getName(), dataFont, Element.ALIGN_LEFT);
            addCell(table, employee.getPosition().getName(), dataFont, Element.ALIGN_LEFT);
            addCell(table, DATE_FORMAT.format(employee.getHireDate()), dataFont, Element.ALIGN_CENTER);
            addCell(table, employee.getEps().getName(), dataFont, Element.ALIGN_CENTER);
            addCell(table, employee.getArl().getName(), dataFont, Element.ALIGN_CENTER);
            addCell(table, employee.getPensionFund().getName(), dataFont, Element.ALIGN_CENTER);
            addCell(table, String.format("$%,d", employee.getSalary().longValue()), dataFont, Element.ALIGN_RIGHT);
        }

        document.add(table);
    }

    private JFreeChart createDepartmentPieChart() {
        DefaultPieDataset<String> dataset = new DefaultPieDataset<>();
        Map<String, Long> departmentStats = getEmployeeCountByDepartment();

        departmentStats.forEach((key, value) -> dataset.setValue(key, value.doubleValue()));

        JFreeChart chart = ChartFactory.createPieChart(
                null,
                dataset,
                true,
                true,
                false);

        @SuppressWarnings("unchecked")
        PiePlot<String> plot = (PiePlot<String>) chart.getPlot();
        plot.setBackgroundPaint(Color.WHITE);
        plot.setOutlinePaint(null);
        plot.setLabelGenerator(null);

        return chart;
    }

    private JFreeChart createDepartmentPositionBarChart() {
        DefaultCategoryDataset dataset = new DefaultCategoryDataset();
        Map<String, Map<String, Long>> stats = getEmployeeCountByDepartmentAndPosition();

        stats.forEach((department, positions) -> positions
                .forEach((position, count) -> dataset.addValue(count, position, department)));

        JFreeChart chart = ChartFactory.createBarChart(
                null,
                "Departamento",
                "Cantidad",
                dataset,
                PlotOrientation.VERTICAL,
                true,
                true,
                false);

        chart.setBackgroundPaint(Color.WHITE);
        chart.getPlot().setBackgroundPaint(Color.WHITE);

        return chart;
    }

    private void addCell(PdfPTable table, String text, Font font, int alignment) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setHorizontalAlignment(alignment);
        cell.setPadding(5);
        table.addCell(cell);
    }

    public EmployeePersonalInfoDTO getEmployeePersonalInfo(Long id) {
        return employeeRepository.findById(id)
                .map(employee -> {
                    EmployeePersonalInfoDTO dto = new EmployeePersonalInfoDTO();
                    dto.setId(employee.getId());
                    dto.setFullName(employee.getFullName());
                    dto.setCode(employee.getCode());
                    dto.setDepartmentName(employee.getDepartment().getName());
                    dto.setPositionName(employee.getPosition().getName());
                    dto.setHireDate(employee.getHireDate());
                    dto.setEpsName(employee.getEps().getName());
                    dto.setPensionFundName(employee.getPensionFund().getName());
                    dto.setSalary(employee.getSalary());

                    employeeRecordRepository.findFirstByEmployeeIdOrderByRecordDateDesc(id)
                            .ifPresent(record -> {
                                dto.setDisabilityRecord(record.getDisabilityRecord());
                                dto.setVacationRecord(record.getVacationRecord());
                                dto.setWorkedDays(record.getWorkedDays());
                                dto.setDisabilityDays(record.getDisabilityDays());
                                dto.setVacationDays(record.getVacationDays());
                                dto.setVacationStartDate(record.getVacationStartDate());
                                dto.setVacationEndDate(record.getVacationEndDate());
                                dto.setDisabilityStartDate(record.getDisabilityStartDate());
                                dto.setDisabilityEndDate(record.getDisabilityEndDate());
                                dto.setBonus(record.getBonus());
                                dto.setTransportAllowance(record.getTransportAllowance());
                                dto.setRecordDate(record.getRecordDate());
                            });

                    return dto;
                })
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));
    }

    public byte[] generatePersonalInfoPdf(Long employeeId) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Font subtitleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14);
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 12);

            EmployeePersonalInfoDTO personalInfo = getEmployeePersonalInfo(employeeId);

            Paragraph mainTitle = new Paragraph("Reporte de Información Personal", titleFont);
            mainTitle.setAlignment(Element.ALIGN_CENTER);
            mainTitle.setSpacingAfter(20);
            document.add(mainTitle);

            addSection(document, "Información Básica", subtitleFont);
            addInfoItem(document, "Nombre:", personalInfo.getFullName(), normalFont);
            addInfoItem(document, "Código:", personalInfo.getCode(), normalFont);

            addSection(document, "Información Laboral", subtitleFont);
            addInfoItem(document, "Dependencia:", personalInfo.getDepartmentName(), normalFont);
            addInfoItem(document, "Cargo:", personalInfo.getPositionName(), normalFont);
            addInfoItem(document, "Fecha de Ingreso:", DATE_FORMAT.format(personalInfo.getHireDate()), normalFont);

            addSection(document, "Información de Seguridad Social", subtitleFont);
            addInfoItem(document, "EPS:", personalInfo.getEpsName(), normalFont);
            addInfoItem(document, "Fondo de Pensión:", personalInfo.getPensionFundName(), normalFont);
            addInfoItem(document, "Salario:", String.format("$%,d", personalInfo.getSalary().longValue()), normalFont);

            addSection(document, "Novedades", subtitleFont);
            if (personalInfo.getDisabilityRecord() != null && personalInfo.getDisabilityRecord()) {
                addInfoItem(document, "Incapacidad:", personalInfo.getDisabilityDays() + " días", normalFont);
                if (personalInfo.getDisabilityStartDate() != null && personalInfo.getDisabilityEndDate() != null) {
                    addInfoItem(document, "Periodo:", String.format("%s - %s",
                            DATE_FORMAT.format(personalInfo.getDisabilityStartDate()),
                            DATE_FORMAT.format(personalInfo.getDisabilityEndDate())), normalFont);
                }
            }

            if (personalInfo.getVacationRecord() != null && personalInfo.getVacationRecord()) {
                addInfoItem(document, "Vacaciones:", personalInfo.getVacationDays() + " días", normalFont);
                if (personalInfo.getVacationStartDate() != null && personalInfo.getVacationEndDate() != null) {
                    addInfoItem(document, "Periodo:", String.format("%s - %s",
                            DATE_FORMAT.format(personalInfo.getVacationStartDate()),
                            DATE_FORMAT.format(personalInfo.getVacationEndDate())), normalFont);
                }
            }

            if (personalInfo.getBonus() != null && personalInfo.getBonus().compareTo(BigDecimal.ZERO) > 0) {
                addInfoItem(document, "Bonificación:", String.format("$%,d", personalInfo.getBonus().longValue()),
                        normalFont);
            }

            if (personalInfo.getTransportAllowance() != null
                    && personalInfo.getTransportAllowance().compareTo(BigDecimal.ZERO) > 0) {
                addInfoItem(document, "Auxilio de Transporte:",
                        String.format("$%,d", personalInfo.getTransportAllowance().longValue()), normalFont);
            }

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating personal info PDF", e);
        }
    }

    private void addSection(Document document, String title, Font titleFont) throws DocumentException {
        Paragraph section = new Paragraph(title, titleFont);
        section.setSpacingBefore(15);
        section.setSpacingAfter(10);
        document.add(section);
    }

    private void addInfoItem(Document document, String label, String value, Font font) throws DocumentException {
        Paragraph item = new Paragraph();
        Chunk labelChunk = new Chunk(label + " ", FontFactory.getFont(FontFactory.HELVETICA_BOLD, font.getSize()));
        Chunk valueChunk = new Chunk(value, font);
        item.add(labelChunk);
        item.add(valueChunk);
        item.setSpacingAfter(8);
        document.add(item);
    }

    public HealthPensionReportDTO getHealthPensionReport() {
        List<EmployeeHealthPensionStats> stats = employeeRepository.getHealthPensionStats();
        HealthPensionReportDTO report = new HealthPensionReportDTO();

        Map<String, Long> epsCounts = stats.stream()
                .collect(Collectors.groupingBy(
                        EmployeeHealthPensionStats::getEpsName,
                        Collectors.collectingAndThen(
                                Collectors.toList(),
                                list -> list.get(0).getEpsCount())));
        report.setEpsCounts(epsCounts);

        Map<String, Long> pensionFundCounts = stats.stream()
                .collect(Collectors.groupingBy(
                        EmployeeHealthPensionStats::getPensionFundName,
                        Collectors.collectingAndThen(
                                Collectors.toList(),
                                list -> list.get(0).getPensionFundCount())));
        report.setPensionFundCounts(pensionFundCounts);

        Map<String, Map<String, Long>> epsByDepartment = stats.stream()
                .collect(Collectors.groupingBy(
                        EmployeeHealthPensionStats::getDepartmentName,
                        Collectors.groupingBy(
                                EmployeeHealthPensionStats::getEpsName,
                                Collectors.collectingAndThen(
                                        Collectors.toList(),
                                        list -> list.get(0).getEpsDepartmentCount()))));
        report.setEpsByDepartment(epsByDepartment);

        Map<String, Map<String, Long>> pensionFundByDepartment = stats.stream()
                .collect(Collectors.groupingBy(
                        EmployeeHealthPensionStats::getDepartmentName,
                        Collectors.groupingBy(
                                EmployeeHealthPensionStats::getPensionFundName,
                                Collectors.collectingAndThen(
                                        Collectors.toList(),
                                        list -> list.get(0).getPensionFundDepartmentCount()))));
        report.setPensionFundByDepartment(pensionFundByDepartment);

        return report;
    }

    public byte[] generateHealthPensionReportPdf() {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4.rotate());
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Font subtitleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14);

            Paragraph mainTitle = new Paragraph("Reporte de Salud y Pensión", titleFont);
            mainTitle.setAlignment(Element.ALIGN_CENTER);
            mainTitle.setSpacingAfter(20);
            document.add(mainTitle);

            List<EmployeeHealthPensionStats> stats = employeeRepository.getHealthPensionStats();

            PdfPTable epsTable = new PdfPTable(1);
            epsTable.setWidthPercentage(100);

            PdfPCell epsTitleCell = new PdfPCell(new Paragraph("Frecuencia de Empleados por EPS", subtitleFont));
            epsTitleCell.setBorder(0);
            epsTitleCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            epsTitleCell.setPaddingBottom(10);
            epsTable.addCell(epsTitleCell);

            JFreeChart epsBarChart = createEpsFrequencyChart(stats);
            BufferedImage epsBarChartImage = epsBarChart.createBufferedImage(700, 400);
            Image epsBarChartPdfImage = Image.getInstance(epsBarChartImage, null);
            PdfPCell epsChartCell = new PdfPCell(epsBarChartPdfImage);
            epsChartCell.setBorder(0);
            epsChartCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            epsTable.addCell(epsChartCell);

            document.add(epsTable);
            document.newPage();

            PdfPTable pensionTable = new PdfPTable(1);
            pensionTable.setWidthPercentage(100);

            PdfPCell pensionTitleCell = new PdfPCell(
                    new Paragraph("Frecuencia de Empleados por Fondo de Pensión", subtitleFont));
            pensionTitleCell.setBorder(0);
            pensionTitleCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            pensionTitleCell.setPaddingBottom(10);
            pensionTable.addCell(pensionTitleCell);

            JFreeChart pensionBarChart = createPensionFrequencyChart(stats);
            BufferedImage pensionBarChartImage = pensionBarChart.createBufferedImage(700, 400);
            Image pensionBarChartPdfImage = Image.getInstance(pensionBarChartImage, null);
            PdfPCell pensionChartCell = new PdfPCell(pensionBarChartPdfImage);
            pensionChartCell.setBorder(0);
            pensionChartCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            pensionTable.addCell(pensionChartCell);

            document.add(pensionTable);
            document.newPage();

            PdfPTable epsDeptTable = new PdfPTable(1);
            epsDeptTable.setWidthPercentage(100);

            PdfPCell epsDeptTitleCell = new PdfPCell(new Paragraph("Empleados por EPS y Departamento", subtitleFont));
            epsDeptTitleCell.setBorder(0);
            epsDeptTitleCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            epsDeptTitleCell.setPaddingBottom(10);
            epsDeptTable.addCell(epsDeptTitleCell);

            JFreeChart epsDeptChart = createEpsDepartmentChart(stats);
            BufferedImage epsDeptChartImage = epsDeptChart.createBufferedImage(700, 400);
            Image epsDeptChartPdfImage = Image.getInstance(epsDeptChartImage, null);
            PdfPCell epsDeptChartCell = new PdfPCell(epsDeptChartPdfImage);
            epsDeptChartCell.setBorder(0);
            epsDeptChartCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            epsDeptTable.addCell(epsDeptChartCell);

            document.add(epsDeptTable);
            document.newPage();

            PdfPTable pensionDeptTable = new PdfPTable(1);
            pensionDeptTable.setWidthPercentage(100);

            PdfPCell pensionDeptTitleCell = new PdfPCell(
                    new Paragraph("Empleados por Fondo de Pensión y Departamento", subtitleFont));
            pensionDeptTitleCell.setBorder(0);
            pensionDeptTitleCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            pensionDeptTitleCell.setPaddingBottom(10);
            pensionDeptTable.addCell(pensionDeptTitleCell);

            JFreeChart pensionDeptChart = createPensionDepartmentChart(stats);
            BufferedImage pensionDeptChartImage = pensionDeptChart.createBufferedImage(700, 400);
            Image pensionDeptChartPdfImage = Image.getInstance(pensionDeptChartImage, null);
            PdfPCell pensionDeptChartCell = new PdfPCell(pensionDeptChartPdfImage);
            pensionDeptChartCell.setBorder(0);
            pensionDeptChartCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            pensionDeptTable.addCell(pensionDeptChartCell);

            document.add(pensionDeptTable);

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating health pension report PDF", e);
        }
    }

    private JFreeChart createEpsFrequencyChart(List<EmployeeHealthPensionStats> stats) {
        DefaultCategoryDataset dataset = new DefaultCategoryDataset();
        Map<String, Long> epsCounts = stats.stream()
                .collect(Collectors.groupingBy(
                        EmployeeHealthPensionStats::getEpsName,
                        Collectors.collectingAndThen(
                                Collectors.toList(),
                                list -> list.get(0).getEpsCount())));

        epsCounts.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .forEach(entry -> dataset.addValue(entry.getValue(), "EPS", entry.getKey()));

        JFreeChart chart = ChartFactory.createBarChart(
                null,
                "EPS",
                "Cantidad",
                dataset,
                PlotOrientation.VERTICAL,
                true,
                true,
                false);

        chart.setBackgroundPaint(Color.WHITE);
        chart.getPlot().setBackgroundPaint(Color.WHITE);

        CategoryPlot plot = chart.getCategoryPlot();
        BarRenderer renderer = (BarRenderer) plot.getRenderer();

        Color[] colors = {
                new Color(33, 150, 243),
                new Color(255, 152, 0),
                new Color(76, 175, 80),
                new Color(233, 30, 99),
                new Color(156, 39, 176),
                new Color(0, 188, 212),
                new Color(255, 193, 7),
                new Color(63, 81, 181)
        };

        for (int i = 0; i < dataset.getRowCount(); i++) {
            renderer.setSeriesPaint(i, colors[i % colors.length]);
        }

        return chart;
    }

    private JFreeChart createPensionFrequencyChart(List<EmployeeHealthPensionStats> stats) {
        DefaultCategoryDataset dataset = new DefaultCategoryDataset();
        Map<String, Long> pensionCounts = stats.stream()
                .collect(Collectors.groupingBy(
                        EmployeeHealthPensionStats::getPensionFundName,
                        Collectors.collectingAndThen(
                                Collectors.toList(),
                                list -> list.get(0).getPensionFundCount())));

        pensionCounts.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .forEach(entry -> dataset.addValue(entry.getValue(), "Fondo de Pensión", entry.getKey()));

        JFreeChart chart = ChartFactory.createBarChart(
                null,
                "Fondo de Pensión",
                "Cantidad",
                dataset,
                PlotOrientation.VERTICAL,
                true,
                true,
                false);

        chart.setBackgroundPaint(Color.WHITE);
        chart.getPlot().setBackgroundPaint(Color.WHITE);

        CategoryPlot plot = chart.getCategoryPlot();
        BarRenderer renderer = (BarRenderer) plot.getRenderer();

        Color[] colors = {
                new Color(233, 30, 99),
                new Color(156, 39, 176),
                new Color(103, 58, 183),
                new Color(63, 81, 181),
                new Color(33, 150, 243),
                new Color(3, 169, 244),
                new Color(0, 188, 212),
                new Color(0, 150, 136)
        };

        for (int i = 0; i < dataset.getRowCount(); i++) {
            renderer.setSeriesPaint(i, colors[i % colors.length]);
        }

        return chart;
    }

    private JFreeChart createEpsDepartmentChart(List<EmployeeHealthPensionStats> stats) {
        DefaultCategoryDataset dataset = new DefaultCategoryDataset();
        Map<String, Map<String, Long>> epsByDepartment = stats.stream()
                .collect(Collectors.groupingBy(
                        EmployeeHealthPensionStats::getDepartmentName,
                        Collectors.groupingBy(
                                EmployeeHealthPensionStats::getEpsName,
                                Collectors.collectingAndThen(
                                        Collectors.toList(),
                                        list -> list.get(0).getEpsDepartmentCount()))));

        epsByDepartment.forEach(
                (department, epsMap) -> epsMap.forEach((eps, count) -> dataset.addValue(count, eps, department)));

        JFreeChart chart = ChartFactory.createBarChart(
                null,
                "Departamento",
                "Cantidad",
                dataset,
                PlotOrientation.VERTICAL,
                true,
                true,
                false);

        chart.setBackgroundPaint(Color.WHITE);
        chart.getPlot().setBackgroundPaint(Color.WHITE);

        CategoryPlot plot = chart.getCategoryPlot();
        BarRenderer renderer = (BarRenderer) plot.getRenderer();

        Color[] colors = {
                new Color(33, 150, 243),
                new Color(255, 152, 0),
                new Color(76, 175, 80),
                new Color(233, 30, 99),
                new Color(156, 39, 176),
                new Color(0, 188, 212),
                new Color(255, 193, 7),
                new Color(63, 81, 181)
        };

        for (int i = 0; i < dataset.getRowCount(); i++) {
            renderer.setSeriesPaint(i, colors[i % colors.length]);
        }

        return chart;
    }

    private JFreeChart createPensionDepartmentChart(List<EmployeeHealthPensionStats> stats) {
        DefaultCategoryDataset dataset = new DefaultCategoryDataset();
        Map<String, Map<String, Long>> pensionByDepartment = stats.stream()
                .collect(Collectors.groupingBy(
                        EmployeeHealthPensionStats::getDepartmentName,
                        Collectors.groupingBy(
                                EmployeeHealthPensionStats::getPensionFundName,
                                Collectors.collectingAndThen(
                                        Collectors.toList(),
                                        list -> list.get(0).getPensionFundDepartmentCount()))));

        pensionByDepartment.forEach((department, pensionMap) -> pensionMap
                .forEach((pension, count) -> dataset.addValue(count, pension, department)));

        JFreeChart chart = ChartFactory.createBarChart(
                null,
                "Departamento",
                "Cantidad",
                dataset,
                PlotOrientation.VERTICAL,
                true,
                true,
                false);

        chart.setBackgroundPaint(Color.WHITE);
        chart.getPlot().setBackgroundPaint(Color.WHITE);

        CategoryPlot plot = chart.getCategoryPlot();
        BarRenderer renderer = (BarRenderer) plot.getRenderer();

        Color[] colors = {
                new Color(233, 30, 99),
                new Color(156, 39, 176),
                new Color(103, 58, 183),
                new Color(63, 81, 181),
                new Color(33, 150, 243),
                new Color(3, 169, 244),
                new Color(0, 188, 212),
                new Color(0, 150, 136)
        };

        for (int i = 0; i < dataset.getRowCount(); i++) {
            renderer.setSeriesPaint(i, colors[i % colors.length]);
        }

        return chart;
    }

    public Map<String, Long> getEpsFrequency() {
        List<EmployeeHealthPensionStats> stats = employeeRepository.getHealthPensionStats();
        return stats.stream()
                .collect(Collectors.groupingBy(
                        EmployeeHealthPensionStats::getEpsName,
                        Collectors.collectingAndThen(
                                Collectors.toList(),
                                list -> list.get(0).getEpsCount())));
    }

    public Map<String, Long> getPensionFrequency() {
        List<EmployeeHealthPensionStats> stats = employeeRepository.getHealthPensionStats();
        return stats.stream()
                .collect(Collectors.groupingBy(
                        EmployeeHealthPensionStats::getPensionFundName,
                        Collectors.collectingAndThen(
                                Collectors.toList(),
                                list -> list.get(0).getPensionFundCount())));
    }

    public NoveltyReportDTO getNoveltyReport(Date startDate, Date endDate) {
        Calendar calendar = Calendar.getInstance();

        calendar.setTime(startDate);
        calendar.set(Calendar.DAY_OF_MONTH, 1);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        Date adjustedStartDate = calendar.getTime();

        calendar.setTime(endDate);
        calendar.set(Calendar.DAY_OF_MONTH, calendar.getActualMaximum(Calendar.DAY_OF_MONTH));
        calendar.set(Calendar.HOUR_OF_DAY, 23);
        calendar.set(Calendar.MINUTE, 59);
        calendar.set(Calendar.SECOND, 59);
        calendar.set(Calendar.MILLISECOND, 999);
        Date adjustedEndDate = calendar.getTime();

        NoveltyReportDTO report = new NoveltyReportDTO();

        List<EmployeeNoveltyStats> stats = employeeNoveltyStatsRepository
                .findNoveltyStatsByDateRange(adjustedStartDate, adjustedEndDate);

        report.setEmployees(stats.stream()
                .map(this::mapToEmployeeNoveltyDTO)
                .collect(Collectors.toList()));

        report.setTotalNovelties((long) stats.size());

        Map<String, Long> departmentStats = new HashMap<>();
        departmentRepository.findAll().forEach(department -> {
            Long count = employeeNoveltyStatsRepository
                    .countNoveltyByDepartmentAndDateRange(department.getId(), adjustedStartDate, adjustedEndDate);
            if (count > 0) {
                departmentStats.put(department.getName(), count);
            }
        });
        report.setDepartmentStats(departmentStats);

        Map<String, Map<String, Long>> departmentPositionStats = new HashMap<>();
        departmentRepository.findAll().forEach(department -> {
            Map<String, Long> positionStats = new HashMap<>();
            positionRepository.findAll().forEach(position -> {
                Long count = employeeNoveltyStatsRepository
                        .countNoveltyByDepartmentPositionAndDateRange(
                                department.getId(), position.getId(), adjustedStartDate, adjustedEndDate);
                if (count > 0) {
                    positionStats.put(position.getName(), count);
                }
            });
            if (!positionStats.isEmpty()) {
                departmentPositionStats.put(department.getName(), positionStats);
            }
        });
        report.setDepartmentPositionStats(departmentPositionStats);

        return report;
    }

    private EmployeeNoveltyDTO mapToEmployeeNoveltyDTO(EmployeeNoveltyStats stats) {
        EmployeeNoveltyDTO dto = new EmployeeNoveltyDTO();
        dto.setEmployeeId(stats.getEmployeeId());
        dto.setFullName(stats.getFullName());
        dto.setCode(stats.getCode());
        dto.setDepartmentName(stats.getDepartmentName());
        dto.setPositionName(stats.getPositionName());
        dto.setDisabilityRecord(stats.getDisabilityRecord());
        dto.setVacationRecord(stats.getVacationRecord());
        dto.setDisabilityDays(stats.getDisabilityDays());
        dto.setVacationDays(stats.getVacationDays());
        dto.setDisabilityStartDate(stats.getDisabilityStartDate());
        dto.setDisabilityEndDate(stats.getDisabilityEndDate());
        dto.setVacationStartDate(stats.getVacationStartDate());
        dto.setVacationEndDate(stats.getVacationEndDate());
        dto.setBonus(stats.getBonus());
        dto.setTransportAllowance(stats.getTransportAllowance());
        dto.setRecordDate(stats.getRecordDate());
        return dto;
    }

    public byte[] generateNoveltyReportPdf(Date startDate, Date endDate) {
        Calendar calendar = Calendar.getInstance();

        calendar.setTime(startDate);
        calendar.set(Calendar.DAY_OF_MONTH, 1);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        Date adjustedStartDate = calendar.getTime();

        calendar.setTime(endDate);
        calendar.set(Calendar.DAY_OF_MONTH, calendar.getActualMaximum(Calendar.DAY_OF_MONTH));
        calendar.set(Calendar.HOUR_OF_DAY, 23);
        calendar.set(Calendar.MINUTE, 59);
        calendar.set(Calendar.SECOND, 59);
        calendar.set(Calendar.MILLISECOND, 999);
        Date adjustedEndDate = calendar.getTime();

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4.rotate());
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 12);

            NoveltyReportDTO report = getNoveltyReport(adjustedStartDate, adjustedEndDate);

            Paragraph mainTitle = new Paragraph("Reporte de Novedades", titleFont);
            mainTitle.setAlignment(Element.ALIGN_CENTER);
            mainTitle.setSpacingAfter(20);
            document.add(mainTitle);

            SimpleDateFormat monthYearFormat = new SimpleDateFormat("MM/yyyy");
            Paragraph period = new Paragraph(
                    String.format("Período: %s - %s",
                            monthYearFormat.format(adjustedStartDate),
                            monthYearFormat.format(adjustedEndDate)),
                    normalFont);
            period.setSpacingAfter(20);
            document.add(period);

            Paragraph total = new Paragraph(
                    String.format("Total de Empleados con Novedades: %d", report.getTotalNovelties()),
                    normalFont);
            total.setSpacingAfter(20);
            document.add(total);

            addNoveltyTable(document, report.getEmployees());

            document.newPage();

            PdfPTable chartsTable = new PdfPTable(1);
            chartsTable.setWidthPercentage(100);

            addChartSection(chartsTable, "Novedades por Departamento",
                    createDepartmentNoveltyChart(report.getDepartmentStats()));

            document.add(chartsTable);

            document.newPage();

            PdfPTable deptPosTable = new PdfPTable(1);
            deptPosTable.setWidthPercentage(100);

            addChartSection(deptPosTable, "Novedades por Departamento y Cargo",
                    createDepartmentPositionNoveltyChart(report.getDepartmentPositionStats()));

            document.add(deptPosTable);

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating novelty report PDF", e);
        }
    }

    private void addNoveltyTable(Document document, List<EmployeeNoveltyDTO> employees) throws DocumentException {
        PdfPTable table = new PdfPTable(9);
        table.setWidthPercentage(100);
        float[] columnWidths = { 3f, 1.5f, 2f, 2f, 1.5f, 1.5f, 2f, 2f, 2f };
        table.setWidths(columnWidths);

        String[] headers = {
                "Nombre", "Código", "Departamento", "Cargo",
                "Incapacidad", "Vacaciones", "Fecha Inicio", "Fecha Fin", "Días"
        };

        Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10);
        for (String header : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(header, headerFont));
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
            cell.setPadding(5);
            table.addCell(cell);
        }

        Font dataFont = FontFactory.getFont(FontFactory.HELVETICA, 10);
        for (EmployeeNoveltyDTO employee : employees) {
            if (!employee.getDisabilityRecord() && !employee.getVacationRecord()) {
                continue;
            }

            addCell(table, employee.getFullName(), dataFont, Element.ALIGN_LEFT);
            addCell(table, employee.getCode(), dataFont, Element.ALIGN_CENTER);
            addCell(table, employee.getDepartmentName(), dataFont, Element.ALIGN_LEFT);
            addCell(table, employee.getPositionName(), dataFont, Element.ALIGN_LEFT);
            addCell(table, employee.getDisabilityRecord() ? "Sí" : "No", dataFont, Element.ALIGN_CENTER);
            addCell(table, employee.getVacationRecord() ? "Sí" : "No", dataFont, Element.ALIGN_CENTER);

            String startDate = "";
            if (employee.getDisabilityRecord() && employee.getDisabilityStartDate() != null) {
                startDate = DATE_FORMAT.format(employee.getDisabilityStartDate());
            } else if (employee.getVacationRecord() && employee.getVacationStartDate() != null) {
                startDate = DATE_FORMAT.format(employee.getVacationStartDate());
            }
            addCell(table, startDate, dataFont, Element.ALIGN_CENTER);

            String endDate = "";
            if (employee.getDisabilityRecord() && employee.getDisabilityEndDate() != null) {
                endDate = DATE_FORMAT.format(employee.getDisabilityEndDate());
            } else if (employee.getVacationRecord() && employee.getVacationEndDate() != null) {
                endDate = DATE_FORMAT.format(employee.getVacationEndDate());
            }
            addCell(table, endDate, dataFont, Element.ALIGN_CENTER);

            int days = employee.getDisabilityRecord() ? employee.getDisabilityDays() : employee.getVacationDays();
            addCell(table, String.valueOf(days), dataFont, Element.ALIGN_CENTER);
        }

        document.add(table);
    }

    private JFreeChart createDepartmentNoveltyChart(Map<String, Long> stats) {
        DefaultCategoryDataset dataset = new DefaultCategoryDataset();
        stats.forEach((department, count) -> dataset.addValue(count, "Novedades", department));

        JFreeChart chart = ChartFactory.createBarChart(
                null,
                "Departamento",
                "Cantidad",
                dataset,
                PlotOrientation.VERTICAL,
                false,
                true,
                false);

        customizeChart(chart);
        return chart;
    }

    private JFreeChart createDepartmentPositionNoveltyChart(Map<String, Map<String, Long>> stats) {
        DefaultCategoryDataset dataset = new DefaultCategoryDataset();
        stats.forEach((department, positions) -> positions
                .forEach((position, count) -> dataset.addValue(count, position, department)));

        JFreeChart chart = ChartFactory.createBarChart(
                null,
                "Departamento",
                "Cantidad",
                dataset,
                PlotOrientation.VERTICAL,
                true,
                true,
                false);

        customizeChart(chart);
        return chart;
    }

    private void customizeChart(JFreeChart chart) {
        chart.setBackgroundPaint(Color.WHITE);
        CategoryPlot plot = chart.getCategoryPlot();
        plot.setBackgroundPaint(Color.WHITE);
        plot.setRangeGridlinePaint(Color.GRAY);
        plot.setRangeGridlinesVisible(true);

        BarRenderer renderer = (BarRenderer) plot.getRenderer();
        renderer.setDrawBarOutline(false);
        renderer.setShadowVisible(false);
    }

    private void addChartSection(PdfPTable table, String title, JFreeChart chart)
            throws DocumentException, IOException {
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14);

        PdfPCell titleCell = new PdfPCell(new Paragraph(title, titleFont));
        titleCell.setBorder(0);
        titleCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        titleCell.setPaddingBottom(10);
        table.addCell(titleCell);

        BufferedImage chartImage = chart.createBufferedImage(700, 400);
        Image chartPdfImage = Image.getInstance(chartImage, null);
        PdfPCell chartCell = new PdfPCell(chartPdfImage);
        chartCell.setBorder(0);
        chartCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        chartCell.setPaddingBottom(20);
        table.addCell(chartCell);
    }

    @Transactional
    public Employee createEmployee(EmployeeDTO dto) {
        Employee employee = new Employee();
        employee.setCode(dto.getCode());
        employee.setFullName(dto.getFullName());
        employee.setHireDate(dto.getHireDate());
        employee.setSalary(dto.getSalary());

        Department department = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Departamento no encontrado"));
        Position position = positionRepository.findById(dto.getPositionId())
                .orElseThrow(() -> new RuntimeException("Cargo no encontrado"));
        EPS eps = epsRepository.findById(dto.getEpsId())
                .orElseThrow(() -> new RuntimeException("EPS no encontrada"));
        ARL arl = arlRepository.findById(dto.getArlId())
                .orElseThrow(() -> new RuntimeException("ARL no encontrada"));
        PensionFund pensionFund = pensionFundRepository.findById(dto.getPensionFundId())
                .orElseThrow(() -> new RuntimeException("Fondo de pensión no encontrado"));

        employee.setDepartment(department);
        employee.setPosition(position);
        employee.setEps(eps);
        employee.setArl(arl);
        employee.setPensionFund(pensionFund);

        if (employeeRepository.existsByCode(employee.getCode())) {
            throw new RuntimeException("Ya existe un empleado con este código");
        }

        return employeeRepository.save(employee);
    }

    @Transactional
    public Employee updateEmployee(Long id, EmployeeDTO dto) {
        Employee existingEmployee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));

        if (!existingEmployee.getCode().equals(dto.getCode()) &&
                employeeRepository.existsByCode(dto.getCode())) {
            throw new RuntimeException("Ya existe un empleado con este código");
        }

        Department department = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Departamento no encontrado"));
        Position position = positionRepository.findById(dto.getPositionId())
                .orElseThrow(() -> new RuntimeException("Cargo no encontrado"));
        EPS eps = epsRepository.findById(dto.getEpsId())
                .orElseThrow(() -> new RuntimeException("EPS no encontrada"));
        ARL arl = arlRepository.findById(dto.getArlId())
                .orElseThrow(() -> new RuntimeException("ARL no encontrada"));
        PensionFund pensionFund = pensionFundRepository.findById(dto.getPensionFundId())
                .orElseThrow(() -> new RuntimeException("Fondo de pensión no encontrado"));

        existingEmployee.setCode(dto.getCode());
        existingEmployee.setFullName(dto.getFullName());
        existingEmployee.setDepartment(department);
        existingEmployee.setPosition(position);
        existingEmployee.setHireDate(dto.getHireDate());
        existingEmployee.setEps(eps);
        existingEmployee.setArl(arl);
        existingEmployee.setPensionFund(pensionFund);
        existingEmployee.setSalary(dto.getSalary());

        return employeeRepository.save(existingEmployee);
    }

    @Transactional
    public void deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado con ID: " + id));

        try {
            employeeRepository.delete(employee);
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("No se puede eliminar el empleado porque tiene registros asociados");
        }
    }

    @Transactional(readOnly = true)
    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado con ID: " + id));
    }
}
