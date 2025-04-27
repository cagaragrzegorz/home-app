import "./App.css";
import React, {FC} from "react";
import {Col, Container, Tab, Tabs} from "react-bootstrap";
import DashboardMock from "./tabs/dashboard/DashboardMock";


export const App: FC = () => (
    <div className="app">
      <Container>
              <Col>
                  <Tabs
                      defaultActiveKey="dashboard"
                      id="justify-tab-example"
                      variant="pills"
                      justify
                  >
                      <Tab eventKey="dashboard" title="Status">
                          <DashboardMock />
                      </Tab>
                      {/*<Tab eventKey="morning" title="Rutyna poranna">*/}
                      {/*    Tab content for Rutyna poranna*/}
                      {/*</Tab>*/}
                      {/*<Tab eventKey="weather" title="Pogoda">*/}
                      {/*    <TemperatureGraph weatherData={sampleWeatherData} />*/}
                      {/*</Tab>*/}
                  </Tabs>
              </Col>
      </Container>
    </div>
);
