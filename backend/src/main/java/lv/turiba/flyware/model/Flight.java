package lv.turiba.flyware.model;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Flight {

    private Long id;
    private String flightNumber;
    private String airline = "Flyware";
    private String originCode;
    private String originCity;
    private String destinationCode;
    private String destinationCity;
    private LocalDateTime scheduledDeparture;
    private LocalDateTime scheduledArrival;
    private FlightStatus status;
    private String gate;
    private String aircraftType;
}
