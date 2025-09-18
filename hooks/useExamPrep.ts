import { useState, useEffect, useCallback } from 'react';

const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: T) => void] => {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    const setValue = (value: T) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(error);
        }
    };

    return [storedValue, setValue];
};

export const useExamPrep = () => {
    const [examDate, setExamDate] = useLocalStorage<string | null>('examDate', null);
    const [fileContent, setFileContent] = useLocalStorage<string | null>('fileContent', null);
    const [fileName, setFileName] = useLocalStorage<string | null>('fileName', null);

    const isPrepSet = examDate !== null && fileContent !== null;

    const savePrep = (date: string, content: string, name: string) => {
        setExamDate(date);
        setFileContent(content);
        setFileName(name);
    };
    
    const clearPrep = () => {
        setExamDate(null);
        setFileContent(null);
        setFileName(null);
    };
    
    const getDaysUntilExam = useCallback(() => {
        if (!examDate) return 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize today's date
        const exam = new Date(examDate);
        exam.setHours(0,0,0,0); // Normalize exam date
        const differenceInTime = exam.getTime() - today.getTime();
        const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
        return differenceInDays >= 0 ? differenceInDays : 0;
    }, [examDate]);

    return {
        examDate,
        fileContent,
        fileName,
        isPrepSet,
        savePrep,
        clearPrep,
        getDaysUntilExam,
    };
};