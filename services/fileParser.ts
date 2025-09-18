import * as pdfjsLib from 'pdfjs-dist/build/pdf.min.mjs';

// The worker is needed for PDF.js to work in the browser.
// We provide a URL to the worker script from a reliable CDN.
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@4.5.136/build/pdf.worker.min.mjs';

/**
 * Extracts text content from a given file (txt or pdf).
 * @param file The file to process.
 * @returns A promise that resolves with the extracted text content.
 */
export const extractTextFromFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = async (event) => {
            try {
                if (file.type === 'text/plain') {
                    resolve(event.target?.result as string);
                } else if (file.type === 'application/pdf') {
                    const arrayBuffer = event.target?.result as ArrayBuffer;
                    if (!arrayBuffer) {
                        return reject(new Error("Failed to read file buffer."));
                    }
                    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                    let fullText = '';
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const textContent = await page.getTextContent();
                        // item.str is the property holding the text. Use a type guard to be safe.
                        const pageText = textContent.items.map(item => ('str' in item ? item.str : '')).join(' ');
                        fullText += pageText + '\n\n'; // Add newlines between pages for clarity
                    }
                    resolve(fullText.trim());
                } else {
                    reject(new Error('Unsupported file type.'));
                }
            } catch (error) {
                console.error('Error processing file:', error);
                reject(new Error('Failed to parse the file. It may be corrupted.'));
            }
        };
        
        reader.onerror = (error) => {
            console.error('FileReader error:', error);
            reject(new Error('Failed to read the file.'));
        };
        
        // Read file based on its type to feed the parser
        if (file.type === 'application/pdf') {
            reader.readAsArrayBuffer(file);
        } else if (file.type === 'text/plain') {
             reader.readAsText(file);
        } else {
             reject(new Error('Unsupported file type. Please upload a .txt or .pdf file.'));
        }
    });
};
