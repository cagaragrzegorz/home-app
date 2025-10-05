import "./App.css";
import React, {FC} from "react";
import {Col, Container, Tab, Tabs} from "react-bootstrap";
import {AlarmClock, BrushCleaning, House, Sparkles, ThermometerSun} from "lucide-react";
import Dashboard from "./tabs/dashboard/Dashboard";
import {Home} from "./tabs/home/Home";
import {MorningRoutine} from "./tabs/morningRoutine/MorningRoutine";
import {DutyTable} from "./tabs/dutyTable/DutyTable";
import FireworksWithRocketsSidekickVersion from "./tabs/fireworks/FireworksWithRocketsSidekickVersion";

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
                          <Dashboard/>
                      </Tab>
                      <Tab eventKey="morning" title={<AlarmClock color="white"/> }>
                          <MorningRoutine />
                      </Tab>
                      <Tab eventKey="duties" title={<BrushCleaning color="white"/> }>
                          <DutyTable />
                      </Tab>
                      <Tab eventKey="fireworks" title={<Sparkles color="white"/> }>
                          <FireworksWithRocketsSidekickVersion />
                      </Tab>
                  </Tabs>
              </Col>
      </Container>
    </div>
);
