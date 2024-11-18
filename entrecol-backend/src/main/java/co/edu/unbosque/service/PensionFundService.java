package co.edu.unbosque.service;

import java.util.List;

import org.springframework.stereotype.Service;

import co.edu.unbosque.model.PensionFund;
import co.edu.unbosque.repository.PensionFundRepository;

@Service
public class PensionFundService {
    private final PensionFundRepository pensionFundRepository;

    public PensionFundService(PensionFundRepository pensionFundRepository) {
        this.pensionFundRepository = pensionFundRepository;
    }

    public List<PensionFund> getAllPensionFunds() {
        return pensionFundRepository.findAll();
    }

    public PensionFund getPensionFundById(Long id) {
        return pensionFundRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pension Fund not found"));
    }
}