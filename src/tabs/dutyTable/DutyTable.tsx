import React, {useEffect, useState} from 'react';
import {Button, Modal, Form, Container, Card} from "react-bootstrap";
import {BrushCleaning, CalendarPlus, CalendarX2, Eraser, Plus, User} from "lucide-react";
import {toast, ToastContainer} from "react-toastify";
import {Weekday} from "../../types/types";
import styled from "styled-components";

type DutyStatus = {
    name: string;
    completed: boolean;
}
type Duty = {
    [key: string]: DutyStatus[];
};
type DutiesByDay = {
    [day in Weekday]: Duty;
}

const initialKids: string[] = ['Tosia', 'Mania', 'Ola'];
const weekdays: Weekday[] = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela'];

const dutiesByDay: DutiesByDay = weekdays.reduce((acc, day) => {
    acc[day] = initialKids.reduce((kidAcc, kid) => {
        kidAcc[kid] = [];
        return kidAcc;
    }, {} as Record<string, DutyStatus[]>);
    return acc;
}, {} as DutiesByDay);

function getCurrentWeekday(): Weekday {
    const dayIndex = new Date().getDay();
    return weekdays[(dayIndex + 6) % 7];
}

const initialDutiesList = [
    'Spakuj zmywarkę',
    'Rozpakuj zmywarkę',
    'Wynieś śmieci',
    'Odkurz pokój',
    'Odkurz całe mieszkanie',
    'Umyj naczynia',
    'Umyj łazienkę',
    'Umyj wannę',
    'Umyj umywalkę',
    'Zrób zadanie domowe',
    'Rozwieś pranie',
    'Pomoc przy gotowaniu',
    'Posprzątaj pokój',
    'Pomoc z zakupami',
    'Przygotuj plecak na jutro',
    'Pościel łóżko',
    'Wrzuć pranie do kosza',
    'Nakryj do stołu',
    'Pomoc przy sprzątaniu po posiłku',
    'Podlej rośliny',
]

