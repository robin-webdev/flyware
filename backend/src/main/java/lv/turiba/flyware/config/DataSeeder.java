package lv.turiba.flyware.config;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import lv.turiba.flyware.model.Flight;
import lv.turiba.flyware.model.FlightStatus;
import lv.turiba.flyware.repository.FlightRepository;

@Component
public class DataSeeder implements CommandLineRunner {

    private final FlightRepository repository;

    public DataSeeder(FlightRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
        if (!repository.findAll().isEmpty()) {
            return;
        }

        LocalDate today = LocalDate.now();
        LocalDate tomorrow = today.plusDays(1);

        List<Flight> seed = List.of(
                flight("FW1042", "RIX", "Riga", "LHR", "London",
                        at(today, 6, 15), at(today, 8, 5),
                        FlightStatus.DEPARTED, "A3", "Airbus A220-300"),
                flight("FW2310", "RIX", "Riga", "FRA", "Frankfurt",
                        at(today, 7, 40), at(today, 9, 35),
                        FlightStatus.BOARDING, "B12", "Boeing 737-800"),
                flight("FW1885", "RIX", "Riga", "CDG", "Paris",
                        at(today, 9, 10), at(today, 11, 25),
                        FlightStatus.SCHEDULED, "A7", "Airbus A320neo"),
                flight("FW3304", "ARN", "Stockholm", "RIX", "Riga",
                        at(today, 10, 0), at(today, 11, 5),
                        FlightStatus.IN_AIR, "C2", "Airbus A220-300"),
                flight("FW4721", "AMS", "Amsterdam", "RIX", "Riga",
                        at(today, 11, 30), at(today, 13, 50),
                        FlightStatus.DELAYED, "D5", "Boeing 737-700"),
                flight("FW2096", "RIX", "Riga", "MAD", "Madrid",
                        at(today, 13, 20), at(today, 17, 10),
                        FlightStatus.SCHEDULED, "A1", "Airbus A321neo"),
                flight("FW5512", "RIX", "Riga", "FCO", "Rome",
                        at(today, 14, 45), at(today, 17, 40),
                        FlightStatus.CANCELLED, null, "Airbus A320neo"),
                flight("FW1177", "BER", "Berlin", "RIX", "Riga",
                        at(today, 16, 5), at(today, 17, 50),
                        FlightStatus.LANDED, "B8", "Boeing 737-800"),
                flight("FW6403", "HEL", "Helsinki", "RIX", "Riga",
                        at(today, 18, 25), at(today, 19, 5),
                        FlightStatus.SCHEDULED, "C4", "ATR 72-600"),
                flight("FW1290", "RIX", "Riga", "VNO", "Vilnius",
                        at(tomorrow, 7, 5), at(tomorrow, 7, 50),
                        FlightStatus.SCHEDULED, "A2", "ATR 72-600"),
                flight("FW1355", "RIX", "Riga", "TLL", "Tallinn",
                        at(tomorrow, 8, 30), at(tomorrow, 9, 15),
                        FlightStatus.SCHEDULED, "A4", "ATR 72-600"),
                flight("FW3870", "LHR", "London", "RIX", "Riga",
                        at(tomorrow, 12, 10), at(tomorrow, 16, 5),
                        FlightStatus.SCHEDULED, "B1", "Airbus A220-300")
        );

        seed.forEach(repository::save);
    }

    private static LocalDateTime at(LocalDate date, int hour, int minute) {
        return LocalDateTime.of(date, LocalTime.of(hour, minute));
    }

    private static Flight flight(String flightNumber, String originCode, String originCity,
                                 String destinationCode, String destinationCity,
                                 LocalDateTime departure, LocalDateTime arrival,
                                 FlightStatus status, String gate, String aircraftType) {
        Flight f = new Flight();
        f.setFlightNumber(flightNumber);
        f.setAirline("Flyware");
        f.setOriginCode(originCode);
        f.setOriginCity(originCity);
        f.setDestinationCode(destinationCode);
        f.setDestinationCity(destinationCity);
        f.setScheduledDeparture(departure);
        f.setScheduledArrival(arrival);
        f.setStatus(status);
        f.setGate(gate);
        f.setAircraftType(aircraftType);
        return f;
    }
}
