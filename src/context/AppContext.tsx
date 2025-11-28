import {
    createContext,
    SetStateAction,
} from 'react';

export type AppData = { timestamp: number; day: string}

export type AppContextType = {
    appData: AppData;
    setAppData: (value: SetStateAction<AppData>) => void;
};

export const AppContext = createContext<AppContextType>({
    appData: { timestamp: 0, day: '' },
    setAppData: () => [],
});