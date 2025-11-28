import "./App.css";
import React, {FC, useContext, useEffect, useState} from "react";
import {Container, Row, Spinner, Tab, Tabs} from "react-bootstrap";
import {AlarmClock, BrushCleaning, House, ThermometerSun, TramFront} from "lucide-react";
import Weather from "./tabs/weather/Weather";
import {Home} from "./tabs/home/Home";
import {MorningRoutine} from "./tabs/morningRoutine/MorningRoutine";
import {DutyTable} from "./tabs/dutyTable/DutyTable";
import TramSchedule from "./tabs/trams/TramSchedule";
import {AppContext} from "./context/AppContext";

export const App: FC = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [tab, setTab] = useState<string>('home');
    const {setAppData} = useContext(AppContext);

    useEffect(() => {
        const activeTab = localStorage.getItem('activeTab');
        if (activeTab) {
            setTab(activeTab)
        }
        setIsLoading(false)
    }, []);

    useEffect(() => {
        localStorage.setItem('activeTab', tab);
    }, [tab]);

    useEffect(() => {
        const timerId = setInterval(() => {
            setAppData(prevState => ({
                ...prevState,
                timestamp: Date.now()
            }));
        }, 1000);

        return () => {
            clearInterval(timerId);
        };
    }, []);

    return (
        <div className="app">
            {/*<Container style={{height: '100vh'}} {...handlers}>*/}
            <Container style={{height: '100vh'}}>
                {isLoading && (
                    <Row style={{
                        backgroundColor: "#949aa7",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 999,
                        height: "100%",
                        width: "100%",
                    }}>
                        <Spinner variant="light"/>
                    </Row>
                )}
                <Tabs
                    justify
                    activeKey={tab}
                    onSelect={(key) => { if(key) setTab(key)}}
                >
                    <Tab eventKey="home" title={<House color="white"/>}>
                        {tab === "home" && <Home />}
                    </Tab>
                    <Tab eventKey="weather" title={<ThermometerSun color="white"/>}>
                        {tab === "weather" && <Weather />}
                    </Tab>
                    <Tab eventKey="trams" title={<TramFront color="white"/>}>
                        {tab === "trams" && <TramSchedule />}
                    </Tab>
                    <Tab eventKey="morning" title={<AlarmClock color="white"/>}>
                        {tab === "morning" && <MorningRoutine />}
                    </Tab>
                    <Tab eventKey="duties" title={<BrushCleaning color="white"/>}>
                        {tab === "duties" && <DutyTable />}
                    </Tab>
                    {/*<Tab eventKey="fireworks" title={<Sparkles color="white"/> }>*/}
                    {/*    {tab === "fireworks" && <FireworksWithRockets />}*/}
                    {/*</Tab>*/}
                </Tabs>
            </Container>
        </div>
    )
};
