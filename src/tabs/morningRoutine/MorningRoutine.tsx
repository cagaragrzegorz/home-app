import React, {CSSProperties, useEffect, useState} from 'react';
import {Volume2, VolumeOff} from "lucide-react";
import notificationSound from '../../assets/sounds/notification.mp3';

type Stage = {
    name: string;
    durationInSeconds: number;
};

const stages: Stage[] = [
    { name: '⏰ 🥱 Wstawanie - 15 minut', durationInSeconds: 15*60 },
    { name: '👚 👗 Ubieranie się - 10 minut', durationInSeconds: 10*60 },
    { name: '🍽️ 🥣 Śniadanie - 20 minut', durationInSeconds: 20*60 },
    { name: '𖥈 🪥🦷 Czesanie i mycie zębów - 5 minut', durationInSeconds: 5*60 },
    { name: '👟 🧥 Ubieranie butów i kurtek - 5 minut', durationInSeconds: 5*60 },
    { name: '🚶🏻 🚗💨 Wychodzenie z mieszkania - 5 minut', durationInSeconds: 5*60 },
];

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
    const [currentStageIndex, setCurrentStageIndex] = useState(9);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isBeforeRoutine, setIsBeforeRoutine] = useState(false);
    const [isRoutineActive, setIsRoutineActive] = useState(false);
    const [isAfterRoutine, setIsAfterRoutine] = useState(false);
    const routineStartTime= {
        hour: 6,
        minute: 30,
        second: 0,
    };
    const [isStageTimeCalculated, setIsStageTimeCalculated] = useState(false);
    const [timeLeft, setTimeLeft] = useState("00:00:00");
    const todayTargetTime = new Date().setHours(routineStartTime.hour, routineStartTime.minute, routineStartTime.second);
    const totalStageTime = stages.reduce((acc, stage) => acc + stage.durationInSeconds, 0);

    // audio
    const [buttonColor, setButtonColor] = useState<string>('#4CAF50');
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

            if (remaining > 0 ) {
                setIsBeforeRoutine(true);
            } else if(remaining <= 0 && (remaining*(-1) <= (totalStageTime+2) * 1000)){
                setIsBeforeRoutine(false);
                setIsRoutineActive(true);
                setTimeLeft("00:00:00");
            } else {
                setIsRoutineActive(false);
                setIsAfterRoutine(true);
                remaining = now - targetPlusStages;
            }

            if (isRoutineActive && !isStageTimeCalculated){
                calculateStageTime(Math.floor(Math.abs(remaining)/1000));
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

            if(isAfterRoutine){
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
        if (isRoutineActive){
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
            setButtonColor('#4CAF50');
            setAudioMuted(false);
        } else {
            setButtonColor('#e1a1a1');
            setAudioMuted(true);
            audio.pause();
            audio.load();
        }
    };

    const overlayStyle: CSSProperties = {
        position: "absolute",
        inset: "0px",
        backgroundColor: "rgb(136 136 136 / 59%)",
        zIndex: "10",
        borderRadius: "8px",
        fontWeight: "600",
        fontSize: "2.5rem",
        fontFamily: "monospace"
    }

    return (
        <div style={{fontFamily: 'Arial, sans-serif'}}>
                <div style={{marginBottom: "10px"}}>
                    <button
                        type="button"
                        onClick={toggleSoundMute}
                        style={{
                            padding: '10px 20px',
                            fontSize: '16px',
                            backgroundColor: buttonColor,
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                    >
                        {audioMuted ? <VolumeOff color="white"/> : <Volume2 color="white"/>}
                    </button>
                </div>

                <div className="position-relative">
                    {isBeforeRoutine &&
                        <div className="text-white p-3" style={overlayStyle}>
                            <div style={{
                                height: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                Rutyna rozpocznie się za
                                <br/>
                                {timeLeft}
                            </div>
                        </div>}

                    {isAfterRoutine &&
                        <div className="text-white p-3" style={overlayStyle}>
                            <div style={{
                                height: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                Jest już po rutynie:
                            <br/>
                                {timeLeft}
                            </div>
                        </div>}
                <ul style={{listStyleType: 'none', padding: 0}}>
                    {stages.map((stage, index) => {
                        const isActive = index === currentStageIndex;
                        let progress = 0;

                        if (isActive && stage.durationInSeconds > 0) {
                            progress = Math.min(((elapsedTime + 1) / stage.durationInSeconds) * 100, 100);
                        } else if (index < currentStageIndex) {
                            progress = 100;
                        } else {
                            progress = 0;
                        }

                        return (
                            <li
                                key={index}
                                style={{
                                    padding: '0.5rem 1rem',
                                    marginBottom: '1rem',
                                    backgroundColor: isActive ? '#4caf50' : '#e0e0e0',
                                    color: isActive ? '#fff' : '#000',
                                    fontWeight: isActive ? 'bold' : 'normal',
                                    borderRadius: '8px',
                                    transition: 'background-color 0.5s ease',
                                    boxShadow: isActive ? '0 0 10px rgba(0,0,0,0.3)' : 'none',
                                }}
                            >
                                <div
                                    style={{fontSize: '1.2rem', marginBottom: '0.5rem', textAlign: 'left'}}>{stage.name}
                                    {isActive && (
                                        <div style={{marginBottom: '0.5rem', textAlign: 'end', float: 'right'}}>
                                            Pozostało: {getRemainingTime(stage.durationInSeconds, elapsedTime)}
                                        </div>
                                    )}
                                </div>
                                <div
                                    style={{
                                        height: '10px',
                                        backgroundColor: '#ccc',
                                        borderRadius: '5px',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <div
                                        style={{
                                            width: `${progress}%`,
                                            height: '100%',
                                            backgroundColor: isActive ? '#fff' : '#888',
                                            transition: 'width 1s linear',
                                        }}
                                    />
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};
