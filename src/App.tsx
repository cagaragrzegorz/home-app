import "./App.css";
import React, {FC} from "react";
import {Col, Container, Tab, Tabs} from "react-bootstrap";
import {AlarmClock, BrushCleaning, House, ThermometerSun, TramFront} from "lucide-react";
import Weather from "./tabs/weather/Weather";
import {Home} from "./tabs/home/Home";
import {MorningRoutine} from "./tabs/morningRoutine/MorningRoutine";
import {DutyTable} from "./tabs/dutyTable/DutyTable";
import TramSchedule from "./tabs/trams/TramSchedule";

export const App: FC = () => (
    <div className="app">
      <Container>
              <Col>
                  <Tabs
                      defaultActiveKey="home"
                      justify
                  >
                      <Tab eventKey="home" title={<House color="white"/> }>
                          <Home/>
                      </Tab>
                      <Tab eventKey="dashboard" title={<ThermometerSun color="white"/> }>
                          <Weather/>
                      </Tab>
                      <Tab eventKey="trams" title={<TramFront color="white"/> }>
                          <TramSchedule/>
                      </Tab>
                      <Tab eventKey="morning" title={<AlarmClock color="white"/> }>
                          <MorningRoutine />
                      </Tab>
                      <Tab eventKey="duties" title={<BrushCleaning color="white"/> }>
                          <DutyTable />
                      </Tab>
                      {/*<Tab eventKey="fireworks" title={<Sparkles color="white"/> }>*/}
                      {/*    <FireworksWithRocketsSidekickVersion />*/}
                      {/*</Tab>*/}
                  </Tabs>
              </Col>
      </Container>
    </div>
);
