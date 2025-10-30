import React, {CSSProperties, useEffect, useState} from 'react';
import {Volume2, VolumeOff} from "lucide-react";
import notificationSound from '../../assets/sounds/notification.mp3';
import {Button, Col, Container, ListGroup, Row} from "react-bootstrap";
import styled from "styled-components";

type Stage = {
    name: string;
    durationInSeconds: number;
};

interface RoutineStartTime {
    hour: number;
    minute: number;
    second: number;
}

const initialStages: Stage[] = [
    {name: '⏰ 🥱 Wstawanie - 15 minut', durationInSeconds: 15 * 60},
    {name: '👚 👗 Ubieranie się - 10 minut', durationInSeconds: 10 * 60},
    {name: '🍽️ 🥣 Śniadanie - 20 minut', durationInSeconds: 20 * 60},
    {name: '𖥈 🪥🦷 Czesanie i mycie zębów - 5 minut', durationInSeconds: 5 * 60},
    {name: '👟 🧥 Ubieranie butów i kurtek - 5 minut', durationInSeconds: 5 * 60},
    {name: '🚶🏻 🚗💨 Wychodzenie z mieszkania - 5 minut', durationInSeconds: 5 * 60},
];

const initialRoutineStartTime: RoutineStartTime = {
    hour: 6,
    minute: 30,
    second: 0,
};

