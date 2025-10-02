import "./App.css";
import React, {FC} from "react";
import {Col, Container, Tab, Tabs} from "react-bootstrap";
import DashboardMock from "./tabs/dashboard/Dashboard";
import {AlarmClock, BrushCleaning, ChevronDown, CloudSun, House, Star, ThermometerSun} from "lucide-react";
import Dashboard from "./tabs/dashboard/Dashboard";
import {Home} from "./tabs/home/Home";


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
                          Tab content for morning routine
                      </Tab>
                      <Tab eventKey="duties" title={<BrushCleaning color="white"/> }>
                          Tab content for duties
                      </Tab>
                      {/*<Tab eventKey="effects" title="Effects">*/}
                      {/*    Tab content for effects*/}
                      {/*</Tab>*/}
                  </Tabs>
              </Col>
      </Container>
    </div>
);
