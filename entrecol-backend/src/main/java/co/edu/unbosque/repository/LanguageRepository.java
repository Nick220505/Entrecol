package co.edu.unbosque.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import co.edu.unbosque.model.Language;

public interface LanguageRepository extends JpaRepository<Language, Long> {
    Optional<Language> findByCode(String code);
}
