import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {Weekday} from "../../types/types";

export const Home: React.FC = () => {
    const [currentTime, setCurrentTime] = useState<Date>(new Date());

    useEffect(() => {
        const timerId = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        // Cleanup interval on component unmount
        return () => {
            clearInterval(timerId);
        };
    }, []);

    const daysOfWeek: Weekday[] = [
        "Niedziela",
        "Poniedziałek",
        "Wtorek",
        "Środa",
        "Czwartek",
        "Piątek",
        "Sobota"
    ];

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
        <ClockWrapper>
            <Clock>
                <div style={{margin: '-20px'}}>
                    <ClockSegment>{hours}</ClockSegment>
                    <ClockSeparator>:</ClockSeparator>
                    <ClockSegment >{minutes}</ClockSegment>
                    <ClockSeparator >:</ClockSeparator>
                    <ClockSegment >{seconds}</ClockSegment>
                </div>
                <div style={{fontSize: 38}}>
                    <ClockSegment>{day}-{month}-{year} - {daysOfWeek[dayOfWeek].toUpperCase()}</ClockSegment>
                </div>
            </Clock>
        </ClockWrapper>
    );
};

const ClockWrapper = styled.div`
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 555px;
`
const Clock = styled.div`
    text-shadow: 4px 5px 4px rgba(0, 0, 0, 0.3);
    font-weight: 700;
    font-size: 5rem;
    color: white;
    padding: 20px 35px;
    letter-spacing: 1px;
`
const ClockSegment = styled.span`
    display: inline-block;
    min-width: 1.5em;
    transition: transform 0.2s ease;
`

const ClockSeparator = styled.span`
    margin: 0 5px;
    opacity: 0.8;
    position: relative;
    top: -4px;
`