export const DutyTable: React.FC = () => {
    const today: Weekday = getCurrentWeekday();
    const [kids, setKids] = useState<string[]>(() => {
        const savedKidList = localStorage.getItem('kids');
        return savedKidList ? JSON.parse(savedKidList) : initialKids;
    });
    const [dutyList, setDutyList] = useState<string[]>(() => {
        const savedDutyList = localStorage.getItem('dutyList');
        return savedDutyList ? JSON.parse(savedDutyList) : initialDutiesList;
    });
    const [dutiesTable, setDutiesTable] = useState<DutiesByDay>(() => {
        const dutiesTable = localStorage.getItem('dutiesTable');
        if (dutiesTable) {
            const parsedDutiesTable = JSON.parse(dutiesTable);

            // Check if it's of type Record<string, DutyStatus[]>
            const isDutyStatusArray = Object.values(parsedDutiesTable).every((day: any) =>
                typeof day === 'object' &&
                Object.values(day).every((kid: any) =>
                    Array.isArray(kid) &&
                    kid.every((duty: any) =>
                        typeof duty.name === 'string' &&
                        typeof duty.completed === 'boolean'
                    )
                )
            );

            if (!isDutyStatusArray) {
                let updatedDutiesTable: any = dutiesByDay
                weekdays.forEach((day) => {
                    kids.forEach((kid) => {
                        const kidDuties = parsedDutiesTable[day][kid];
                        if (Array.isArray(kidDuties) && kidDuties.length !== 0) {
                            updatedDutiesTable[day][kid] = kidDuties.map((dutyName: string) => ({
                                name: dutyName,
                                completed: false
                            }));
                        }
                    });
                });
                return updatedDutiesTable;
            }
        }
        return dutiesTable ? JSON.parse(dutiesTable) : dutiesByDay;
    });
    const [showAddDutyModal, setShowAddDutyModal] = useState(false);
    const [showAddPersonModal, setShowAddPersonModal] = useState(false);
    const [showCompleteDutyModal, setShowCompleteDutyModal] = useState(false);
    const [showResetCompleteDutiesModal, setShowResetCompleteDutiesModal] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [activeKid, setActiveKid] = useState<string | null>(null);
    const [activeDay, setActiveDay] = useState<Weekday>(today);
    const [newDuty, setNewDuty] = useState<string>('');
    const [newKid, setNewKid] = useState<string>('');
    const [dayAndKidPair, setDayAndKidPair] = useState<{ day: Weekday; kid: string }>({day: today, kid: 'Tosia'});

    useEffect(() => {
        localStorage.setItem('dutiesTable', JSON.stringify(dutiesTable));
    }, [dutiesTable]);
    useEffect(() => {
        localStorage.setItem('dutyList', JSON.stringify(dutyList));
    }, [dutyList]);
    useEffect(() => {
        localStorage.setItem('kids', JSON.stringify(kids));
    }, [kids]);

    const handleDutyAssignmentChange = (kid: string | null, day: Weekday, duty: string, isChecked: boolean) => {
        if (!kid) return;
        setDutiesTable((prevDuties) => {
            const updatedDuties = {...prevDuties};
            if (isChecked) {
                updatedDuties[day][kid] = [...updatedDuties[day][kid], {name: duty, completed: false}];
            } else {
                updatedDuties[day][kid] = updatedDuties[day][kid].filter((dutyStatus) => dutyStatus.name !== duty);
            }
            return updatedDuties;
        });
    };

    const handleDutyCompletionChange = (kid: string, day: Weekday, duty: string) => {
        setDutiesTable((prevDuties) => {
            const updatedDuties = {...prevDuties};
            updatedDuties[day][kid] = updatedDuties[day][kid].map((dutyStatus) =>
                dutyStatus.name === duty ? {...dutyStatus, completed: !dutyStatus.completed} : dutyStatus
            );
            return updatedDuties;
        });
    };

    const handleCompletedDutiesReset = () => {
        setDutiesTable((prevDuties) => {
            const updatedDuties = {...prevDuties};
            weekdays.forEach((day) => {
                kids.forEach((kid) => {
                    updatedDuties[day][kid] = updatedDuties[day][kid].map((dutyStatus) => ({
                        ...dutyStatus,
                        completed: false
                    }));
                });
            });
            return updatedDuties;
        });
        toast.success('Wykonane obowiązki zostały zresetowane!');
    }

    const handleAddKid = (newKid: string) => {
        if (newKid.trim()) {
            setKids((prevKids) => {
                if (prevKids.includes(newKid)) return prevKids;
                return [...prevKids, newKid];
            });
            setDutiesTable((prevDuties) => {
                const updatedDuties = {...prevDuties};
                weekdays.forEach((day) => {
                    updatedDuties[day][newKid] = [];
                });
                return updatedDuties;
            });
            setNewKid('');
            toast.success('Osoba została dodana!');
        }
    };

    const handleRemoveKid = (kidToRemove: string) => {
        if (activeKid === kidToRemove) {
            setActiveKid(kids[0] ?? null);
        }
        setKids((prevKids) => {
            const filteredKids = prevKids.filter((kid) => kid !== kidToRemove);
            if (filteredKids.length === 0) {
                setActiveKid(null);
            }
            return prevKids.filter((kid) => kid !== kidToRemove)
        });
        setDutiesTable((prevDuties) => {
            const updatedDuties = {...prevDuties};
            weekdays.forEach((day) => {
                delete updatedDuties[day][kidToRemove];
            });
            return updatedDuties;
        });

    }

    const handleKidsReset = () => {
        const kidsToRemoveFromList = kids.filter((kid => !initialKids.includes(kid)));
        kidsToRemoveFromList.forEach((kid) => handleRemoveKid(kid));
        toast.success('Lista osób została zresetowana!');
    }

    const handleRemovalOfDuty = (dutyToRemove: string) => {
        setDutyList((prevDuties) => prevDuties.filter((duty) => duty !== dutyToRemove));
        setDutiesTable((prevDutiesTable) => {
            const updatedDutiesTable = {...prevDutiesTable};
            weekdays.forEach((day) => {
                kids.forEach((kid) => {
                    updatedDutiesTable[day][kid] = updatedDutiesTable[day][kid].filter((dutyStatus) => dutyStatus.name !== dutyToRemove);
                });
            });
            return updatedDutiesTable;
        });
    }

    const handleDutyListReset = () => {
        const dutiesToRemoveFromList = dutyList.filter((duty => !initialDutiesList.includes(duty)));
        dutiesToRemoveFromList.forEach((duty) => handleRemovalOfDuty(duty));
        toast.success('Lista obowiązków została zresetowana!');
    }

    return (
        <Container style={{padding: 0, fontFamily: 'Arial, sans-serif'}}>
            <Card>
                <Card.Body>
                    <div style={{textAlign: 'right', marginBottom: ".5rem"}}>
                        <Button onClick={() => setShowAddPersonModal(true)} style={{marginRight: '10px'}}>
                            <Plus size={24}/> <User size={24}/>
                        </Button>
                        <Button onClick={() => setShowAddDutyModal(true)} style={{marginRight: '10px'}}>
                            <Plus size={24}/> <BrushCleaning size={24}/>
                        </Button>
                        <Button onClick={() => {
                            setActiveKid(null)
                            setActiveDay(today)
                            setShowSettings(true)
                        }} style={{marginRight: '10px'}}>
                            <CalendarPlus size={24}/>
                        </Button>
                        <Button onClick={() => setShowResetCompleteDutiesModal(true)} style={{marginRight: '10px'}}>
                            <CalendarX2 size={24}/>
                        </Button>
                    </div>
                    <StyledTable>
                        <thead>
                        <tr>
                            <StyledTH $backgroundColor="weekday">Dzień tygodnia</StyledTH>
                            {kids.map((kid) => (
                                <StyledTH key={kid} $backgroundColor={kid}>{kid}</StyledTH>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {weekdays.map((day) => (
                            <tr key={day}>
                                <StyledTD $backgroundColor="weekday" $isToday={day === today}>{day}</StyledTD>
                                {kids.map((kid) => {
                                    const allCompleted = dutiesTable[day][kid].length !== 0 && dutiesTable[day][kid].every((dutyStatus) => dutyStatus.completed);
                                    return (
                                        <StyledTD
                                            key={kid}
                                            $backgroundColor={kid}
                                            $isToday={day === today}
                                            $allCompleted={allCompleted}
                                            onClick={() => {
                                                setShowCompleteDutyModal(true);
                                                setDayAndKidPair({day, kid});
                                            }}
                                        >
                                            <StyledUL>
                                                {dutiesTable[day][kid].map((dutyStatus, index) => (
                                                    <StyledLI key={index} $isCompleted={dutyStatus.completed}>
                                                        {dutyStatus.name}
                                                    </StyledLI>
                                                ))}
                                            </StyledUL>
                                        </StyledTD>
                                    );
                                })}
                            </tr>
                        ))}
                        </tbody>
                    </StyledTable>

                    {/*Reset Completed Duties Modal*/}
                    <Modal show={showResetCompleteDutiesModal} onHide={() => setShowResetCompleteDutiesModal(false)}
                           centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Obowiązki wykonane</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                                <h5>Resetuj wykonane obowiązki</h5>
                                <Button
                                    variant={"danger"}
                                    onClick={() => {
                                        handleCompletedDutiesReset()
                                    }}
                                    style={{float: 'right', marginBottom: '10px'}}
                                ><Eraser/>
                                </Button>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowAddPersonModal(false)}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    {/*Complete Duties Modal*/}
                    <Modal show={showCompleteDutyModal} onHide={() => setShowCompleteDutyModal(false)} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Wykonaj zadanie</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="flex justify-content-center mb-3">
                                <div style={{marginBottom: '1rem'}}>
                                    {dutiesTable[dayAndKidPair.day][dayAndKidPair.kid].length === 0 ?
                                        <div>{dayAndKidPair.kid} nie ma jeszcze przypisanych obowiązków
                                            na {dayAndKidPair.day}.
                                        </div> :

                                        dutiesTable[dayAndKidPair.day][dayAndKidPair.kid].map((dutyStatus, index) => (
                                            <Form.Group key={index} controlId={`checkbox-${dutyStatus.name}`} style={{
                                                border: '1px solid #b3b3b3',
                                                padding: '5px',
                                                marginBottom: '4px',
                                                borderRadius: '4px',
                                                paddingLeft: '10px',
                                            }} className="center-align">
                                                <Form.Check
                                                    type="checkbox"
                                                    label={dutyStatus.name}
                                                    checked={dutyStatus.completed}
                                                    onChange={(e) =>
                                                        handleDutyCompletionChange(dayAndKidPair.kid, dayAndKidPair.day, dutyStatus.name)
                                                    }
                                                />
                                            </Form.Group>
                                        ))}
                                    <hr style={{margin: '1rem 0'}}/>
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center"
                                    }}>
                                        <h5>{dutiesTable[dayAndKidPair.day][dayAndKidPair.kid].length === 0 ? "Dodaj": "Edytuj"} obowiązki</h5>
                                        <Button onClick={() => {
                                            setActiveDay(dayAndKidPair.day)
                                            setActiveKid(dayAndKidPair.kid)
                                            setShowSettings(true)
                                        }}>
                                            <CalendarPlus size={24}/>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowCompleteDutyModal(false)}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    {/*Add Person Modal*/}
                    <Modal show={showAddPersonModal} onHide={() => setShowAddPersonModal(false)} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Dodaj osobę</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="flex justify-content-center mb-3">
                                <Form.Group>
                                    <Form.Control
                                        id="newKid"
                                        type="text"
                                        value={newKid}
                                        onChange={(e) => setNewKid(e.target.value)}
                                    />
                                    <Form.Text id="nenewKidwDuty" muted>Wpisz nową osobę</Form.Text>
                                </Form.Group>
                                <div style={{display: "flex", justifyContent: "flex-end",}}>
                                    <Button onClick={() => handleAddKid(newKid)}> <Plus/> </Button>
                                </div>
                                <hr style={{margin: '1rem 0'}}/>
                                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                                    <h5>Resetuj listę osób</h5>
                                    <Button
                                        variant={"danger"}
                                        onClick={() => {
                                            handleKidsReset()
                                        }}
                                        style={{float: 'right', marginBottom: '10px'}}
                                    ><Eraser/>
                                    </Button>
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowAddPersonModal(false)}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    {/*Add Duty Modal*/}
                    <Modal show={showAddDutyModal} onHide={() => setShowAddDutyModal(false)} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Dodaj obowiązek</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="flex justify-content-center mb-3">
                                <Form.Group>
                                    <Form.Control
                                        id="newKid"
                                        type="text"
                                        value={newDuty}
                                        onChange={(e) => setNewDuty(e.target.value)}
                                    />
                                    <Form.Text id="nenewKidwDuty" muted>Wpisz nowy obowiązek</Form.Text>
                                </Form.Group>
                                <div style={{display: "flex", justifyContent: "flex-end",}}>
                                    <Button
                                        onClick={() => {
                                            if (newDuty.trim()) {
                                                setDutyList((prev) => [...prev, newDuty.trim()]);
                                                setNewDuty('');
                                                toast.success('Obowiązek został dodany!');
                                            }
                                        }}
                                    > <Plus/> </Button>
                                </div>
                                <hr style={{margin: '1rem 0'}}/>
                                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                                    <h5>Resetuj listę obowiązków</h5>
                                    <Button
                                        variant={"danger"}
                                        onClick={() => handleDutyListReset()}
                                        style={{float: 'right', marginBottom: '10px'}}
                                    ><Eraser/>
                                    </Button>
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowAddDutyModal(false)}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    {/*Settings Modal*/}
                    <Modal show={showSettings} onHide={() => setShowSettings(false)} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Wybierz obowiązki</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="flex justify-content-center mb-3">
                                <h5>Wybierz dzień:</h5>
                                {weekdays.map((day) => (
                                    <Button
                                        key={day}
                                        variant={activeDay === day ? "primary" : "outline-secondary"}
                                        onClick={() => setActiveDay(day)}
                                        className="mx-1 mb-2"
                                    >
                                        {day}
                                    </Button>
                                ))}
                            </div>
                            <hr style={{margin: '1rem 0'}}/>
                            <div className="flex justify-content-center mb-3">
                                <h5>Wybierz osobę:</h5>
                                {kids.map((kid) => (
                                    <Button
                                        key={kid}
                                        variant={activeKid === kid ? "primary" : "outline-secondary"}
                                        onClick={() => setActiveKid(kid)}
                                        className="mx-1 mb-2"
                                    >
                                        {kid}
                                    </Button>
                                ))}
                            </div>
                            {activeKid && <div style={{marginBottom: '1rem'}}>
                                <hr style={{margin: '1rem 0'}}/>
                                <h5>Obowiązki:</h5>
                                {dutyList.sort().map((duty) => (
                                    <Form.Group key={duty} controlId={`checkbox-${duty}`} style={{
                                        border: '1px solid #b3b3b3',
                                        padding: '5px',
                                        marginBottom: '4px',
                                        borderRadius: '4px',
                                        paddingLeft: '10px',
                                    }} className="center-align">
                                        <Form.Check
                                            type="switch"
                                            label={duty}
                                            checked={dutiesTable[activeDay][activeKid].map((dutyStatus) => dutyStatus.name)?.includes(duty) ?? false}
                                            onChange={(e) =>
                                                handleDutyAssignmentChange(activeKid, activeDay, duty, e.target.checked)
                                            }
                                        />
                                    </Form.Group>
                                ))}
                            </div>}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowSettings(false)}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    {/*toaster*/}
                    <ToastContainer
                        position="bottom-center"
                        autoClose={2000}
                        newestOnTop
                        closeOnClick
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="light"
                    />
                </Card.Body>
            </Card>
        </Container>
    );
};

