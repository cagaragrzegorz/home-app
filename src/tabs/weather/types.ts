export interface WeatherData {
    data: number[];
    first_timestamp: string; // Unix timestamp in seconds as a string
    interval: number;        // Interval in seconds
    unit: string;
    point: {
        lat: number;
        lon: number;
        model: string;
        grid: string;
        row: number;
        col: number;
    };
    fstart: string;          // ISO 8601 date string
}

// Interface for the data points processed for the chart
export interface ChartDataPoint {
    timestamp: number; // Unix timestamp in milliseconds
    timeLabel: string; // Formatted time (e.g., "HH:00")
    temperature: number;
    isNight: boolean;  // Flag for styling night hours
}