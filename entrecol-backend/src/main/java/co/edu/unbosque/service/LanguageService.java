package co.edu.unbosque.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import co.edu.unbosque.exception.ResourceNotFoundException;
import co.edu.unbosque.model.Language;
import co.edu.unbosque.repository.LanguageRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LanguageService {
    private final LanguageRepository languageRepository;

    public List<Language> findAll() {
        return languageRepository.findAll();
    }

    @Transactional
    public Language create(Language language) {
        return languageRepository.save(language);
    }

    @Transactional
    public Language update(Long id, Language language) {
        Language existingLanguage = languageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Language not found with id: " + id));
        existingLanguage.setCode(language.getCode());
        return languageRepository.save(existingLanguage);
    }

    @Transactional
    public void delete(Long id) {
        if (!languageRepository.existsById(id)) {
            throw new ResourceNotFoundException("Language not found with id: " + id);
        }
        languageRepository.deleteById(id);
    }
}