/**
 * File Processor - Handles file uploads and extraction
 * Supports: .txt, .md, .html, .doc, .docx, .pdf
 */

class FileProcessor {
    constructor() {
        this.supportedFormats = {
            text: ['.txt', '.md'],
            html: ['.html', '.htm'],
            word: ['.doc', '.docx'],
            pdf: ['.pdf']
        };
    }

    /**
     * Process uploaded file and extract text content
     * @param {File} file - The uploaded file
     * @returns {Promise<Object>} - Extracted text content and metadata
     */
    async processFile(file) {
        const fileName = file.name.toLowerCase();
        const fileExtension = '.' + fileName.split('.').pop();

        // Check file size (max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            throw new Error('File size too large. Maximum 10MB allowed.');
        }

        // Route to appropriate processor based on file type
        if (this.supportedFormats.text.includes(fileExtension)) {
            return await this.processTextFile(file);
        } else if (this.supportedFormats.html.includes(fileExtension)) {
            return await this.processHTMLFile(file);
        } else if (this.supportedFormats.word.includes(fileExtension)) {
            return await this.processWordFile(file);
        } else if (this.supportedFormats.pdf.includes(fileExtension)) {
            return await this.processPDFFile(file);
        } else {
            throw new Error(`Unsupported file format: ${fileExtension}`);
        }
    }

    /**
     * Process plain text or markdown files
     * @param {File} file - Text file
     * @returns {Promise<string>} - File content
     */
    async processTextFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                resolve(e.target.result);
            };
            
            reader.onerror = (e) => {
                reject(new Error('Failed to read text file'));
            };
            
            reader.readAsText(file);
        });
    }

    /**
     * Process HTML files - extract text content
     * @param {File} file - HTML file
     * @returns {Promise<string>} - Extracted text
     */
    async processHTMLFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const htmlContent = e.target.result;
                    const text = this.extractTextFromHTML(htmlContent);
                    resolve(text);
                } catch (error) {
                    reject(new Error('Failed to parse HTML file'));
                }
            };
            
            reader.onerror = (e) => {
                reject(new Error('Failed to read HTML file'));
            };
            
            reader.readAsText(file);
        });
    }

    /**
     * Extract text from HTML content
     * @param {string} html - HTML content
     * @returns {string} - Plain text
     */
    extractTextFromHTML(html) {
        // Create a temporary div to parse HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        // Remove script and style elements
        const scripts = tempDiv.getElementsByTagName('script');
        const styles = tempDiv.getElementsByTagName('style');
        
        for (let i = scripts.length - 1; i >= 0; i--) {
            scripts[i].remove();
        }
        
        for (let i = styles.length - 1; i >= 0; i--) {
            styles[i].remove();
        }

        // Get text content
        let text = tempDiv.textContent || tempDiv.innerText || '';
        
        // Clean up extra whitespace
        text = text.replace(/\n\s*\n\s*\n/g, '\n\n'); // Max 2 consecutive newlines
        text = text.trim();
        
        return text;
    }

    /**
     * Process Word documents (.docx)
     * @param {File} file - Word file
     * @returns {Promise<string>} - Extracted text
     */
    async processWordFile(file) {
        // Check if mammoth library is loaded
        if (typeof mammoth === 'undefined') {
            throw new Error('Word file processor not loaded. Please refresh the page.');
        }

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = async (e) => {
                try {
                    const arrayBuffer = e.target.result;
                    
                    // Use mammoth.js to extract text from .docx
                    const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
                    
                    if (result.value) {
                        resolve(result.value);
                    } else {
                        reject(new Error('No text content found in Word file'));
                    }
                } catch (error) {
                    console.error('Word processing error:', error);
                    reject(new Error('Failed to process Word file: ' + error.message));
                }
            };
            
            reader.onerror = (e) => {
                reject(new Error('Failed to read Word file'));
            };
            
            reader.readAsArrayBuffer(file);
        });
    }

    /**
     * Process PDF files
     * @param {File} file - PDF file
     * @returns {Promise<string>} - Extracted text
     */
    async processPDFFile(file) {
        // Check if PDF.js library is loaded
        if (typeof pdfjsLib === 'undefined') {
            throw new Error('PDF processor not loaded. Please refresh the page.');
        }

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = async (e) => {
                try {
                    const arrayBuffer = e.target.result;
                    
                    // Set worker path for PDF.js
                    pdfjsLib.GlobalWorkerOptions.workerSrc = 
                        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                    
                    // Load PDF document
                    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                    
                    let fullText = '';
                    
                    // Extract text from each page
                    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                        const page = await pdf.getPage(pageNum);
                        const textContent = await page.getTextContent();
                        
                        const pageText = textContent.items
                            .map(item => item.str)
                            .join(' ');
                        
                        fullText += pageText + '\n\n';
                    }
                    
                    if (fullText.trim()) {
                        resolve(fullText.trim());
                    } else {
                        reject(new Error('No text content found in PDF'));
                    }
                } catch (error) {
                    console.error('PDF processing error:', error);
                    reject(new Error('Failed to process PDF file: ' + error.message));
                }
            };
            
            reader.onerror = (e) => {
                reject(new Error('Failed to read PDF file'));
            };
            
            reader.readAsArrayBuffer(file);
        });
    }

    /**
     * Format file size for display
     * @param {number} bytes - File size in bytes
     * @returns {string} - Formatted size
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    /**
     * Validate file type
     * @param {File} file - File to validate
     * @returns {boolean} - Whether file is supported
     */
    isFileSupported(file) {
        const fileName = file.name.toLowerCase();
        const fileExtension = '.' + fileName.split('.').pop();
        
        const allSupportedFormats = [
            ...this.supportedFormats.text,
            ...this.supportedFormats.html,
            ...this.supportedFormats.word,
            ...this.supportedFormats.pdf
        ];
        
        return allSupportedFormats.includes(fileExtension);
    }

    /**
     * Get file icon based on extension
     * @param {string} fileName - Name of the file
     * @returns {string} - Font Awesome icon class
     */
    getFileIcon(fileName) {
        const extension = '.' + fileName.toLowerCase().split('.').pop();
        
        if (this.supportedFormats.word.includes(extension)) {
            return 'fa-file-word';
        } else if (this.supportedFormats.pdf.includes(extension)) {
            return 'fa-file-pdf';
        } else if (this.supportedFormats.html.includes(extension)) {
            return 'fa-file-code';
        } else if (extension === '.md') {
            return 'fa-file-alt';
        } else {
            return 'fa-file';
        }
    }
}

// Create global instance
window.fileProcessor = new FileProcessor();

console.log('✅ File Processor loaded - Created by Jazz Hong');
