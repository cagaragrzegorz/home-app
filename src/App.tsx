import "./App.css";
import React, {FC, useState} from "react";
import {Container, Tab, Tabs} from "react-bootstrap";
import {AlarmClock, BrushCleaning, House, ThermometerSun, TramFront} from "lucide-react";
import Weather from "./tabs/weather/Weather";
import {Home} from "./tabs/home/Home";
import {MorningRoutine} from "./tabs/morningRoutine/MorningRoutine";
import {DutyTable} from "./tabs/dutyTable/DutyTable";
import TramSchedule from "./tabs/trams/TramSchedule";
import {useSwipeable} from "react-swipeable";

const config = {
    delta: 50,                            // min distance(px) before a swipe starts
    preventDefaultTouchmoveEvent: false,  // call e.preventDefault *See Details*
    trackTouch: true,                     // track touch input
    trackMouse: true,                    // track mouse input
    rotationAngle: 0,                     // set a rotation angle
}

const tabs = ["home", "dashboard", "trams", "morning", "duties"];

export const App: FC = () => {

    const [tab, setTab] = useState<string>('home');

    const handlers = useSwipeable({
        onSwiped: (eventData) => {
            if(eventData.dir==="Right") {
                setTab(prevState => {
                    const currentIndex = tabs.indexOf(prevState);
                    const newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
                    return tabs[newIndex];
                });
            }
            else if(eventData.dir==="Left") {
                setTab(prevState => {
                    const currentIndex = tabs.indexOf(prevState);
                    const newIndex = (currentIndex + 1) % tabs.length;
                    return tabs[newIndex];
                });
            }
        }, ...config, });

    return (
        <div className="app">
            <Container style={{height: '100vh'}} {...handlers}>
                <Tabs
                    justify
                    activeKey={tab}
                    onSelect={(key) => { if(key) setTab(key)}}
                >
                    <Tab eventKey="home" title={<House color="white"/>}>
                        <Home/>
                    </Tab>
                    <Tab eventKey="dashboard" title={<ThermometerSun color="white"/>}>
                        <Weather/>
                    </Tab>
                    <Tab eventKey="trams" title={<TramFront color="white"/>}>
                        <TramSchedule/>
                    </Tab>
                    <Tab eventKey="morning" title={<AlarmClock color="white"/>}>
                        <MorningRoutine/>
                    </Tab>
                    <Tab eventKey="duties" title={<BrushCleaning color="white"/>}>
                        <DutyTable/>
                    </Tab>
                    {/*<Tab eventKey="fireworks" title={<Sparkles color="white"/> }>*/}
                    {/*    <FireworksWithRocketsSidekickVersion />*/}
                    {/*</Tab>*/}
                </Tabs>
            </Container>
        </div>
    )
};
