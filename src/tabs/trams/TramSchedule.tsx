import React, {useEffect, useState, useRef} from 'react';
import {
    Card,
    Spinner,
    ListGroup,
    Alert,
    Row,
    Col,
    OverlayTrigger,
    Tooltip,
    Tabs,
    Tab,
} from 'react-bootstrap';

import './TramSchedule.css';
import {tramScheduleData} from "./TramSchedule.data";

type TimetableRow = {
    hour: number;
    minutes: string[];
};

type Timetable = {
    dayName: string;
    isInEffect: boolean;
    rows: TimetableRow[];
    legend: string[]
};

export type TramScheduleData = {
    departureId: {
        variantId: string;
        stopId: number;
    };
    timetables: Timetable[];
    description: string;
    validFrom: string;
    carrierDescription: {
        namePl: string;
        nameEn: string;
        descriptionPl: string;
        descriptionEn: string;
    };
};

const TramSchedule: React.FC = () => {
    const [schedule, setSchedule] = useState<TramScheduleData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [activeDay, setActiveDay] = useState<string | null>(null);
    const [highlightedRowKey, setHighlightedRowKey] = useState<string | null>(null);
    const [nextDepartureTime, setNextDepartureTime] = useState<Date | null>(null);
    const [countdown, setCountdown] = useState<string>('');
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // const fetchConfig = async (): Promise<void> => {
        //     fetchTramScheduleDetails().then((data: TramScheduleData) => {
        //         setSchedule(data);
        //         calculateNextDeparture(data);
        //     })
        // }
        // fetchConfig()

        setSchedule(tramScheduleData);
        calculateNextDeparture(tramScheduleData);

        const current = tramScheduleData.timetables.find(t => t.isInEffect);
        if (current) setActiveDay(current.dayName);

        setLoading(false);
    }, [])

    useEffect(() => {
        if (nextDepartureTime) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            intervalRef.current = setInterval(() => {
                const now = new Date();
                const diffMs = nextDepartureTime.getTime() - now.getTime();
                if (diffMs <= 0) {
                    if (schedule) calculateNextDeparture(schedule);
                } else {
                    const diffSec = Math.floor(diffMs / 1000);
                    const min = Math.floor(diffSec / 60);
                    const sec = diffSec % 60;
                    setCountdown(`${min} min ${sec} sek`);
                }
            }, 1000);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [nextDepartureTime]);

    const calculateNextDeparture = (data: TramScheduleData) => {
        const now = new Date();
        const todayTimetable = data.timetables.find(t => t.isInEffect);
        if (!todayTimetable) return;

        for (const row of todayTimetable.rows) {
            if (row.hour < now.getHours()) continue;
            for (const minuteStr of row.minutes) {
                const minute = parseInt(minuteStr, 10);
                if (row.hour > now.getHours() || minute > now.getMinutes()) {
                    const departure = new Date();
                    departure.setHours(row.hour, minute, 0, 0);
                    setNextDepartureTime(departure);
                    setHighlightedRowKey(`${row.hour}-${minuteStr}`);
                    return;
                }
            }
        }
        setNextDepartureTime(null);
        setHighlightedRowKey(null);
    };

    return (
            <Card>
                {/*<Card.Header>*/}
                {/*    Rozkład jazdy tramwaju*/}
                {/*    <Button variant="outline-primary" size="sm" className="float-end" onClick={fetchTramScheduleDetails}>*/}
                {/*        Odśwież*/}
                {/*    </Button>*/}
                {/*</Card.Header>*/}
                <Card.Body>
                    {loading ? (
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Ładowanie...</span>
                        </Spinner>
                    ) : schedule ? (
                        <>
                            <Card.Title style={{textAlign: "center"}}>Linia: 20 - Przystanek: Mały Płaszów (id: {schedule.departureId.stopId})
                            </Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">
                                Operator: {schedule.carrierDescription.namePl}
                            </Card.Subtitle>

                            {nextDepartureTime && (
                                <Alert variant="info">
                                    <strong>Najbliższy
                                        odjazd:</strong> {nextDepartureTime.toLocaleTimeString()} (za {countdown})
                                </Alert>
                            )}

                            {schedule.timetables
                                .filter(t => t.isInEffect)
                                .map((t, index) => (
                                    <Alert key={index} variant="success" className="mb-3">
                                        <strong>Obowiązujący rozkład:</strong> {t.dayName}
                                    </Alert>
                                ))}

                            <Tabs
                                activeKey={activeDay ?? ''}
                                onSelect={(k) => {
                                    setActiveDay(k ?? '');
                                    if (schedule) calculateNextDeparture(schedule);
                                }}
                                className="mb-3"
                            >
                                {schedule.timetables.map((timetable) => (
                                    <Tab eventKey={timetable.dayName} title={timetable.dayName} key={timetable.dayName}>

                                        <ListGroup>
                                            {timetable.rows.map((row) => (
                                                <ListGroup.Item
                                                    key={`${timetable.dayName}-${row.hour}`}
                                                    className={timetable.isInEffect && row.minutes.some(min => `${row.hour}-${min}` === highlightedRowKey) ? 'highlight-row' : ''}
                                                >
                                                    <Row>
                                                        <Col xs={3} sm={2}>
                                                            <strong>{row.hour.toString().padStart(2, '0')}</strong>
                                                        </Col>
                                                        <Col xs={9} sm={10} className="text-start d-flex flex-wrap">
                                                            {row.minutes.map((minuteStr, index) => {
                                                                const now = new Date();
                                                                const hour = row.hour;
                                                                const minute = parseInt(minuteStr, 10);
                                                                const departureTime = new Date();
                                                                departureTime.setHours(hour, minute, 0, 0);
                                                                const diffMs = departureTime.getTime() - now.getTime();

                                                                let color = 'inherit';
                                                                let pulseClass = '';
                                                                if (timetable.isInEffect){
                                                                    console.log('${hour}-${minuteStr}: ', `${hour}-${minute}`, `${nextDepartureTime?.getHours()}-${nextDepartureTime?.getMinutes()}`);
                                                                    if (`${hour}-${minute}` === `${nextDepartureTime?.getHours()}-${nextDepartureTime?.getMinutes()}`) {
                                                                        color = 'green';
                                                                        pulseClass = 'pulse';
                                                                    }
                                                                }

                                                                const formattedTime = `${hour.toString().padStart(2, '0')}:${minuteStr}`;

                                                                return (
                                                                    <OverlayTrigger
                                                                        key={index}
                                                                        placement="top"
                                                                        overlay={<Tooltip id={`tooltip-${index}`}>Odjazd
                                                                            o {formattedTime}</Tooltip>}
                                                                    >
                                    <span
                                        className={pulseClass}
                                        style={{
                                            marginRight: '1.5rem',
                                            color,
                                            fontWeight: timetable.isInEffect && diffMs >= 0 ? 'bold' : 'normal',
                                            cursor: 'pointer',
                                        }}
                                    >
                                      {minuteStr}
                                    </span>
                                                                    </OverlayTrigger>
                                                                );
                                                            })}
                                                        </Col>
                                                    </Row>
                                                </ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                    </Tab>
                                ))}
                            </Tabs>
                        </>
                    ) : (
                        <Alert variant="danger">Nie udało się załadować rozkładu jazdy.</Alert>
                    )}
                </Card.Body>
            </Card>
    );
};

export default TramSchedule;