// const stages: Stage[] = [
//     { name: '⏰ 🥱 Wstawanie - 5 minut', durationInSeconds: 5*60 },
//     { name: '🛁 🧴 Prysznic - 15 minut', durationInSeconds: 15*60 },
//     { name: '👚 👗 Ubieranie się - 5 minut', durationInSeconds: 5*60 },
//     { name: '🍽️ 🥣 Śniadanie - 20 minut', durationInSeconds: 20*60 },
//     { name: '𖥈 🪥🦷 Czesanie i mycie zębów - 5 minut', durationInSeconds: 5*60 },
//     { name: '👟 🧥 Ubieranie butów i kurtek - 5 minut', durationInSeconds: 5*60 },
//     { name: '🚶🏻 🚗💨 Wychodzenie z mieszkania - 5 minut', durationInSeconds: 5*60 },
// ];
export const MorningRoutine: React.FC = () => {
    // morning routine stages
    const [stages, setStages] = useState<Stage[]>(initialStages)
    const [currentStageIndex, setCurrentStageIndex] = useState(9);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isBeforeRoutine, setIsBeforeRoutine] = useState(false);
    const [isRoutineActive, setIsRoutineActive] = useState(false);
    const [isAfterRoutine, setIsAfterRoutine] = useState(false);
    const [routineStartTime, setRoutineStartTime] = useState<RoutineStartTime>(initialRoutineStartTime)

    const [isStageTimeCalculated, setIsStageTimeCalculated] = useState(false);
    const [timeLeft, setTimeLeft] = useState("00:00:00");
    const todayTargetTime = new Date().setHours(routineStartTime.hour, routineStartTime.minute, routineStartTime.second);
    const totalStageTime = stages.reduce((acc, stage) => acc + stage.durationInSeconds, 0);

    const [demoMode, setDemoMode] = useState<boolean>(false);
    // audio
    const [audioMuted, setAudioMuted] = useState<boolean>(false);
    const [audio] = useState(() => {
        const audioElement = new Audio(notificationSound);
        audioElement.controls = true;
        return audioElement;
    });

    const calculateStageTime = (timeElapsed: number) => {
        let accumulatedTime = 0;
        for (let i = 0; i < stages.length; i++) {
            accumulatedTime += stages[i].durationInSeconds;
            if (timeElapsed < accumulatedTime) {
                console.log(`Setting stage to ${i}, elapsed time: ${timeElapsed - (accumulatedTime - stages[i].durationInSeconds)}`);
                setCurrentStageIndex(i);
                setElapsedTime(timeElapsed - (accumulatedTime - stages[i].durationInSeconds));
                setIsStageTimeCalculated(true);
                break;
            }
        }

    }

    //Countdown to routine start
    useEffect(() => {
        const clockInterval = setInterval(() => {
            const target = new Date(todayTargetTime).getTime();
            const targetPlusStages = new Date(new Date(todayTargetTime).getTime() + totalStageTime * 1000).getTime();
            const now = new Date().getTime();
            let remaining = target - now;

            if (remaining > 0) {
                setIsBeforeRoutine(true);
            } else if (remaining <= 0 && (remaining * (-1) <= (totalStageTime + 2) * 1000)) {
                setIsBeforeRoutine(false);
                setIsRoutineActive(true);
                setTimeLeft("00:00:00");
            } else {
                setIsRoutineActive(false);
                setIsAfterRoutine(true);
                remaining = now - targetPlusStages;
            }

            if (isRoutineActive && !isStageTimeCalculated) {
                calculateStageTime(Math.floor(Math.abs(remaining) / 1000));
            } else if (isRoutineActive && isStageTimeCalculated) {
                setElapsedTime((prev) => {
                    if (currentStageIndex >= stages.length) return prev;
                    const currentDuration = prev + 1;
                    if (currentDuration >= stages[currentStageIndex].durationInSeconds) {
                        setCurrentStageIndex((prevIndex) => prevIndex + 1);
                        if (!audioMuted) audio.play()
                        return 0;
                    }
                    return currentDuration;
                });
            }

            if (isAfterRoutine) {
                remaining = now - targetPlusStages;
            }

            const hours = Math.abs(Math.floor(remaining / (1000 * 60 * 60)));
            const minutes = Math.abs(Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60)));
            const seconds = Math.abs(Math.floor((remaining % (1000 * 60)) / 1000));

            const formatted = [
                hours.toString().padStart(2, "0"),
                minutes.toString().padStart(2, "0"),
                seconds.toString().padStart(2, "0"),
            ].join(":");

            setTimeLeft(formatted);
        }, 1000);
        return () => clearInterval(clockInterval);
    }, [todayTargetTime]);

    //start stage in proper state after reload
    useEffect(() => {
        if (isRoutineActive) {
            setCurrentStageIndex(0);
        }
    }, [isRoutineActive]);


    const getRemainingTime = (duration: number, elapsed: number) => {
        const remaining = duration - elapsed;
        const minutes = Math.floor(remaining / 60);
        const seconds = remaining % 60;
        return `${minutes.toString().padStart(2, '0')} min ${seconds.toString().padStart(2, '0')} sek`;
    };

    const toggleSoundMute = () => {
        if (audioMuted) {
            setAudioMuted(false);
        } else {
            setAudioMuted(true);
            audio.pause();
            audio.load();
        }
    };

    const runDemoMode = () => {
        setStages([
            {name: '⏰ 🥱 Wstawanie - 5 sekund - DEMO', durationInSeconds: 5},
            {name: '👚 👗 Ubieranie się - 5 sekund - DEMO', durationInSeconds: 5},
            {name: '🍽️ 🥣 Śniadanie - 5 sekund - DEMO', durationInSeconds: 5},
            {name: '𖥈 🪥🦷 Czesanie i mycie zębów - 5 sekund - DEMO', durationInSeconds: 5},
            {name: '👟 🧥 Ubieranie butów i kurtek - 5 sekund - DEMO', durationInSeconds: 5},
            {name: '🚶🏻 🚗💨 Wychodzenie z mieszkania - 5 sekund - DEMO', durationInSeconds: 5},
        ]);
        const demoStartTime = new Date();
        const demoStartHour = demoStartTime.getHours();
        const demoStartMinute = demoStartTime.getMinutes();
        const demoStartSecond = demoStartTime.getSeconds()
        setRoutineStartTime({hour: demoStartHour, minute: demoStartMinute, second: demoStartSecond} as RoutineStartTime)
        setIsBeforeRoutine(false);
        setIsAfterRoutine(false);
        setIsRoutineActive(true);
        setDemoMode(true);
        setIsStageTimeCalculated(false)
        setCurrentStageIndex(0)
    }

    const initiateStandardRoutine = () => {
        setStages(initialStages);
        setRoutineStartTime(initialRoutineStartTime)
        setCurrentStageIndex(99)
        setDemoMode(false);
        setIsStageTimeCalculated(false)
        setIsBeforeRoutine(false);
        setIsAfterRoutine(false);
        setIsRoutineActive(false);
    }

    return (
        <Container style={{padding: 0, fontFamily: 'Arial, sans-serif'}}>
            <div className="flex-row-reverse mb-2" style={{textAlign: 'right'}}>
                <Button
                    onClick={toggleSoundMute}
                    style={{
                        backgroundColor: audioMuted ? '#e1a1a1' : '#4CAF50',
                        border: `1px solid ${audioMuted ? '#e1a1a1' : '#4CAF50'}`,
                        marginRight: '10px',
                    }}
                >
                    {audioMuted ? <VolumeOff/> : <Volume2/>}
                </Button>
                <Button
                    onClick={demoMode ? initiateStandardRoutine : runDemoMode}
                > <strong>{demoMode ? 'RESET' : 'DEMO'}</strong> </Button>
            </div>


            <Row className="position-relative m-0">
                {isBeforeRoutine && <OverlayContainer>
                    <OverlayContent>
                        {demoMode && "TRYB DEMO AKTYWNY! ⏱️🚀"} <br/>
                        Rutyna rozpocznie się za <br/> {timeLeft}
                    </OverlayContent>
                </OverlayContainer>
                }

                {isAfterRoutine && <OverlayContainer>
                    <OverlayContent>
                        {demoMode && <>"TRYB DEMO AKTYWNY! ⏱️🚀" <br/></>}
                        Jest już po rutynie: <br/> {timeLeft}
                    </OverlayContent>
                </OverlayContainer>}

                <ListGroup style={{listStyleType: 'none', padding: 0}}>
                    {stages.map((stage, index) => {
                        const isActive = index === currentStageIndex;
                        const isLastStage = index === stages.length - 1;
                        let progress = 0;

                        if (isActive && stage.durationInSeconds > 0) {
                            progress = Math.min(((elapsedTime + 1) / stage.durationInSeconds) * 100, 100);
                        } else if (index < currentStageIndex) {
                            progress = 100;
                        } else {
                            progress = 0;
                        }

                        return (
                            <ListGroup.Item key={index} style={listGroupItemStyle(isActive, isLastStage)}>
                                <Col
                                    style={{fontSize: '1.2rem', marginBottom: '0.5rem', textAlign: 'left'}}>
                                    {stage.name}
                                    {isActive && (
                                        <div style={{marginBottom: '0.5rem', textAlign: 'end', float: 'right'}}>
                                            Pozostało: {getRemainingTime(stage.durationInSeconds, elapsedTime)}
                                        </div>
                                    )}
                                </Col>
                                <ProgressBarContainer>
                                    <ProgressBarFiller progress={progress} isActive={isActive}/>
                                </ProgressBarContainer>
                            </ListGroup.Item>
                        );
                    })}
                </ListGroup>
            </Row>
        </Container>
    );
};

