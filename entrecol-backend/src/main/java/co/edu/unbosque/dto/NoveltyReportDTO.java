package co.edu.unbosque.dto;

import java.util.List;
import java.util.Map;

import lombok.Data;

@Data
public class NoveltyReportDTO {
    private List<EmployeeNoveltyDTO> employees;
    private Map<String, Long> departmentStats;
    private Map<String, Map<String, Long>> departmentPositionStats;
    private Long totalNovelties;
}