const StyledTable = styled.table`
    border-collapse: separate;
    width: 100%;
    font-size: 1.1rem;
`;

const StyledTH = styled.th<{ $backgroundColor: string }>`
    background-color: ${props => {
        switch (props.$backgroundColor) {
            case 'weekday':
                return '#dddddd';
            case 'Tosia':
                // return '#f44d3c';
                return '#3cb4f4';
            case 'Mania':
                return '#45d0a3';
            case 'Ola':
                return '#e9c434';
            default:
                return '#dddddd';
        }
    }};
    color: ${props => (props.$backgroundColor === 'weekday' ? 'black' : 'white')};
    padding: 10px;
    border-radius: 8px;
`;

const StyledTD = styled.td<{ $backgroundColor: string; $isToday?: boolean; $allCompleted?: boolean }>`
    position: relative;
    background-color: ${props => {
        const baseColor = '#d6bbe3';
        switch (props.$backgroundColor) {
            case 'weekday':
                return props.$isToday ? baseColor : '#f2f2f2';
            case 'Tosia':
                return props.$isToday ? baseColor : '#d1e5ff';
            case 'Mania':
                return props.$isToday ? baseColor : '#c2fdf2';
            case 'Ola':
                return props.$isToday ? baseColor : '#f6ebb8';
            default:
                return props.$isToday ? baseColor : '#f2f2f2';
        }
    }};
    font-weight: ${props => (props.$isToday ? 'bold' : 'normal')};
    padding: 8px;
    border-radius: 8px;

    &::after {
        content: ${props => (props.$allCompleted ? "'🏅'" : "''")};
        position: absolute;
        top: 5px;
        right: 5px;
        font-size: 1.2rem;
    }
`;

const StyledUL = styled.ul`
    margin: 0;
    padding-left: 0;
    list-style-type: none
`;

const StyledLI = styled.li<{ $isCompleted: boolean }>`
    text-decoration: ${props => (props.$isCompleted ? 'line-through' : 'none')};
`;