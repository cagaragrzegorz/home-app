import apiClient from "./apiClient";
import {AvailableMeteorgams} from "./types";
import axios from "axios";

export const fetchAvailableMeteograms = async (): Promise<AvailableMeteorgams> => {
    const response = await apiClient.get<AvailableMeteorgams>('https://devmgramapi.meteo.pl/meteorograms/available');
    return response.data as AvailableMeteorgams;
};

export const postUM460Meteograms = async (latestMeteogram: number) => {
    const response = await axios.post<any>('https://devmgramapi.meteo.pl/meteorograms/um4_60',
        {
            "date": latestMeteogram,
            "point": {
                "lat": "50.04507",
                "lon": "19.99766"
            }
        });
    return response.data;
};