import React, {useCallback, useEffect, useState} from 'react';
import './Weather.css';
import {ApiError} from "./types";
import axios, {AxiosError} from "axios";
import {fetchAvailableMeteograms, postUM460Meteograms} from "../../api/meteoClient";
import {AvailableMeteorgams} from "../../api/types";
import {ChevronDown, ChevronUp} from "lucide-react";
import TemperatureLineGraph from "../../components/TemperatureLineGraph";
import {Spinner} from 'react-bootstrap/esm';
import {Container, Row} from "react-bootstrap";
import styled from "styled-components";


const FETCH_INTERVAL_MS = 15 * 60 * 1000; // 15 minutes in milliseconds

export const Weather: React.FC = () => {
    const [data, setData] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<ApiError | null>(null);
    const [firstHour, setFirstHour] = useState<number>(0);
    const [advMetric, setAdvMetric] = useState<boolean>(false);
    const [orientationKey, setOrientationKey] = useState<number>(0);

    const getLatestMeteogramFromStorage = (): number => {
        const latestMeteogram = localStorage.getItem('latestMeteogram');
        return latestMeteogram ? +latestMeteogram:  0;
    }

    const getUM460ResponseFromStorage = (): any | null => {
        const um460Response = localStorage.getItem('um460Response');
        return um460Response ? JSON.parse(um460Response) : null;
    }

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            let dataResponse: any
            const meteogramResponse: AvailableMeteorgams = await fetchAvailableMeteograms();
            const latestMeteogram: number = Math.max(...meteogramResponse.um4_60)
            if (latestMeteogram === getLatestMeteogramFromStorage()){
                dataResponse = getUM460ResponseFromStorage()
            } else {
                localStorage.setItem('latestMeteogram', latestMeteogram.toString());
                dataResponse = await postUM460Meteograms(latestMeteogram)
                localStorage.setItem('um460Response', JSON.stringify(dataResponse));
            }
            const startDateTime = new Date(+dataResponse.data.airtmp_point.first_timestamp * 1000)
            const indexToShiftLocal = Math.floor(Math.abs(startDateTime.getTime() - new Date().getTime()) / 3600000);
            const newStartDateTime = new Date(startDateTime.getTime())
            newStartDateTime.setHours(newStartDateTime.getHours() + indexToShiftLocal)
            setFirstHour(newStartDateTime.getHours())
            for (const key in dataResponse.data) {
                dataResponse.data[key].data = dataResponse.data[key].data.slice(indexToShiftLocal, dataResponse.data[key].data.length)
            }
            setData(dataResponse.data);
        } catch (err) {
            console.error('Error fetching data:', err);
            let errorMessage = 'An unknown error occurred';
            if (axios.isAxiosError(err)) {
                const axiosError = err as AxiosError;
                if (axiosError.response) {
                    errorMessage = `Server Error: ${axiosError.response.status} - ${axiosError.message}`;
                } else if (axiosError.request) {
                    errorMessage = `Network Error: No response received.`;
                } else {
                    errorMessage = `Request Setup Error: ${axiosError.message}`;
                }
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }
            setError({message: errorMessage});
            setData(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchData();
        }, FETCH_INTERVAL_MS);

        return () => {
            clearInterval(intervalId);
        };
    }, [fetchData]);

    const handleOrientationChange = useCallback(() => {
        setOrientationKey((prevKey) => prevKey + 1); // Increment key to force rerender
    }, []);

    useEffect(() => {
        window.addEventListener('resize', handleOrientationChange);
        return () => {
            window.removeEventListener('resize', handleOrientationChange);
        };
    }, [handleOrientationChange]);

    // @ts-ignore
    return (
        <Container className="weather-container">
            {/* Loading State */}
            {isLoading && <div className="kids-clock-wrapper">
                <Spinner animation="border" role="status"
                         variant="light"/>
            </div>}

            {/* Error State */}
            {error && !isLoading && <p style={{color: 'red'}}>Error: {error.message}</p>}

            {/* Success State */}
            {data && !isLoading && !error && (
                <Row className="info-card">
                    {data && (
                        <div style={{background: "#222", padding: 16, borderRadius: 8, marginBottom: 24}}>
                            <TemperatureLineGraph key={orientationKey}
                                                  data={data.airtmp_point.data}
                                                  data_max={data.airtmp_max.data}
                                                  data_min={data.airtmp_min.data}
                                                  firstHour={firstHour}
                                                  startDate={new Date(new Date(+data.airtmp_point.first_timestamp * 1000).setHours(firstHour)).toISOString()}/>
                        </div>
                    )}
                    <div className="card-title">Pogoda</div>
                    <div className="metric-container">
                        <div className="metric-item" style={{paddingLeft: '10px'}}>
                            <div className="data-section">
                                <WeatherHeader>🌡️ (°C)</WeatherHeader>
                                <WeatherHeader>🌧️ (mm/h)</WeatherHeader>
                                <WeatherHeader>💧 (%)</WeatherHeader>
                                <WeatherHeader>🌪️ (km/h)</WeatherHeader>
                                <WeatherHeader>🧭 (°)</WeatherHeader>
                                <WeatherHeader>⏲️ (hPa)</WeatherHeader>
                            </div>
                            <div className="label-hour">Godz.</div>
                            <div className="axis-mark"></div>
                        </div>
                        {data.airtmp_point.data.map((item: number, index: number) => (
                            <div className="metric-item">
                                <div className="data-section">
                                    <div className="small-text">{item.toFixed(1)}</div>
                                    <div
                                        className="small-text">{(data.pcpttl_max.data[index] * 3.6) > 1 ? (data.pcpttl_max.data[index] * 3.6).toFixed(1) : "-"}</div>
                                    <div
                                        className="small-text">{data.pcpttlprob_point.data[index] > 0 ? data.pcpttlprob_point.data[index].toFixed(0) : "-"}</div>
                                    <div
                                        className="small-text">{(data.wind10_sd_true_prev_point.data[index] * 3.6).toFixed(0)}</div>
                                    <div className="small-text">
                                        <div
                                            style={{transform: `rotate(${data.wind10_dr_deg_true_prev_point.data[index]}deg)`}}>↑
                                        </div>
                                    </div>
                                    <div
                                        className="small-text">{(data.trpres_point.data[index] / 100).toFixed(0)}</div>
                                </div>
                                <div
                                    className="label-hour">{((firstHour + index) % 24).toString().padStart(2, "0")}:00
                                </div>
                                <div className="axis-mark"></div>
                            </div>
                        ))}
                    </div>
                    <div onClick={() => {
                        setAdvMetric(!advMetric)
                    }}>{advMetric ? <ChevronDown color="white"/> : <ChevronUp color="white"/>}</div>
                    {
                        advMetric && (<>
                                <div className="card-title">🌡️ Temperatura (°C)</div>
                                <div className="metric-container">
                                    <div className="metric-item" style={{paddingLeft: '10px'}}>
                                        <div className="data-section">
                                            <div className="small-text">Max</div>
                                            <div className="large-text">Avg</div>
                                            <div className="small-text">Min</div>
                                        </div>
                                        <div
                                            className="label-hour">Godz.
                                        </div>
                                        <div className="axis-mark"></div>
                                    </div>
                                    {data.airtmp_point.data.map((item: number, index: number) => (
                                        <div className="metric-item">
                                            <div className="data-section">
                                                <div className="small-text">{data.airtmp_max.data[index].toFixed(1)}</div>
                                                <div className="large-text">{item.toFixed(1)}</div>
                                                <div className="small-text">{data.airtmp_min.data[index].toFixed(1)}</div>
                                            </div>
                                            <div
                                                className="label-hour">{((firstHour + index) % 24).toString().padStart(2, "0")}:00
                                            </div>
                                            <div className="axis-mark"></div>
                                        </div>
                                    ))}
                                </div>
                                <div className="card-title">🌧️ Opady (mm)</div>
                                <div className="metric-container">
                                    <div className="metric-item" style={{paddingLeft: '10px'}}>
                                        <div className="data-section">
                                            <div className="small-text">Max</div>
                                            <div className="large-text">Avg</div>
                                            <div className="large-text">P(%)</div>
                                        </div>
                                        <div
                                            className="label-hour">Godz.
                                        </div>
                                        <div className="axis-mark"></div>
                                    </div>
                                    {data.pcpttl_aver.data.map((item: number, index: number) => (
                                        <div className="metric-item">
                                            <div className="data-section">
                                                <div className="small-text">{data.pcpttl_max.data[index].toFixed(1)}</div>
                                                <div className="large-text">{item.toFixed(1)}</div>
                                                <div
                                                    className="large-text">{data.pcpttlprob_point.data[index].toFixed(0)}</div>
                                            </div>
                                            <div
                                                className="label-hour">{((firstHour + index) % 24).toString().padStart(2, "0")}:00
                                            </div>
                                            <div className="axis-mark"></div>
                                        </div>
                                    ))}
                                </div>
                                <div className="card-title">⏲️ Ciśnienie atmosferyczne (hPa)</div>
                                <div className="metric-container">
                                    <div className="metric-item" style={{paddingLeft: '10px'}}>
                                        <div className="data-section">
                                            <div className="large-text">Avg</div>
                                            <div className="small-text">Red</div>
                                        </div>
                                        <div
                                            className="label-hour">Godz.
                                        </div>
                                        <div className="axis-mark"></div>
                                    </div>
                                    {data.trpres_point.data.map((item: number, index: number) => (
                                        <div className="metric-item">
                                            <div className="data-section">
                                                <div className="large-text">{(item / 100).toFixed(0)}</div>
                                                <div
                                                    className="small-text">{(data.slpres_point.data[index] / 100).toFixed(0)}</div>
                                            </div>
                                            <div
                                                className="label-hour">{((firstHour + index) % 24).toString().padStart(2, "0")}:00
                                            </div>
                                            <div className="axis-mark"></div>
                                        </div>
                                    ))}
                                </div>
                                <div className="card-title">🫧 Wilgotność względna (%)</div>
                                <div className="metric-container">
                                    <div className="metric-item" style={{paddingLeft: '10px'}}>
                                        <div className="data-section">
                                            <div className="large-text">Avg</div>
                                        </div>
                                        <div
                                            className="label-hour">Godz.
                                        </div>
                                        <div className="axis-mark"></div>
                                    </div>
                                    {data.realhum_aver.data.map((item: number, index: number) => (
                                        <div className="metric-item">
                                            <div className="data-section">
                                                <div className="large-text">{(item).toFixed(0)}</div>
                                            </div>
                                            <div
                                                className="label-hour">{((firstHour + index) % 24).toString().padStart(2, "0")}:00
                                            </div>
                                            <div className="axis-mark"></div>
                                        </div>
                                    ))}
                                </div>
                                <div className="card-title">🌪️ ️️Wiatr (km/h)</div>
                                <div className="metric-container">
                                    <div className="metric-item" style={{paddingLeft: '10px'}}>
                                        <div className="data-section">
                                            <div className="small-text">Poryw</div>
                                            <div className="large-text">Avg</div>
                                        </div>
                                        <div
                                            className="label-hour">Godz.
                                        </div>
                                        <div className="axis-mark"></div>
                                    </div>
                                    {data.wind10_sd_true_prev_point.data.map((item: number, index: number) => (
                                        <div className="metric-item">
                                            <div className="data-section">
                                                <div
                                                    className="small-text">{(data.wind_gust_max.data[index] * 36 / 10).toFixed(0)}</div>
                                                <div className="large-text">{(item * 36 / 10).toFixed(0)}</div>
                                            </div>
                                            <div
                                                className="label-hour">{((firstHour + index) % 24).toString().padStart(2, "0")}:00
                                            </div>
                                            <div className="axis-mark"></div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )
                    }
                </Row>
            )
            }

            {/* Initial State (before first load or if first load fails instantly) */
            }
            {
                !data && !isLoading && !error && (
                    <p>No data loaded yet.</p>
                )
            }

        </Container>
    );
};

const WeatherHeader = styled.div`
    font-size: 1rem;
    color: #c1c1c1;
    width: 5rem;
    text-align: left;
`;