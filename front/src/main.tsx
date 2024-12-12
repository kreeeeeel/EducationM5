// main.tsx
import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import Preloader from './Preloader'; // Import the Preloader component
import {retrieveLaunchParams} from '@telegram-apps/sdk-react';
import WebApp from '@twa-dev/sdk';
import {init} from './init';
import '@telegram-apps/telegram-ui/dist/styles.css';
import './mockEnv';
import {UserProvider} from "./contexts/UserContext.tsx";

// Call init() before rendering
init(retrieveLaunchParams().startParam === 'debug' || import.meta.env.DEV);
WebApp.ready();

export function Root() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 5000);

        // Cleanup the timer on unmount
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="relative">
            <UserProvider>
                {loading && (
                    <div
                        className={`absolute inset-0 transition-opacity ${
                            loading ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                    >
                        <Preloader loading={loading}/>
                    </div>
                )}

                {!loading && (
                    <div
                        className={`transition-opacity ${
                            loading ? 'opacity-0' : 'opacity-100'
                        }`}
                    >
                        <App/>
                    </div>
                )}
            </UserProvider>
        </div>
    );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Root/>
    </React.StrictMode>
);
