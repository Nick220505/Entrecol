package co.edu.unbosque.service;

import java.util.List;

import org.springframework.stereotype.Service;

import co.edu.unbosque.model.ARL;
import co.edu.unbosque.repository.ARLRepository;

@Service
public class ARLService {
    private final ARLRepository arlRepository;

    public ARLService(ARLRepository arlRepository) {
        this.arlRepository = arlRepository;
    }

    public List<ARL> getAllARL() {
        return arlRepository.findAll();
    }

    public ARL getARLById(Long id) {
        return arlRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ARL not found"));
    }
}