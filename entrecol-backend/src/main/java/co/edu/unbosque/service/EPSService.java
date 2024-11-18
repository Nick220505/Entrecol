package co.edu.unbosque.service;

import java.util.List;

import org.springframework.stereotype.Service;

import co.edu.unbosque.model.EPS;
import co.edu.unbosque.repository.EPSRepository;

@Service
public class EPSService {
    private final EPSRepository epsRepository;

    public EPSService(EPSRepository epsRepository) {
        this.epsRepository = epsRepository;
    }

    public List<EPS> getAllEPS() {
        return epsRepository.findAll();
    }

    public EPS getEPSById(Long id) {
        return epsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("EPS not found"));
    }
}