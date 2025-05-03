import React, {useCallback, useEffect, useState} from 'react';
import './DashboardMock.css';
import KidsClock from "../clock/KidsClock";
import {ApiError} from "./types";
import axios, {AxiosError, AxiosResponse} from "axios";
import {fetchAvailableMeteograms, postUM460Meteograms} from "../../api/meteoClient";
import {AvailableMeteorgams} from "../../api/types";


const FETCH_INTERVAL_MS = 15 * 60 * 1000; // 15 minutes in milliseconds

const DashboardMock: React.FC = () => {
    const [data, setData] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<ApiError | null>(null);
    const [firstHour, setFirstHour] = useState<number>(0);
    // const firstHour = new Date(+data.airtmp_point.first_timestamp * 1000).getHours()


    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const meteogramResponse: AvailableMeteorgams = await fetchAvailableMeteograms();
            const latestMeteogram: number = Math.max(...meteogramResponse.um4_60)
            const dataResponse = await postUM460Meteograms(latestMeteogram)
            setData(dataResponse.data);
            setFirstHour(new Date(+dataResponse.data.airtmp_point.first_timestamp * 1000).getHours())
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

    // data.airtmp_max temperatura max - DONE
    // data.airtmp_min temperatura min- DONE
    // data.airtmp_point temperatura - DONE
    // data.trpres_point cisnienie atmosferyczne - DONE
    // data.slpres_point cisnienie atmosferyczne zredukowane - DONE
    // data.realhum_aver wilgotnosc wzgledna - DONE
    // data.wind10_sd_true_prev_point predkosc wiatru - DONE
    // data.wind_gust_max poryw wiatru - DONE
    // data.pcpttlprob_point prawdopodowienstwo deszczu - DONE
    // data.pcpttl_aver sredni deszcz - DONE
    // data.pcpttl_max max deszcz - DONE


    return (
        <div className="dashboard-container">
            <KidsClock/>

            {/* Loading State */}
            {isLoading && <p>Loading data...</p>}

            {/* Error State */}
            {error && !isLoading && <p style={{color: 'red'}}>Error: {error.message}</p>}

            {/* Success State */}
            {data && !isLoading && !error && (
                <div className="info-card">
                    <div className="card-title">Temperatura (°C) {firstHour}</div>
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
                                    className="label-hour">{(firstHour + index) % 24 < 10 ? '0' : ''}{(firstHour + index) % 24}:00
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
                                    className="label-hour">{(firstHour + index) % 24 < 10 ? '0' : ''}{(firstHour + index) % 24}:00
                                </div>
                                <div className="axis-mark"></div>
                            </div>
                        ))}
                    </div>
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
                                    <div className="small-text">{(data.slpres_point.data[index] / 100).toFixed(0)}</div>
                                </div>
                                <div
                                    className="label-hour">{(firstHour + index) % 24 < 10 ? '0' : ''}{(firstHour + index) % 24}:00
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
                                    className="label-hour">{(firstHour + index) % 24 < 10 ? '0' : ''}{(firstHour + index) % 24}:00
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
                                    className="label-hour">{(firstHour + index) % 24 < 10 ? '0' : ''}{(firstHour + index) % 24}:00
                                </div>
                                <div className="axis-mark"></div>
                            </div>
                        ))}
                    </div>
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

export default DashboardMock;