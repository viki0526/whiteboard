// SessionContext.jsx
import React, { createContext, useContext, useState } from 'react';

export const SessionContext = createContext({
    sessionId: null,
    setSessionId: () => {}
});

export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children }) => {
    const [sessionId, setSessionId] = useState("local-playground");

    return (
        <SessionContext.Provider value={{ sessionId, setSessionId }}>
            {children}
        </SessionContext.Provider>
    );
};
