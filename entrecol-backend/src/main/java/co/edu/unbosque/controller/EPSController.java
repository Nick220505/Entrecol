package co.edu.unbosque.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import co.edu.unbosque.model.EPS;
import co.edu.unbosque.service.EPSService;

@RestController
@RequestMapping("/api/eps")
public class EPSController {
    private final EPSService epsService;

   public EPSController(EPSService epsService) {
        this.epsService = epsService;
    }

    @GetMapping
    public ResponseEntity<List<EPS>> getAllEPS() {
        return ResponseEntity.ok(epsService.getAllEPS());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EPS> getEPSById(@PathVariable Long id) {
        return ResponseEntity.ok(epsService.getEPSById(id));
    }
} 