const listGroupItemStyle = (isActive: boolean, isLastStage: boolean): CSSProperties => {
    return {
        padding: isActive ? '1rem 1rem' : '0.5rem 1rem',
        marginBottom: isLastStage ? 0 : '1rem',
        border: "none",
        backgroundColor: isActive ? '#4caf50' : '#e0e0e0',
        color: isActive ? '#fff' : '#000',
        fontWeight: isActive ? 'bold' : 'normal',
        borderRadius: '8px',
        transition: 'background-color 1s ease',
        boxShadow: isActive ? '0 0 10px rgba(0,0,0,0.3)' : 'none',
        display: 'grid',
    }
}

const OverlayContainer = styled(Col)`
    position: absolute;
    inset: 0px;
    background-color: rgba(136, 136, 136, 0.8);
    z-index: 10;
    border-radius: 8px;
    font-weight: 600;
    font-size: 2.5rem;
    font-family: monospace;
    color: white;
`;

const OverlayContent = styled(Col)`
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-shadow: 2px 3px 12px #0a0a0a;
`;

const ProgressBarContainer = styled.div`
    height: 10px;
    background-color: #ccc;
    border-radius: 5px;
    overflow: hidden;
`;

const ProgressBarFiller = styled.div<{ progress: number; isActive: boolean }>`
    width: ${props => props.progress}%;
    height: 100%;
    background-color: ${props => (props.isActive ? '#fff' : '#888')};
    transition: width 1s linear;
`;

