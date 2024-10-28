package co.edu.unbosque.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import co.edu.unbosque.model.ARL;

public interface ARLRepository extends JpaRepository<ARL, Long> {
    boolean existsByName(String name);

    Optional<ARL> findByName(String name);
}
