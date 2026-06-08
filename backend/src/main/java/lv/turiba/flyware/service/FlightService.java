package lv.turiba.flyware.service;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import lv.turiba.flyware.model.Flight;
import lv.turiba.flyware.repository.FlightRepository;

@Service
public class FlightService {

    private final FlightRepository repository;

    public FlightService(FlightRepository repository) {
        this.repository = repository;
    }

    public List<Flight> findAll() {
        return repository.findAll();
    }

    public Optional<Flight> findById(Long id) {
        return repository.findById(id);
    }

    public Flight save(Flight flight) {
        return repository.save(flight);
    }

    public boolean deleteById(Long id) {
        return repository.deleteById(id);
    }

    public Flight update(Long id, Flight updates) {
        Flight existing = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Flight not found: " + id));

        updates.setId(existing.getId());
        return repository.save(updates);
    }
}
