import { useState, useEffect } from 'react';

// The <T> is a "Generic". It just means "Type". 
// It allows us to use this hook for an Array of Assets, a plain string, a number, anything!
export function useLocalStorage<T>(key: string, initialValue: T) {

    // 1. We moved the messy initialization logic here
    const [value, setValue] = useState<T>(() => {
        const savedData = localStorage.getItem(key);
        if (savedData) {
            try {
                return JSON.parse(savedData);
            } catch (error) {
                console.error("Error parsing saved data:", error);
                return initialValue;
            }
        }
        return initialValue;
    });

    // 2. We moved the save-to-browser logic here
    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    // 3. We return the value and the setter, making it look and act exactly like standard useState!
    return [value, setValue] as const;
}