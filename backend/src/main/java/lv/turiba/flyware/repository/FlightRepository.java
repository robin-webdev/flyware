package lv.turiba.flyware.repository;

import java.util.List;
import java.util.Optional;

import lv.turiba.flyware.model.Flight;

public interface FlightRepository {

    List<Flight> findAll();

    Optional<Flight> findById(Long id);

    Flight save(Flight f);

    boolean deleteById(Long id);
}
