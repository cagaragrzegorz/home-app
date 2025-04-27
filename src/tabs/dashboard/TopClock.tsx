import React, { useState, useEffect } from 'react';

// Simple functional clock component
const TopClock: React.FC = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000); // Update every second

        // Cleanup interval on component unmount
        return () => clearInterval(timerId);
    }, []); // Empty dependency array means effect runs only on mount

    // Format time as HH:MM
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
        <div>
            <div className="top-clock">
                <span>{hours}:{minutes}:{seconds} </span>
            </div>
            <div className="top-date">
                <span>{day}-{month}-{year} </span>
            </div>
            <div className="top-day">
                <span>{daysOfWeek[dayOfWeek]}</span>
            </div>
        </div>
    );
};

export default TopClock;