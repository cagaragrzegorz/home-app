import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {Button, Form} from 'react-bootstrap';
import {Equation, randomEquationForNumber} from './equationUtils';

type Props = {
    selectedNumber: number;
};

export const TypeMode: React.FC<Props> = ({selectedNumber}) => {
    const [equation, setEquation] = useState<Equation>(() => randomEquationForNumber(selectedNumber));
    const [input, setInput] = useState<string>('');
    const [checked, setChecked] = useState<boolean>(false);

    useEffect(() => {
        nextEquation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedNumber]);

    const nextEquation = () => {
        setEquation(randomEquationForNumber(selectedNumber));
        setInput('');
        setChecked(false);
    };

    const handleCheck = () => {
        if (input.trim() === '') return;
        setChecked(true);
    };

    const isCorrect = Number(input) === equation.answer;

    return (
        <Wrapper>
            <EquationText>{equation.base} × {equation.multiplier} = ?</EquationText>
            <Form.Control
                type="number"
                value={input}
                disabled={checked}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !checked) handleCheck();
                }}
                style={{maxWidth: '200px', fontSize: '1.5rem', textAlign: 'center'}}
                autoFocus
            />
            {!checked && (
                <Button size="lg" onClick={handleCheck}>
                    Sprawdź
                </Button>
            )}
            {checked && (
                <>
                    <Feedback $isCorrect={isCorrect}>
                        {isCorrect ? 'Brawo! 🎉' : `Niestety. Poprawna odpowiedź: ${equation.answer}`}
                    </Feedback>
                    <Button size="lg" onClick={nextEquation}>
                        Następne
                    </Button>
                </>
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

const EquationText = styled.div`
    font-size: 2.5rem;
    font-weight: 700;
    @media (max-width: 576px) {
        font-size: 2rem;
    }
`;

const Feedback = styled.div<{ $isCorrect: boolean }>`
    font-size: 1.25rem;
    font-weight: 600;
    color: ${(props) => (props.$isCorrect ? '#2f9e6f' : '#c43b2d')};
    text-align: center;
`;
