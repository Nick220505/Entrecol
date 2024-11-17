package co.edu.unbosque.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import co.edu.unbosque.exception.ResourceNotFoundException;
import co.edu.unbosque.model.Publisher;
import co.edu.unbosque.repository.PublisherRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PublisherService {
    private final PublisherRepository publisherRepository;

    public List<Publisher> findAll() {
        return publisherRepository.findAll();
    }

    @Transactional
    public Publisher create(Publisher publisher) {
        return publisherRepository.save(publisher);
    }

    @Transactional
    public Publisher update(Long id, Publisher publisher) {
        Publisher existingPublisher = publisherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Publisher not found with id: " + id));
        existingPublisher.setName(publisher.getName());
        return publisherRepository.save(existingPublisher);
    }

    @Transactional
    public void delete(Long id) {
        if (!publisherRepository.existsById(id)) {
            throw new ResourceNotFoundException("Publisher not found with id: " + id);
        }
        publisherRepository.deleteById(id);
    }
}
