import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {Button} from 'react-bootstrap';
import {Equation, generateOptions, randomEquationForNumber} from './equationUtils';

type Props = {
    selectedNumber: number;
};

export const PracticeMode: React.FC<Props> = ({selectedNumber}) => {
    const [equation, setEquation] = useState<Equation>(() => randomEquationForNumber(selectedNumber));
    const [options, setOptions] = useState<number[]>(() => generateOptions(equation));
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

    useEffect(() => {
        nextEquation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedNumber]);

    const nextEquation = () => {
        const newEquation = randomEquationForNumber(selectedNumber);
        setEquation(newEquation);
        setOptions(generateOptions(newEquation));
        setSelectedAnswer(null);
    };

    const handleAnswer = (option: number) => {
        if (selectedAnswer !== null) return;
        setSelectedAnswer(option);
    };

    const isAnswered = selectedAnswer !== null;
    const isCorrect = selectedAnswer === equation.answer;

    return (
        <Wrapper>
            <Equation>{equation.base} × {equation.multiplier} = ?</Equation>
            <Options>
                {options.map((option) => (
                    <OptionButton
                        key={option}
                        $state={
                            !isAnswered
                                ? 'default'
                                : option === equation.answer
                                    ? 'correct'
                                    : option === selectedAnswer
                                        ? 'wrong'
                                        : 'default'
                        }
                        disabled={isAnswered}
                        onClick={() => handleAnswer(option)}
                    >
                        {option}
                    </OptionButton>
                ))}
            </Options>
            {isAnswered && (
                <Feedback $isCorrect={isCorrect}>
                    {isCorrect ? 'Brawo! 🎉' : `Spróbuj jeszcze raz. Poprawna odpowiedź: ${equation.answer}`}
                </Feedback>
            )}
            {isAnswered && (
                <Button size="lg" onClick={nextEquation} style={{marginTop: '1rem'}}>
                    Następne
                </Button>
            )}
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

const Equation = styled.div`
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

const stateColor = (state: 'default' | 'correct' | 'wrong'): string | undefined => {
    switch (state) {
        case 'correct':
            return '#45d0a3';
        case 'wrong':
            return '#f44d3c';
        default:
            return undefined;
    }
};

const OptionButton = styled(Button).attrs({variant: 'primary'})<{ $state: 'default' | 'correct' | 'wrong' }>`
    font-size: 1.5rem;
    min-width: 72px;
    min-height: 56px;
    background-color: ${(props) => stateColor(props.$state)};
    border-color: ${(props) => stateColor(props.$state)};

    &:disabled {
        background-color: ${(props) => stateColor(props.$state)};
        border-color: ${(props) => stateColor(props.$state)};
        opacity: 1;
    }
`;

const Feedback = styled.div<{ $isCorrect: boolean }>`
    font-size: 1.25rem;
    font-weight: 600;
    color: ${(props) => (props.$isCorrect ? '#2f9e6f' : '#c43b2d')};
    text-align: center;
`;
