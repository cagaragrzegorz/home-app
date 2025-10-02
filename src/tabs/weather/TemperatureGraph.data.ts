// Your provided data
import {WeatherData} from "./types";

export const sampleWeatherData: WeatherData = {
    "data": [
        7.35, 8.85, 10.225, 11.1, 11.475, 11.85, 12.225, 12.35, 12.725, 12.975,
        13.1, 12.85, 12.85, 12.35, 11.725, 11.225, 10.35, 9.475, 8.85, 8.475,
        // 7.85, 7.35, 7.1, 7.6, 9.1, 11.6, 13.975, 15.6, 16.85, 18.975,
        // 19.725, 20.1, 19.725, 19.225, 18.6, 17.85, 17.1, 16.475, 15.975, 15.35,
        // 15.1, 14.725, 14.6, 14.475, 14.475, 14.35, 14.1, 14.1, 14.6, 15.475,
        // 16.475, 17.475, 18.6, 19.6, 20.35, 20.975, 20.725, 20.475, 19.85, 18.85
    ],
    "first_timestamp": "1744441200", // Example: Approx April 12, 2025 06:00 GMT if timestamp is correct
    "interval": 3600, // 1 hour
    "unit": "Celsius",
    "point": {
        "lat": 50.0444,
        "lon": 19.9986,
        "model": "um4",
        "grid": "P5",
        "row": 151,
        "col": 235
    },
    "fstart": "2025-04-12T06:00:00Z" // Corresponds to first_timestamp? Check consistency
};