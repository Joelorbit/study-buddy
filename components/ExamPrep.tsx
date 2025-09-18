import React, { useState, useRef } from 'react';
import { useExamPrep } from '../hooks/useExamPrep';
import { generateStudyNote, generateSummary } from '../services/geminiService';
import { extractTextFromFile } from '../services/fileParser';
import CalendarIcon from './icons/CalendarIcon';
import MarkdownRenderer from './MarkdownRenderer';

const AiResponseCard: React.FC<{ title: string; content: string | null; isLoading: boolean }> = ({ title, content, isLoading }) => {
    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex items-center justify-center p-4">
                    <div className="w-8 h-8 border-4 border-t-4 border-gray-600 border-t-brand-primary rounded-full animate-spin"></div>
                    <span className="ml-4 text-dark-subtle">Generating...</span>
                </div>
            );
        }
        if (!content) {
            return <p className="text-dark-subtle italic">Click the button above to generate the {title.toLowerCase()}.</p>;
        }
        // Style error messages differently
        if (content.startsWith('Error:')) {
             return <p className="mb-2 text-red-400">{content}</p>;
        }
        return <MarkdownRenderer text={content} />;
    };

    return (
        <div className="bg-gray-900/50 rounded-xl p-4 w-full">
            <h4 className="text-lg font-bold text-dark-text mb-2">{title}</h4>
            <div className="text-dark-subtle max-h-48 overflow-y-auto pr-2">{renderContent()}</div>
        </div>
    );
};

const ExamPrepDashboard: React.FC = () => {
    const { getDaysUntilExam, fileContent, fileName, clearPrep } = useExamPrep();
    const [dailyNote, setDailyNote] = useState<string | null>(null);
    const [summary, setSummary] = useState<string | null>(null);
    const [isLoadingNote, setIsLoadingNote] = useState(false);
    const [isLoadingSummary, setIsLoadingSummary] = useState(false);

    const handleGetDailyNote = async () => {
        if (!fileContent) return;
        setIsLoadingNote(true);
        setDailyNote(null);
        try {
            const note = await generateStudyNote(fileContent, getDaysUntilExam());
            setDailyNote(note);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
            setDailyNote(`Error: ${errorMessage}`);
        } finally {
            setIsLoadingNote(false);
        }
    };

    const handleGetSummary = async () => {
        if (!fileContent) return;
        setIsLoadingSummary(true);
        setSummary(null);
        try {
            const summaryText = await generateSummary(fileContent);
            setSummary(summaryText);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
            setSummary(`Error: ${errorMessage}`);
        } finally {
            setIsLoadingSummary(false);
        }
    };
    
    const daysLeft = getDaysUntilExam();
    return (
        <div className="flex flex-col items-center justify-start p-6 bg-dark-card rounded-3xl shadow-2xl h-full w-full max-w-lg mx-auto text-dark-text">
            <div className="text-center w-full">
                <p className="text-dark-subtle text-lg">Your exam is in</p>
                <p className="text-8xl font-black text-brand-primary leading-none my-2">{daysLeft}</p>
                <p className="text-dark-subtle text-lg">{daysLeft === 1 ? 'Day' : 'Days'}</p>
                <p className="mt-2 text-sm text-gray-500">Studying from: <span className="font-semibold text-gray-400">{fileName}</span></p>
            </div>
            <div className="w-full border-t border-gray-700 my-4"></div>
            <div className="w-full flex flex-col items-center space-y-4 flex-grow overflow-y-auto pr-2">
                <button onClick={handleGetDailyNote} disabled={isLoadingNote} className="w-full px-6 py-3 text-lg font-bold text-white bg-gradient-to-r from-brand-primary to-brand-secondary rounded-lg shadow-lg hover:opacity-90 transition-opacity disabled:opacity-70">Get Today's Study Note</button>
                <AiResponseCard title="Today's Note" content={dailyNote} isLoading={isLoadingNote} />
                <button onClick={handleGetSummary} disabled={isLoadingSummary} className="w-full px-4 py-2 text-md font-bold text-dark-text bg-gray-600 hover:bg-gray-700 rounded-lg shadow-lg transition-colors disabled:opacity-70">Generate Full Summary</button>
                <AiResponseCard title="Summary" content={summary} isLoading={isLoadingSummary} />
            </div>
            <button onClick={clearPrep} className="mt-4 text-sm text-gray-500 hover:text-red-400 transition-colors flex-shrink-0">Reset Exam Prep</button>
        </div>
    );
};


const ExamPrep: React.FC = () => {
    const { isPrepSet, savePrep } = useExamPrep();
    const [date, setDate] = useState<string>('');
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isParsing, setIsParsing] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
            if (selectedFile.size > MAX_FILE_SIZE) {
                setError('File is too large. Please upload a file smaller than 5MB.');
                setFile(null);
                return;
            }

            const allowedTypes = ['text/plain', 'application/pdf'];
            if (allowedTypes.includes(selectedFile.type)) {
                setFile(selectedFile);
                setError(null);
            } else {
                setError('Please upload a .txt or .pdf file.');
                setFile(null);
            }
        }
    };

    const handleSave = async () => {
        if (!date || !file) {
            setError('Please set an exam date and upload a file.');
            return;
        }
        setIsParsing(true);
        setError(null);
        try {
            const content = await extractTextFromFile(file);
            savePrep(date, content, file.name);
        } catch (err) {
            setError((err as Error).message || "Failed to process the file.");
        } finally {
            setIsParsing(false);
        }
    };

    if (isPrepSet) {
        return <ExamPrepDashboard />;
    }

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-dark-card rounded-3xl shadow-2xl h-full w-full max-w-lg mx-auto">
            <CalendarIcon className="w-16 h-16 text-brand-primary mb-4" />
            <h2 className="text-3xl font-bold text-dark-text mb-2">Exam Prep Setup</h2>
            <p className="text-dark-subtle mb-8 text-center">Set your exam date and upload your study notes to get started.</p>

            {error && <p className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-6 w-full text-center">{error}</p>}
            
            <div className="w-full space-y-6">
                <div>
                    <label htmlFor="examDate" className="block text-sm font-medium text-dark-subtle mb-2">1. Set your exam date</label>
                    <input type="date" id="examDate" value={date} onChange={(e) => setDate(e.target.value)}
                           min={minDate}
                           className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-brand-primary focus:border-brand-primary transition" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-dark-subtle mb-2">2. Upload study material (.txt or .pdf)</label>
                    <div onClick={() => fileInputRef.current?.click()} className="flex justify-center w-full px-6 py-10 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-brand-primary transition-colors">
                        <div className="text-center">
                            <p className="text-dark-subtle">{file ? `Selected: ${file.name}` : 'Click to upload'}</p>
                            <p className="text-xs text-gray-500">Plain text or PDF files only</p>
                        </div>
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".txt,.pdf" className="hidden" />
                </div>
            </div>

            <button onClick={handleSave} disabled={isParsing} className="mt-10 w-full px-6 py-4 text-xl font-bold text-white bg-gradient-to-r from-brand-primary to-brand-secondary rounded-lg shadow-lg hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed">
                {isParsing ? 'Processing File...' : 'Start Prep'}
            </button>
        </div>
    );
};

export default ExamPrep;