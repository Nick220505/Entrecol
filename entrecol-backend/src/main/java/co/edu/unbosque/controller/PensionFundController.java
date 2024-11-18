package co.edu.unbosque.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import co.edu.unbosque.model.PensionFund;
import co.edu.unbosque.service.PensionFundService;

@RestController
@RequestMapping("/api/pension-funds")
public class PensionFundController {
    private final PensionFundService pensionFundService;

    public PensionFundController(PensionFundService pensionFundService) {
        this.pensionFundService = pensionFundService;
    }

    @GetMapping
    public ResponseEntity<List<PensionFund>> getAllPensionFunds() {
        return ResponseEntity.ok(pensionFundService.getAllPensionFunds());
   }

    @GetMapping("/{id}")
    public ResponseEntity<PensionFund> getPensionFundById(@PathVariable Long id) {
        return ResponseEntity.ok(pensionFundService.getPensionFundById(id));
    }
} 