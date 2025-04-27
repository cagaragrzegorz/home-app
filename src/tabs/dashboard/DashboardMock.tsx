import React, {useCallback, useEffect, useState} from 'react';
import './DashboardMock.css';
import KidsClock from "../clock/KidsClock";
import {ApiError} from "./types";
import axios, {AxiosError} from "axios";


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
            const meteogramResponse = await axios.get<any>('https://devmgramapi.meteo.pl/meteorograms/available');
            const latestMeteogram = Math.max(...meteogramResponse.data.um4_60)
            // console.log('latestMeteogram:', latestMeteogram);
            const dataResponse = await axios.post<any>('https://devmgramapi.meteo.pl/meteorograms/um4_60',
                {
                    "date": latestMeteogram,
                    "point": {
                        "lat": "50.04507",
                        "lon": "19.99766"
                    }
                });
            setData(dataResponse.data.data);
            setFirstHour(new Date(+dataResponse.data.data.airtmp_point.first_timestamp * 1000).getHours())
            // console.log('Data fetched successfully:', dataResponse.data);
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

    // data.airtmp_max temperatura max
    // data.airtmp_min temperatura min
    // data.airtmp_point temperatura
    // data.trpres_point cisnienie atmosferyczne
    // data.slpres_point cisnienie atmosferyczne zredukowane
    // data.realhum_aver wilgotnosc wzgledna
    // data.wind10_sd_true_prev_point predkosc wiatru
    // data.wind_gust_max poryw wiatru
    // data.pcpttlprob_point prawdopodowienstwo deszczu ??????

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
                            <div className="data-section" >
                                <div style={{fontSize: "20px"}}>Max</div>
                                <div className="large-text">Avg</div>
                                <div style={{fontSize: "20px"}}>Min</div>
                            </div>
                            <div
                                className="label-hour">Hour
                            </div>
                            <div className="axis-mark"></div>
                        </div>
                        {data.airtmp_point.data.map((item: number, index: number) => (
                            <div className="metric-item">
                                <div className="data-section">
                                    <div style={{fontSize: "20px"}}>{data.airtmp_max.data[index].toFixed(1)}</div>
                                    <div className="large-text">{item.toFixed(1)}</div>
                                    <div style={{fontSize: "20px"}}>{data.airtmp_min.data[index].toFixed(1)}</div>
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