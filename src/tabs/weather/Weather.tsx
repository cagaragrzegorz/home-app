import React, {useCallback, useEffect, useState} from 'react';
import './Weather.css';
import {ApiError} from "./types";
import axios, {AxiosError, AxiosResponse} from "axios";
import {fetchAvailableMeteograms, postUM460Meteograms} from "../../api/meteoClient";
import {AvailableMeteorgams} from "../../api/types";
import {ChevronDown, ChevronUp} from "lucide-react";
import TemperatureLineGraph from "../../components/TemperatureLineGraph";
import {Spinner} from 'react-bootstrap/esm';


const FETCH_INTERVAL_MS = 15 * 60 * 1000; // 15 minutes in milliseconds

const Weather: React.FC = () => {
    const [data, setData] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<ApiError | null>(null);
    const [firstHour, setFirstHour] = useState<number>(0);
    const [advMetric, setAdvMetric] = useState<boolean>(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const meteogramResponse: AvailableMeteorgams = await fetchAvailableMeteograms();
            const latestMeteogram: number = Math.max(...meteogramResponse.um4_60)
            let dataResponse = await postUM460Meteograms(latestMeteogram)
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
        console.log(`Setting up interval: Fetching every ${FETCH_INTERVAL_MS / 60000} minutes.`);
        const intervalId = setInterval(() => {
            fetchData();
        }, FETCH_INTERVAL_MS);

        return () => {
            clearInterval(intervalId);
        };
    }, [fetchData]);

    // @ts-ignore
    return (
        <div className="weather-container">
            {/* Loading State */}
            {isLoading && <div className="kids-clock-wrapper">
                <Spinner animation="border" role="status"
                         variant="light"/>
            </div>}

                {/* Error State */}
                {error && !isLoading && <p style={{color: 'red'}}>Error: {error.message}</p>}

            {/* Success State */}
            {data && !isLoading && !error && (
                <div className="info-card">
                    {data && (
                        <div style={{ background: "#222", padding: 16, borderRadius: 8, marginBottom: 24 }}>
                            <TemperatureLineGraph data={data.airtmp_point.data}
                                                  data_max={data.airtmp_max.data}
                                                  data_min={data.airtmp_min.data}
                                                  firstHour={firstHour}
                                                  startDate={new Date(new Date(+data.airtmp_point.first_timestamp * 1000).setHours(firstHour)).toISOString()}/>
                        </div>
                    )}
                    <div className="card-title">Temperatura (°C)</div>
                    <div className="metric-container">
                        <div className="metric-item" style={{paddingLeft: '10px'}}>
                            <div className="data-section">
                                <div className="small-text">Max</div>
                                <div className="large-text">Avg</div>
                                <div className="small-text">Min</div>
                            </div>
                            <div
                                className="label-hour">Hour
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
                    <div className="card-title">Opady (mm)</div>
                    <div className="metric-container">
                        <div className="metric-item" style={{paddingLeft: '10px'}}>
                            <div className="data-section">
                                <div className="small-text">Max</div>
                                <div className="large-text">Avg</div>
                                <div className="large-text">P(%)</div>
                            </div>
                            <div
                                className="label-hour">Hour
                            </div>
                            <div className="axis-mark"></div>
                        </div>
                        {data.pcpttl_aver.data.map((item: number, index: number) => (
                            <div className="metric-item">
                                <div className="data-section">
                                    <div className="small-text">{data.pcpttl_max.data[index].toFixed(1)}</div>
                                    <div className="large-text">{item.toFixed(1)}</div>
                                    <div className="large-text">{data.pcpttlprob_point.data[index].toFixed(0)}</div>
                                </div>
                                <div
                                    className="label-hour">{((firstHour + index) % 24).toString().padStart(2, "0")}:00
                                </div>
                                <div className="axis-mark"></div>
                            </div>
                        ))}
                    </div>
                    <div onClick={()=>{setAdvMetric(!advMetric)}}>{advMetric ? <ChevronDown color="white"/>:<ChevronUp color="white"/>}</div>
                    {advMetric ?  (<>
                            <div className="card-title">Ciśnienie atmosferyczne (hPa)</div>
                            <div className="metric-container">
                                <div className="metric-item" style={{paddingLeft: '10px'}}>
                                    <div className="data-section">
                                        <div className="large-text">Avg</div>
                                        <div className="small-text">Red</div>
                                    </div>
                                    <div
                                        className="label-hour">Hour
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
                            <div className="card-title">Wilgotność względna (%)</div>
                            <div className="metric-container">
                                <div className="metric-item" style={{paddingLeft: '10px'}}>
                                    <div className="data-section">
                                        <div className="large-text">Avg</div>
                                    </div>
                                    <div
                                        className="label-hour">Hour
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
                            <div className="card-title">Wiatr (km/h)</div>
                            <div className="metric-container">
                                <div className="metric-item" style={{paddingLeft: '10px'}}>
                                    <div className="data-section">
                                        <div className="small-text">Poryw</div>
                                        <div className="large-text">Avg</div>
                                    </div>
                                    <div
                                        className="label-hour">Hour
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
                    ) : <div/>}

                </div>
            )}

            {/* Initial State (before first load or if first load fails instantly) */}
            {!data && !isLoading && !error && (
                <p>No data loaded yet.</p>
            )}

        </div>
    )
        ;
};

export default Weather;