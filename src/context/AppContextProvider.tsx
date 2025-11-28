import React, { PropsWithChildren, useMemo, useState } from 'react';

import { AppData, AppContext } from './AppContext';

const initialAppData = {
    timestamp: Date.now(),
    day: new Date().toLocaleDateString('pl-PL', { weekday: 'long' })
};

export const AppContextProvider = ({ children }: PropsWithChildren) => {

    const [appData, setAppData] = useState<AppData>(initialAppData);

    const context = useMemo(
        () => ({ appData, setAppData }),
        [appData],
    );
    return (
        <AppContext.Provider value={context}>
            {children}
        </AppContext.Provider>
    );
};
