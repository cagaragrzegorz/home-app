import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceArea,
} from 'recharts';
import { WeatherData, ChartDataPoint } from './types'; // Adjust path if needed

interface TemperatureGraphProps {
    weatherData: WeatherData;
}

const TemperatureGraph: React.FC<TemperatureGraphProps> = ({ weatherData }) => {
    // --- Data Processing ---
    const chartData: ChartDataPoint[] = React.useMemo(() => {
        const firstTimestampMs = parseInt(weatherData.first_timestamp, 10) * 1000;
        const intervalMs = weatherData.interval * 1000;

        return weatherData.data.map((temp, index) => {
            const timestamp = firstTimestampMs + index * intervalMs;
            const date = new Date(timestamp);
            const hour = date.getHours();

            // Determine if it's night (e.g., 9 PM to 6 AM) - adjust as needed
            const isNight = hour >= 21 || hour < 6;

            return {
                timestamp: timestamp,
                // Format time as HH:00
                timeLabel: `${String(hour).padStart(2, '0')}:00`,
                temperature: temp,
                isNight: isNight,
            };
        });
    }, [weatherData]);

    // --- Find Min/Max Temps for Y-Axis Domain ---
    const temps = weatherData.data;
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);
    // Add some padding to the domain
    const yDomain: [number, number] = [
        Math.floor(minTemp / 5) * 5 - 5, // Round down to nearest 5, subtract 5
        Math.ceil(maxTemp / 5) * 5 + 5,  // Round up to nearest 5, add 5
    ];

    // --- Generate Ticks for X-Axis (e.g., every 3 hours) ---
    const getRelevantTicks = (data: ChartDataPoint[]): number[] => {
        const ticks: number[] = [];
        if (!data || data.length === 0) return ticks;

        let lastPushedHour = -1;
        const intervalHours = 3; // Show tick every 3 hours like the image

        data.forEach(point => {
            const date = new Date(point.timestamp);
            const hour = date.getHours();
            // Add tick if it's a multiple of intervalHours and not the same hour as the last tick
            if (hour % intervalHours === 0 && hour !== lastPushedHour) {
                ticks.push(point.timestamp);
                lastPushedHour = hour;
            }
        });
        // Ensure the last point's hour is considered if needed, though usually covered
        return ticks;
    }

    const xTicks = React.useMemo(() => getRelevantTicks(chartData), [chartData]);

    // --- Format X-Axis Tick Labels ---
    const formatXAxisTick = (timestamp: number): string => {
        const date = new Date(timestamp);
        return `${String(date.getHours()).padStart(2, '0')}:00`;
    };

    // --- Custom Tooltip ---
    const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload as ChartDataPoint; // Access the full data point
            const date = new Date(data.timestamp);
            const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const day = date.toLocaleDateString([], { weekday: 'short', day: '2-digit', month: '2-digit'});

            return (
                <div className="custom-tooltip" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: '5px 10px', border: '1px solid #ccc', borderRadius: '3px' }}>
                    <p className="label">{`${day} ${time}`}</p>
                    <p className="intro">{`Temperature: ${data.temperature.toFixed(1)} ${weatherData.unit}`}</p>
                    {/* Add other data points here if available in your payload */}
                </div>
            );
        }
        return null;
    };

    // --- Calculate Night Area Boundaries ---
    const getNightAreas = (data: ChartDataPoint[]) => {
        const areas: { x1: number; x2: number }[] = [];
        let startNightTimestamp: number | null = null;

        data.forEach((point, index) => {
            if (point.isNight && startNightTimestamp === null) {
                // Start of a night period
                startNightTimestamp = point.timestamp;
                // If it's the very first point, adjust slightly back for visual start
                if (index === 0) startNightTimestamp -= intervalMs / 2;
            } else if (!point.isNight && startNightTimestamp !== null) {
                // End of a night period
                let endTimestamp = point.timestamp;
                // Adjust slightly back to align between points
                endTimestamp -= intervalMs / 2;
                areas.push({ x1: startNightTimestamp, x2: endTimestamp });
                startNightTimestamp = null;
            } else if (point.isNight && index === data.length - 1 && startNightTimestamp !== null) {
                // Night period continues to the end
                let endTimestamp = point.timestamp;
                // Adjust slightly forward for visual end
                endTimestamp += intervalMs / 2;
                areas.push({ x1: startNightTimestamp, x2: endTimestamp });
            }
        });

        return areas;
    }

    const intervalMs = weatherData.interval * 1000; // Define intervalMs here
    const nightAreas = React.useMemo(() => getNightAreas(chartData), [chartData]);

    // --- Render Component ---
    if (!chartData || chartData.length === 0) {
        return <div>Loading data or no data available...</div>;
    }

    // Get start and end dates for the title
    const startDate = new Date(chartData[0].timestamp);
    const endDate = new Date(chartData[chartData.length - 1].timestamp);
    const titleDate = startDate.toLocaleDateString([], { weekday: 'long', day: '2-digit', month: '2-digit' });
    // Simple check if it spans more than one day
    const endDateStr = (endDate.getDate() !== startDate.getDate())
        ? endDate.toLocaleDateString([], { weekday: 'long', day: '2-digit', month: '2-digit' })
        : '';


    return (
        <div style={{ width: '100%', maxWidth: '900px', margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
            {/* Title */}
            <h2 style={{ textAlign: 'center', fontWeight: 'normal', marginBottom: '5px' }}>
                {titleDate} {endDateStr && ` - ${endDateStr}`}
            </h2>

            {/* Timeline */}
            <div className="timeline" style={{ display: 'flex', justifyContent: 'space-between', padding: `0 ${/* Adjust padding based on chart margins */ 50}px`, marginBottom: '5px', borderBottom: '1px solid #ccc' }}>
                {xTicks.map((tickTimestamp) => (
                    <div key={tickTimestamp} style={{ textAlign: 'center', fontSize: '12px', position: 'relative' }}>
                        {/* Add "NOC" label above night ticks */}
                        {new Date(tickTimestamp).getHours() >= 21 || new Date(tickTimestamp).getHours() < 6 ? (
                            <span style={{ position: 'absolute', top: '-18px', left: '50%', transform: 'translateX(-50%)', fontSize: '10px', color: '#555' }}>NOC</span>
                        ) : null}
                        {formatXAxisTick(tickTimestamp)}
                        {/* Simple tick mark */}
                        <div style={{ height: '5px', width: '1px', backgroundColor: '#aaa', margin: '2px auto 0 auto' }}></div>
                    </div>
                ))}
            </div>


            {/* Chart */}
            <div style={{ width: '100%', height: 350 }}> {/* Increased height */}
                <ResponsiveContainer>
                    <LineChart
                        data={chartData}
                        margin={{
                            top: 10, right: 50, left: 0, bottom: 10, // Adjust margins
                        }}
                    >
                        {/* Background Night Areas */}
                        {nightAreas.map((area, index) => (
                            <ReferenceArea
                                key={`night-${index}`}
                                x1={area.x1}
                                x2={area.x2}
                                y1={yDomain[0]} // Use dynamic domain min
                                y2={yDomain[1]} // Use dynamic domain max
                                ifOverflow="hidden" // Clip area to plot
                                fill="#e0e0f8" // Light blue/purple for night
                                opacity={0.4}
                                isFront={false} // Render behind grid and lines
                            />
                        ))}

                        <CartesianGrid strokeDasharray="3 3" vertical={false} /> {/* Only horizontal */}

                        <XAxis
                            dataKey="timestamp"
                            type="number" // Use timestamp number for domain/ticks
                            scale="time"
                            domain={['dataMin', 'dataMax']} // Fit domain to data
                            ticks={xTicks} // Use calculated ticks
                            tickFormatter={formatXAxisTick} // Format displayed labels
                            axisLine={false} // Hide the main axis line if desired
                            tickLine={false} // Hide tick lines if using custom timeline above
                            tick={{ fontSize: 12, fill: '#666' }}
                            // interval={0} // Let `ticks` control the display
                            padding={{ left: 20, right: 20 }} // Add padding inside axis
                        />
                        <YAxis
                            yAxisId="left" // Assign ID
                            orientation="left"
                            domain={yDomain} // Use calculated domain
                            unit={` ${weatherData.unit}`}
                            tick={{ fontSize: 12, fill: '#666' }}
                            tickCount={Math.ceil((yDomain[1] - yDomain[0]) / 5) + 1} // Aim for ticks every 5 degrees
                            allowDecimals={false}
                            axisLine={false}
                        />
                        {/* Add a duplicate Y Axis on the right */}
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            domain={yDomain}
                            unit={` ${weatherData.unit}`}
                            tick={{ fontSize: 12, fill: '#666' }}
                            tickCount={Math.ceil((yDomain[1] - yDomain[0]) / 5) + 1}
                            allowDecimals={false}
                            axisLine={false}
                            tickLine={false} // Hide ticks themselves on the right
                            tickFormatter={() => ''} // Hide tick labels on the right
                        />

                        <Tooltip content={<CustomTooltip />} />

                        <Line
                            yAxisId="left" // Associate with the left Y-axis
                            type="monotone"
                            dataKey="temperature"
                            stroke="#e60000" // Red color for temp line
                            strokeWidth={3} // Thicker line
                            dot={false} // Hide dots on the line
                            activeDot={{ r: 6, strokeWidth: 1, fill: '#e60000', stroke: '#fff' }} // Style for hovered dot
                        />

                        {/*
              NOTE: The image shows other lines/areas (Temp. odczuwalna, Temp. punktu rosy, min/max bars).
              The provided data only includes one temperature series ('data').
              To add other lines (e.g., blue line, blue area, red bars), you would need:
              1. Additional data arrays in your `weatherData` prop.
              2. Process them similarly in `React.useMemo`.
              3. Add corresponding `<Line />` or `<Area />` components here, referencing the new data keys.
              Example for a blue 'dewPoint' line (if data existed):
              <Line yAxisId="left" type="monotone" dataKey="dewPoint" stroke="#007bff" strokeWidth={2} dot={false} />
            */}

                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Legend (Example - adapt if you add more lines) */}
            <div style={{ textAlign: 'center', marginTop: '15px', fontSize: '12px' }}>
            <span style={{ marginRight: '15px' }}>
                <span style={{ display: 'inline-block', width: '20px', height: '3px', backgroundColor: '#e60000', marginRight: '5px', verticalAlign: 'middle' }}></span>
                Temp. powietrza ({weatherData.unit}) {/* Adapt legend text */}
            </span>
                {/* Add other legend items here if needed */}
            </div>
        </div>
    );
};

export default TemperatureGraph;