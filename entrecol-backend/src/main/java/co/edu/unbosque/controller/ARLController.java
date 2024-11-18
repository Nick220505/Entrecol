package co.edu.unbosque.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import co.edu.unbosque.model.ARL;
import co.edu.unbosque.service.ARLService;

@RestController
@RequestMapping("/api/arl")
public class ARLController {
    private final ARLService arlService;

    public ARLController(ARLService arlService) {
        this.arlService = arlService;
    }

    @GetMapping
    public ResponseEntity<List<ARL>> getAllARL() {
        return ResponseEntity.ok(arlService.getAllARL());
   }

    @GetMapping("/{id}")
    public ResponseEntity<ARL> getARLById(@PathVariable Long id) {
        return ResponseEntity.ok(arlService.getARLById(id));
    }
} 