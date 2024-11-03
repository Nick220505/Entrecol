package co.edu.unbosque.dto;

import java.util.Map;

import lombok.Data;

@Data
public class HealthPensionReportDTO {
    private Map<String, Long> epsCounts;
    private Map<String, Long> pensionFundCounts;
    private Map<String, Map<String, Long>> epsByDepartment;
    private Map<String, Map<String, Long>> pensionFundByDepartment;
}