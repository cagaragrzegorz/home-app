import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import {Button} from 'react-bootstrap';
import {Equation, createEquationsForNumber, generateOptions, shuffle} from './equationUtils';

type Props = {
    selectedNumber: number;
    onRoundComplete: (correctCount: number) => void;
};

type AnsweredQuestion = {
    equation: Equation;
    selected: number;
    isCorrect: boolean;
};

type Phase = 'idle' | 'playing' | 'summary';

const ROUND_SECONDS = 10;

export const ChallengeMode: React.FC<Props> = ({selectedNumber, onRoundComplete}) => {
    const [phase, setPhase] = useState<Phase>('idle');
    const [timeLeft, setTimeLeft] = useState<number>(ROUND_SECONDS);
    const [queue, setQueue] = useState<Equation[]>([]);
    const [currentEquation, setCurrentEquation] = useState<Equation | null>(null);
    const [currentOptions, setCurrentOptions] = useState<number[]>([]);
    const [answered, setAnswered] = useState<AnsweredQuestion[]>([]);

    const answeredRef = useRef<AnsweredQuestion[]>([]);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        setPhase('idle');
        setAnswered([]);
        answeredRef.current = [];
        if (timerRef.current) clearInterval(timerRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedNumber]);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const pickNextEquation = (currentQueue: Equation[]): [Equation, Equation[]] => {
        let nextQueue = currentQueue;
        if (nextQueue.length === 0) {
            nextQueue = shuffle(createEquationsForNumber(selectedNumber));
        }
        const [next, ...rest] = nextQueue;
        return [next, rest];
    };

    const startRound = () => {
        const initialQueue = shuffle(createEquationsForNumber(selectedNumber));
        const [first, rest] = pickNextEquation(initialQueue);
        setAnswered([]);
        answeredRef.current = [];
        setCurrentEquation(first);
        setCurrentOptions(generateOptions(first));
        setQueue(rest);
        setTimeLeft(ROUND_SECONDS);
        setPhase('playing');

        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    if (timerRef.current) clearInterval(timerRef.current);
                    finishRound();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const finishRound = () => {
        setPhase('summary');
        setCurrentEquation(null);
        const correctCount = answeredRef.current.filter((a) => a.isCorrect).length;
        onRoundComplete(correctCount);
    };

    const handleAnswer = (option: number) => {
        if (!currentEquation || phase !== 'playing') return;
        const record: AnsweredQuestion = {
            equation: currentEquation,
            selected: option,
            isCorrect: option === currentEquation.answer,
        };
        const updatedAnswered = [...answeredRef.current, record];
        answeredRef.current = updatedAnswered;
        setAnswered(updatedAnswered);

        const [next, rest] = pickNextEquation(queue);
        setCurrentEquation(next);
        setCurrentOptions(generateOptions(next));
        setQueue(rest);
    };

    const correctCount = answered.filter((a) => a.isCorrect).length;

    if (phase === 'idle') {
        return (
            <Wrapper>
                <Button size="lg" onClick={startRound} style={{fontSize: '1.5rem', padding: '0.75rem 2rem'}}>
                    Start
                </Button>
            </Wrapper>
        );
    }

    if (phase === 'playing' && currentEquation) {
        return (
            <Wrapper>
                <Timer>{timeLeft}s</Timer>
                <EquationText>{currentEquation.base} × {currentEquation.multiplier} = ?</EquationText>
                <Options>
                    {currentOptions.map((option) => (
                        <Button
                            key={option}
                            variant="primary"
                            style={{fontSize: '1.5rem', minWidth: '72px', minHeight: '56px'}}
                            onClick={() => handleAnswer(option)}
                        >
                            {option}
                        </Button>
                    ))}
                </Options>
            </Wrapper>
        );
    }

    return (
        <Wrapper>
            <SummaryTitle>Wynik: {correctCount} / {answered.length}</SummaryTitle>
            <SummaryList>
                {answered.map((a, index) => (
                    <SummaryItem key={index} $isCorrect={a.isCorrect}>
                        {a.equation.base} × {a.equation.multiplier} = {a.equation.answer}
                        {a.isCorrect ? ' ✅' : ` ❌ (Twoja odpowiedź: ${a.selected})`}
                    </SummaryItem>
                ))}
            </SummaryList>
            <Button size="lg" onClick={startRound}>
                Zagraj ponownie
            </Button>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 1rem 0;
`;

const Timer = styled.div`
    font-size: 1.5rem;
    font-weight: 700;
    color: #c43b2d;
`;

const EquationText = styled.div`
    font-size: 2.5rem;
    font-weight: 700;
    @media (max-width: 576px) {
        font-size: 2rem;
    }
`;

const Options = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.75rem;
`;

const SummaryTitle = styled.div`
    font-size: 1.5rem;
    font-weight: 700;
`;

const SummaryList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    width: 100%;
    max-width: 320px;
    max-height: 40vh;
    overflow-y: auto;
`;

const SummaryItem = styled.div<{ $isCorrect: boolean }>`
    padding: 0.4rem 0.6rem;
    border-radius: 6px;
    font-size: 1rem;
    background-color: ${(props) => (props.$isCorrect ? '#d8f5ea' : '#fbdcd7')};
    color: ${(props) => (props.$isCorrect ? '#1f6b4e' : '#8a2a1f')};
`;
