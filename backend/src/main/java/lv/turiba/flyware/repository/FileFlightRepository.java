package lv.turiba.flyware.repository;

import java.io.File;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.stereotype.Repository;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import lv.turiba.flyware.model.Flight;

@Repository
public class FileFlightRepository implements FlightRepository {

    private static final String DATA_DIR = "data";
    private static final String DATA_FILE = DATA_DIR + "/flights.json";

    private final ObjectMapper objectMapper;
    private final File file;
    private final List<Flight> flights = new ArrayList<>();
    private final AtomicLong maxId = new AtomicLong(0);

    public FileFlightRepository() {
        this.objectMapper = new ObjectMapper()
                .registerModule(new JavaTimeModule());
        this.objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        this.file = new File(DATA_FILE);
        load();
    }

    private synchronized void load() {
        File dir = new File(DATA_DIR);
        if (!dir.exists()) {
            dir.mkdirs();
        }
        if (!file.exists() || file.length() == 0) {
            return;
        }
        try {
            List<Flight> loaded = objectMapper.readValue(file, new TypeReference<List<Flight>>() {});
            flights.clear();
            flights.addAll(loaded);
            for (Flight f : flights) {
                if (f.getId() != null && f.getId() > maxId.get()) {
                    maxId.set(f.getId());
                }
            }
        } catch (IOException e) {
            throw new UncheckedIOException("Failed to load flights from " + DATA_FILE, e);
        }
    }

    private synchronized void persist() {
        try {
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(file, flights);
        } catch (IOException e) {
            throw new UncheckedIOException("Failed to persist flights to " + DATA_FILE, e);
        }
    }

    @Override
    public synchronized List<Flight> findAll() {
        return new ArrayList<>(flights);
    }

    @Override
    public synchronized Optional<Flight> findById(Long id) {
        return flights.stream()
                .filter(f -> f.getId() != null && f.getId().equals(id))
                .findFirst();
    }

    @Override
    public synchronized Flight save(Flight f) {
        if (f.getId() == null) {
            f.setId(maxId.incrementAndGet());
            flights.add(f);
        } else {
            int index = indexOf(f.getId());
            if (index >= 0) {
                flights.set(index, f);
            } else {
                flights.add(f);
                if (f.getId() > maxId.get()) {
                    maxId.set(f.getId());
                }
            }
        }
        persist();
        return f;
    }

    @Override
    public synchronized boolean deleteById(Long id) {
        boolean removed = flights.removeIf(f -> f.getId() != null && f.getId().equals(id));
        if (removed) {
            persist();
        }
        return removed;
    }

    private int indexOf(Long id) {
        for (int i = 0; i < flights.size(); i++) {
            Flight f = flights.get(i);
            if (f.getId() != null && f.getId().equals(id)) {
                return i;
            }
        }
        return -1;
    }
}
