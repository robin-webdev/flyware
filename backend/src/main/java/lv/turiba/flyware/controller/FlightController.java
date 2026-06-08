package lv.turiba.flyware.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import lv.turiba.flyware.model.Flight;
import lv.turiba.flyware.service.FlightService;

@RestController
@RequestMapping("/api/flights")
@CrossOrigin(origins = "http://localhost:5173")
public class FlightController {

    private final FlightService service;

    public FlightController(FlightService service) {
        this.service = service;
    }

    @GetMapping
    public List<Flight> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Flight getById(@PathVariable Long id) {
        return service.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Flight not found: " + id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Flight create(@RequestBody Flight flight) {
        flight.setId(null);
        return service.save(flight);
    }

    @PutMapping("/{id}")
    public Flight update(@PathVariable Long id, @RequestBody Flight flight) {
        return service.update(id, flight);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        boolean removed = service.deleteById(id);
        if (!removed) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Flight not found: " + id);
        }
        return ResponseEntity.noContent().build();
    }
}
