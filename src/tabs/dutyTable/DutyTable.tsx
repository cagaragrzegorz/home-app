import React, {useEffect, useState} from 'react';
import {Button, Modal, Form, Container, Row} from "react-bootstrap";
import {BrushCleaning, CalendarPlus, Eraser, Plus, User} from "lucide-react";
import {toast, ToastContainer} from "react-toastify";
import './DutyTable.css';
import {Weekday} from "../../types/types";

type Duty = {
    [key: string]: string[];
};
type DutiesByDay = {
    [day in Weekday]: Duty;
}

const initialKids: string[] = ['Tosia', 'Mania', 'Ola'];
const weekdays: Weekday[] = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela'];

const dutiesByDay = weekdays.reduce((acc, day) => {
    acc[day] = initialKids.reduce((kidAcc, kid) => {
        kidAcc[kid] = [];
        return kidAcc;
    }, {} as Record<string, string[]>);
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
    const today = getCurrentWeekday();
    const [dutiesTable, setDutiesTable] = useState<DutiesByDay>(() => {
        const savedDuties = localStorage.getItem('dutiesTable');
        return savedDuties ? JSON.parse(savedDuties) : dutiesByDay;
    });
    const [dutyList, setDutyList] = useState<string[]>(() => {
        const savedDutyList = localStorage.getItem('dutyList');
        return savedDutyList ? JSON.parse(savedDutyList) : initialDutiesList;
    });
    const [kids, setKids] = useState<string[]>(() => {
        const savedKidList = localStorage.getItem('kids');
        return savedKidList ? JSON.parse(savedKidList) : initialKids;
    });
    const [showAddDutyModal, setShowAddDutyModal] = useState(false);
    const [showAddPersonModal, setShowAddPersonModal] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [activeKid, setActiveKid] = useState<string | null>(null);
    const [activeDay, setActiveDay] = useState<Weekday>(today);
    const [newDuty, setNewDuty] = useState<string>('');
    const [newKid, setNewKid] = useState<string>('');

    useEffect(() => {
        localStorage.setItem('dutiesTable', JSON.stringify(dutiesTable));
    }, [dutiesTable]);
    useEffect(() => {
        localStorage.setItem('dutyList', JSON.stringify(dutyList));
    }, [dutyList]);
    useEffect(() => {
        localStorage.setItem('kids', JSON.stringify(kids));
    }, [kids]);

    const handleDutyChange = (kid: string | null, day: Weekday, duty: string, isChecked: boolean) => {
        if (!kid) return;
        setDutiesTable((prevDuties) => {
            const updatedDuties = {...prevDuties};
            if (isChecked) {
                updatedDuties[day][kid] = [...updatedDuties[day][kid], duty];
            } else {
                updatedDuties[day][kid] = updatedDuties[day][kid].filter((d) => d !== duty);
            }
            return updatedDuties;
        });
    };

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
                    updatedDutiesTable[day][kid] = updatedDutiesTable[day][kid].filter((duty) => duty !== dutyToRemove);
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
            <div className="flex-row-reverse mb-2" style={{textAlign: 'right'}}>
                <Button onClick={() => setShowAddPersonModal(true)} style={{marginRight: '10px'}}>
                    <Plus size={24}/> <User size={24}/>
                </Button>
                <Button onClick={() => setShowAddDutyModal(true)} style={{marginRight: '10px'}}>
                    <Plus size={24}/> <BrushCleaning size={24}/>
                </Button>
                <Button onClick={() => setShowSettings(true)}>
                    <CalendarPlus size={24}/>
                </Button>
            </div>
            <table style={{
                borderCollapse: 'separate', width: '100%', boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                backgroundColor: '#ccc',
                fontSize: '1.1rem'
            }}>
                <thead>
                <tr style={{backgroundColor: '#adadad'}}>
                    <th style={{border: '1px solid #ccc', padding: '10px'}}>Dzień tygodnia</th>
                    {kids.map((kid) => (
                        <th key={kid} style={{border: '1px solid #ccc', padding: '5px'}}>{kid}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {weekdays.map((day) => (
                    <tr key={day} style={{backgroundColor: day === today ? '#aebfdb' : '#e0e0e0'}}>
                        <td style={{
                            border: '1px solid #ccc',
                            padding: '8px',
                            fontWeight: day === today ? 'bold' : 'normal'
                        }}>{day}</td>
                        {kids.map((kid) => (
                            <td key={kid} style={{
                                border: '1px solid #ccc',
                                padding: '8px',
                                fontWeight: day === today ? 'bold' : 'normal'
                            }}>
                                <ul style={{margin: 0, paddingLeft: '0', listStyleType: "none"}}>
                                    {dutiesTable[day][kid].map((duty, index) => (
                                        <li key={index} style={{textDecoration: "underline"}}>{duty}</li>
                                    ))}
                                </ul>
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>

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
                                    type="checkbox"
                                    label={duty}
                                    checked={dutiesTable[activeDay][activeKid]?.includes(duty) ?? false}
                                    onChange={(e) =>
                                        handleDutyChange(activeKid, activeDay, duty, e.target.checked)
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
        </Container>
    );
};