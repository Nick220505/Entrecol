package co.edu.unbosque.service;

import java.util.List;

import org.springframework.stereotype.Service;

import co.edu.unbosque.model.Position;
import co.edu.unbosque.repository.PositionRepository;

@Service
public class PositionService {
    private final PositionRepository positionRepository;

    public PositionService(PositionRepository positionRepository) {
        this.positionRepository = positionRepository;
    }

    public List<Position> getAllPositions() {
        return positionRepository.findAll();
    }

    public Position getPositionById(Long id) {
        return positionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Position not found"));
    }
}
