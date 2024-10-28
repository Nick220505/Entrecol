package co.edu.unbosque.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import co.edu.unbosque.model.Position;

public interface PositionRepository extends JpaRepository<Position, Long> {
    boolean existsByName(String name);

    Optional<Position> findByName(String name);
}
