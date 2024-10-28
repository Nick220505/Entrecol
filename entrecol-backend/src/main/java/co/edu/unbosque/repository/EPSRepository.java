package co.edu.unbosque.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import co.edu.unbosque.model.EPS;

public interface EPSRepository extends JpaRepository<EPS, Long> {
    boolean existsByName(String name);

    Optional<EPS> findByName(String name);
}
