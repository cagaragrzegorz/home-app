import React, { useState, useEffect } from 'react';
import './KidsClock.css'; // CSS for styling

const KidsClock: React.FC = () => {
    const [currentTime, setCurrentTime] = useState<Date>(new Date());

    useEffect(() => {
        // Update the time every second
        const timerId = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        // Cleanup interval on component unmount
        return () => {
            clearInterval(timerId);
        };
    }, []); // Runs only on mount

    const daysOfWeek: string[] = [
        "Niedziela",
        "Poniedziałek",
        "Wtorek",
        "Środa",
        "Czwartek",
        "Piątek",
        "Sobota"
    ];

    // Format numbers to always have two digits (e.g., 09 instead of 9)
    const formatTimeUnit = (unit: number): string => {
        return unit.toString().padStart(2, '0');
    };

    const hours = formatTimeUnit(currentTime.getHours());
    const minutes = formatTimeUnit(currentTime.getMinutes());
    const seconds = formatTimeUnit(currentTime.getSeconds());
    const day = formatTimeUnit(currentTime.getDate());
    const month = formatTimeUnit(currentTime.getMonth() + 1);
    const year = formatTimeUnit(currentTime.getFullYear());
    const dayOfWeek = currentTime.getDay();

    return (
        <div className="kids-clock-wrapper"> {/* Optional wrapper for layout */}
            <div className="kids-clock">
                <div className="kids-clock-row">
                    <span className="kids-clock-segment">{hours}</span>
                    <span className="kids-clock-separator">:</span>
                    <span className="kids-clock-segment">{minutes}</span>
                    <span className="kids-clock-separator">:</span>
                    <span className="kids-clock-segment">{seconds}</span>
                </div>
                <div className="kids-clock-row-lower">
                    <span className="kids-clock-segment">{day}-{month}-{year} - {daysOfWeek[dayOfWeek].toUpperCase()}</span>
                </div>
            </div>
        </div>
                );
};

export default KidsClock;