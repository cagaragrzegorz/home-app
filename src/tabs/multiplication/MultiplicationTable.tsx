import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {Button, Card, Container} from 'react-bootstrap';
import {Medal} from 'lucide-react';
import {PracticeMode} from './PracticeMode';
import {TypeMode} from './TypeMode';
import {ChallengeMode} from './ChallengeMode';
import {MedalType, MedalsByNumber, getMedalForScore, loadMedals, medalRank, saveMedals, MEDAL_COLORS, MEDAL_LABELS} from './medals';

type Mode = 'practice' | 'type' | 'challenge';

const NUMBERS = Array.from({length: 12}, (_, i) => i + 1);

export const MultiplicationTable: React.FC = () => {
    const [selectedNumber, setSelectedNumber] = useState<number>(1);
    const [mode, setMode] = useState<Mode>('practice');
    const [medals, setMedals] = useState<MedalsByNumber>(() => loadMedals());

    useEffect(() => {
        saveMedals(medals);
    }, [medals]);

    const handleRoundComplete = (number: number, correctCount: number) => {
        const earnedMedal = getMedalForScore(correctCount);
        setMedals((prev) => {
            const existing: MedalType = prev[number] ?? null;
            if (medalRank(earnedMedal) > medalRank(existing)) {
                return {...prev, [number]: earnedMedal};
            }
            return prev;
        });
    };

    const currentMedal: MedalType = medals[selectedNumber] ?? null;

    return (
        <Container style={{padding: 0}}>
            <Card>
                <Card.Body>
                    <Layout>
                        <NumberColumn>
                            {NUMBERS.map((n) => (
                                <NumberButton
                                    key={n}
                                    $isSelected={n === selectedNumber}
                                    onClick={() => setSelectedNumber(n)}
                                >
                                    {n}
                                </NumberButton>
                            ))}
                        </NumberColumn>

                        <CenterColumn>
                            {currentMedal && (
                                <CurrentMedalBanner>
                                    <Medal size={20} color={MEDAL_COLORS[currentMedal]}/>
                                    {MEDAL_LABELS[currentMedal]}
                                </CurrentMedalBanner>
                            )}
                            <ModeSwitch>
                                <Button
                                    variant={mode === 'practice' ? 'primary' : 'outline-secondary'}
                                    onClick={() => setMode('practice')}
                                >
                                    Praktyka
                                </Button>
                                <Button
                                    variant={mode === 'type' ? 'primary' : 'outline-secondary'}
                                    onClick={() => setMode('type')}
                                >
                                    Wpisz wynik
                                </Button>
                                <Button
                                    variant={mode === 'challenge' ? 'primary' : 'outline-secondary'}
                                    onClick={() => setMode('challenge')}
                                >
                                    Wyzwanie
                                </Button>
                            </ModeSwitch>

                            {mode === 'practice' && <PracticeMode selectedNumber={selectedNumber}/>}
                            {mode === 'type' && <TypeMode selectedNumber={selectedNumber}/>}
                            {mode === 'challenge' && (
                                <ChallengeMode
                                    selectedNumber={selectedNumber}
                                    onRoundComplete={(correctCount) => handleRoundComplete(selectedNumber, correctCount)}
                                />
                            )}
                        </CenterColumn>

                        <MedalColumn>
                            {NUMBERS.filter((n) => medals[n]).map((n) => (
                                <MedalBadge
                                    key={n}
                                    $isSelected={n === selectedNumber}
                                    title={`${n}: ${MEDAL_LABELS[medals[n] as Exclude<MedalType, null>]}`}
                                    onClick={() => setSelectedNumber(n)}
                                >
                                    <Medal size={16} color={MEDAL_COLORS[medals[n] as Exclude<MedalType, null>]}/>
                                    <span>{n}</span>
                                </MedalBadge>
                            ))}
                        </MedalColumn>
                    </Layout>
                </Card.Body>
            </Card>
        </Container>
    );
};

const Layout = styled.div`
    display: flex;
    gap: 0.75rem;
    align-items: stretch;
`;

const NumberColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    overflow-y: auto;
    max-height: calc(100vh - 160px);
    flex-shrink: 0;
`;

const NumberButton = styled.button<{ $isSelected: boolean }>`
    position: relative;
    width: 48px;
    height: 48px;
    min-width: 48px;
    border-radius: 8px;
    border: 2px solid ${(props) => (props.$isSelected ? '#3cb4f4' : '#dddddd')};
    background-color: ${(props) => (props.$isSelected ? '#3cb4f4' : '#f2f2f2')};
    color: ${(props) => (props.$isSelected ? 'white' : 'black')};
    font-size: 1.2rem;
    font-weight: 700;
    cursor: pointer;

    @media (max-width: 576px) {
        width: 40px;
        height: 40px;
        min-width: 40px;
        font-size: 1rem;
    }
`;

const CenterColumn = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 0;
`;

const ModeSwitch = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
    margin-bottom: 1rem;
`;

const MedalColumn = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.4rem;
    overflow-y: auto;
    max-height: calc(100vh - 160px);
    flex-shrink: 0;
`;

const MedalBadge = styled.div<{ $isSelected: boolean }>`
    display: flex;
    align-items: center;
    gap: 0.25rem;
    background-color: ${(props) => (props.$isSelected ? '#e4f4ff' : '#f2f2f2')};
    border: 2px solid ${(props) => (props.$isSelected ? '#3cb4f4' : 'transparent')};
    border-radius: 12px;
    padding: 0.2rem 0.5rem;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
`;

const CurrentMedalBanner = styled.div`
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    text-align: center;
`;
