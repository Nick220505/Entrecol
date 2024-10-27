package co.edu.unbosque.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import co.edu.unbosque.model.Publisher;
import co.edu.unbosque.repository.PublisherRepository;

@Service
public class PublisherService {
    private final PublisherRepository publisherRepository;

    public PublisherService(PublisherRepository publisherRepository) {
        this.publisherRepository = publisherRepository;
    }

    public Page<Publisher> getAllPublishers(Pageable pageable) {
        return publisherRepository.findAll(pageable);
    }

    public Publisher getPublisherById(Long id) {
        return publisherRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Publisher not found"));
    }
}
