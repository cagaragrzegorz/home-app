import ReactDOM from 'react-dom/client';
import {App} from './App';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {AppContextProvider} from "./context/AppContextProvider";

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <AppContextProvider>
        <App/>
    </AppContextProvider>
);
