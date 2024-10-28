package co.edu.unbosque.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import co.edu.unbosque.model.PensionFund;

public interface PensionFundRepository extends JpaRepository<PensionFund, Long> {
    boolean existsByName(String name);

    Optional<PensionFund> findByName(String name);
}
