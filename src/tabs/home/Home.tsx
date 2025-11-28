import React, {useContext, useEffect, useState} from 'react';
import styled from "styled-components";
import {Container} from "react-bootstrap";
import {AppContext} from "../../context/AppContext";

const formatTimeUnit = (unit: number): string => {
    return unit.toString().padStart(2, '0');
};

export const Home: React.FC = () => {
    const {appData} = useContext(AppContext);
    const [seconds, setSeconds] = useState<number>(0);
    const [minutes, setMinutes] = useState<number>(0);
    const [hours, setHours] = useState<number>(0);
    const [day, setDay] = useState<number>(0);
    const [month, setMonth] = useState<number>(0);
    const [year, setYear] = useState<number>(0);

    useEffect(() => {
        const currentTime = new Date(appData.timestamp)
        setSeconds(currentTime.getSeconds());
        setMinutes(currentTime.getMinutes());
        setHours(currentTime.getHours());
        setDay(currentTime.getDate());
        setMonth(currentTime.getMonth() + 1);
        setYear(currentTime.getFullYear());
    }, []);

    useEffect(() => {
        const currentTime = new Date(appData.timestamp)
        setSeconds(currentTime.getSeconds());
        if (seconds == 59) {
            setMinutes(currentTime.getMinutes());
            if (minutes == 59) {
                setHours(currentTime.getHours());
                if (hours == 23) {
                    setDay(currentTime.getDate());
                    if (day >= new Date(year, month - 1, 0).getDate()) {
                        setMonth(currentTime.getMonth() + 1);
                        setYear(currentTime.getFullYear());
                    }
                }
            }
        }
    }, [appData.timestamp]);


    return (
        <Container>
            <ClockWrapper>
                <Clock>
                    <ClockSegment>{formatTimeUnit(hours)}</ClockSegment>
                    <ClockSeparator>:</ClockSeparator>
                    <ClockSegment>{formatTimeUnit(minutes)}</ClockSegment>
                    <ClockSeparator>:</ClockSeparator>
                    <ClockSegment>{formatTimeUnit(seconds)}</ClockSegment>
                    <div style={{fontSize: '2.5rem'}}>
                        <ClockSegment>{formatTimeUnit(day)}-{formatTimeUnit(month)}-{formatTimeUnit(year)}
                            - {appData.day.toUpperCase()}</ClockSegment>
                    </div>
                </Clock>
            </ClockWrapper>
        </Container>
    );
};

const ClockWrapper = styled.div`
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
`
const Clock = styled.div`
    text-shadow: 4px 5px 4px rgba(0, 0, 0, 0.3);
    font-weight: 700;
    font-size: 4.5rem;
    color: white;
    letter-spacing: 1px;
    @media (max-width: 555px) {
        font-size: 3.5rem;
    }
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