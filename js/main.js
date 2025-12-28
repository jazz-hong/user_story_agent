/**
 * Main Application Logic for User Story Agent with Groq AI
 * 
 * Created by: Jazz Hong
 * Powered by: Groq AI (Llama 3.3 70B Versatile)
 */

// ============================================
// DOM Elements
// ============================================
const userInput = document.getElementById('userInput');
const generateBtn = document.getElementById('generateBtn');
const clearBtn = document.getElementById('clearBtn');
const copyBtn = document.getElementById('copyBtn');
const regenerateBtn = document.getElementById('regenerateBtn');
const charCount = document.getElementById('charCount');
const outputSection = document.getElementById('outputSection');
const loadingState = document.getElementById('loadingState');
const outputContent = document.getElementById('outputContent');
const outputText = document.getElementById('outputText');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const instructionsToggle = document.getElementById('instructionsToggle');
const instructionsContent = document.getElementById('instructionsContent');

// File upload elements
const uploadZone = document.getElementById('uploadZone');
const fileInput = document.getElementById('fileInput');
const fileInfo = document.getElementById('fileInfo');
const fileName = document.getElementById('fileName');
const fileSize = document.getElementById('fileSize');
const removeFileBtn = document.getElementById('removeFileBtn');
const fileNotice = document.getElementById('fileNotice');

// Settings modal elements
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');
const apiKeyInput = document.getElementById('apiKeyInput');
const toggleApiKeyBtn = document.getElementById('toggleApiKeyBtn');
const saveApiKeyBtn = document.getElementById('saveApiKeyBtn');
const testApiKeyBtn = document.getElementById('testApiKeyBtn');
const clearApiKeyBtn = document.getElementById('clearApiKeyBtn');
const apiStatus = document.getElementById('apiStatus');
const usageStats = document.getElementById('usageStats');
const usageProgress = document.getElementById('usageProgress');
const usageCount = document.getElementById('usageCount');
const usageLimit = document.getElementById('usageLimit');
const usagePercentage = document.getElementById('usagePercentage');

// ============================================
// State Management
// ============================================
let lastInput = '';
let generatedStory = '';
let uploadedFile = null;
let uploadedFileContent = ''; // Store file content separately

// ============================================
// Initialization
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadFromLocalStorage();
    updateAPIStatus();
    updateUsageDisplay();
});

// ============================================
// Event Listeners
// ============================================
function setupEventListeners() {
    // Input changes
    userInput.addEventListener('input', () => {
        updateCharCount();
        saveToLocalStorage();
    });

    // Generate button
    generateBtn.addEventListener('click', handleGenerate);

    // Clear button
    clearBtn.addEventListener('click', handleClear);

    // Copy button
    copyBtn.addEventListener('click', handleCopy);

    // Regenerate button
    regenerateBtn.addEventListener('click', handleRegenerate);

    // File upload
    uploadZone.addEventListener('click', () => fileInput.click());
    uploadZone.addEventListener('dragover', handleDragOver);
    uploadZone.addEventListener('drop', handleDrop);
    fileInput.addEventListener('change', handleFileSelect);
    removeFileBtn.addEventListener('click', handleFileRemove);

    // Settings modal
    settingsBtn.addEventListener('click', openSettings);
    closeSettingsBtn.addEventListener('click', closeSettings);
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) closeSettings();
    });

    // API Key management
    toggleApiKeyBtn.addEventListener('click', toggleApiKeyVisibility);
    saveApiKeyBtn.addEventListener('click', handleSaveApiKey);
    testApiKeyBtn.addEventListener('click', handleTestApiKey);
    clearApiKeyBtn.addEventListener('click', handleClearApiKey);
    apiKeyInput.addEventListener('input', handleApiKeyInput);

    // Instructions toggle
    instructionsToggle.addEventListener('click', toggleInstructions);

    // Keyboard shortcut (Ctrl/Cmd + Enter to generate)
    userInput.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            handleGenerate();
        }
    });
}

// ============================================
// Settings Modal Functions
// ============================================
function openSettings() {
    settingsModal.style.display = 'flex';
    apiKeyInput.value = window.groqAI.apiKey;
    updateAPIStatus();
    updateUsageDisplay();
}

function closeSettings() {
    settingsModal.style.display = 'none';
}

function toggleApiKeyVisibility() {
    const type = apiKeyInput.type === 'password' ? 'text' : 'password';
    apiKeyInput.type = type;
    const icon = toggleApiKeyBtn.querySelector('i');
    icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
}

function handleApiKeyInput() {
    const value = apiKeyInput.value.trim();
    if (value.length > 0) {
        testApiKeyBtn.style.display = 'inline-flex';
    } else {
        testApiKeyBtn.style.display = 'none';
    }
}

async function handleSaveApiKey() {
    const apiKey = apiKeyInput.value.trim();
    
    if (!apiKey) {
        showToast('Please enter an API key', 'error');
        return;
    }

    if (!window.groqAI.isValidKeyFormat(apiKey)) {
        showToast('Invalid API key format. Groq keys start with "gsk_"', 'error');
        return;
    }

    // Show loading
    saveApiKeyBtn.disabled = true;
    saveApiKeyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Testing...';

    // Test the API key
    const result = await window.groqAI.testApiKey(apiKey);

    if (result.success) {
        window.groqAI.saveApiKey(apiKey);
        updateAPIStatus();
        updateUsageDisplay();
        showToast('API key saved successfully!', 'success');
        clearApiKeyBtn.style.display = 'inline-flex';
    } else {
        showToast(`Failed: ${result.message}`, 'error');
    }

    // Reset button
    saveApiKeyBtn.disabled = false;
    saveApiKeyBtn.innerHTML = '<i class="fas fa-save"></i> Save API Key';
}

async function handleTestApiKey() {
    const apiKey = apiKeyInput.value.trim();
    
    if (!apiKey) {
        showToast('Please enter an API key', 'error');
        return;
    }

    // Show loading
    testApiKeyBtn.disabled = true;
    testApiKeyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Testing...';

    const result = await window.groqAI.testApiKey(apiKey);

    if (result.success) {
        showToast('API key is valid!', 'success');
    } else {
        showToast(`Invalid: ${result.message}`, 'error');
    }

    // Reset button
    testApiKeyBtn.disabled = false;
    testApiKeyBtn.innerHTML = '<i class="fas fa-vial"></i> Test Connection';
}

function handleClearApiKey() {
    if (confirm('Are you sure you want to clear your API key? You will need to re-enter it to generate stories.')) {
        window.groqAI.clearApiKey();
        apiKeyInput.value = '';
        updateAPIStatus();
        updateUsageDisplay();
        clearApiKeyBtn.style.display = 'none';
        testApiKeyBtn.style.display = 'none';
        showToast('API key cleared', 'info');
    }
}

function updateAPIStatus() {
    const isConfigured = window.groqAI.isConfigured();
    const statusDiv = apiStatus.querySelector('.status-indicator');
    
    if (isConfigured) {
        statusDiv.className = 'status-indicator status-active';
        statusDiv.innerHTML = '<i class="fas fa-circle"></i><span>AI Connected (Groq / Llama 3.3 70B Versatile)</span>';
        clearApiKeyBtn.style.display = 'inline-flex';
        generateBtn.disabled = false;
    } else {
        statusDiv.className = 'status-indicator status-inactive';
        statusDiv.innerHTML = '<i class="fas fa-circle"></i><span>AI Not Configured - Click Settings to Add API Key</span>';
        clearApiKeyBtn.style.display = 'none';
        generateBtn.disabled = true;
    }
}

function updateUsageDisplay() {
    if (!window.groqAI.isConfigured()) {
        usageStats.style.display = 'none';
        return;
    }

    const stats = window.groqAI.getUsageStats();
    usageStats.style.display = 'block';
    usageProgress.style.width = `${stats.percentage}%`;
    usageCount.textContent = stats.requests;
    usageLimit.textContent = stats.limit;
    usagePercentage.textContent = stats.percentage;

    // Change color based on usage
    if (stats.percentage > 80) {
        usageProgress.style.background = 'linear-gradient(90deg, #EF4444, #DC2626)';
    } else if (stats.percentage > 50) {
        usageProgress.style.background = 'linear-gradient(90deg, #F59E0B, #D97706)';
    } else {
        usageProgress.style.background = 'linear-gradient(90deg, #10B981, #4F46E5)';
    }
}

// ============================================
// File Upload Functions
// ============================================
function handleDragOver(e) {
    e.preventDefault();
    uploadZone.style.borderColor = 'var(--primary-color)';
    uploadZone.style.background = 'rgba(79, 70, 229, 0.05)';
}

function handleDrop(e) {
    e.preventDefault();
    uploadZone.style.borderColor = 'var(--gray-light)';
    uploadZone.style.background = 'var(--bg-light)';
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        processFile(files[0]);
    }
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        processFile(file);
    }
}

async function processFile(file) {
    try {
        // Show loading state
        showToast('Processing file...', 'info');
        
        // Process file using FileProcessor
        const content = await window.fileProcessor.processFile(file);
        
        // Store file info and content separately
        uploadedFile = file;
        uploadedFileContent = content; // Store content separately
        
        // Update UI
        fileName.textContent = file.name;
        fileSize.textContent = formatFileSize(file.size);
        
        // Show file info, hide upload zone
        uploadZone.style.display = 'none';
        fileInfo.style.display = 'flex';
        fileNotice.style.display = 'flex';
        
        // DON'T set textarea content - keep it editable!
        // User can add their own notes in addition to the file
        // Textarea stays blank and editable
        
        updateCharCount();
        
        showToast('File loaded successfully! You can add additional notes in the text area.', 'success');
    } catch (error) {
        showToast(`Error: ${error.message}`, 'error');
        console.error('File processing error:', error);
    }
}

function handleFileRemove() {
    uploadedFile = null;
    uploadedFileContent = ''; // Clear file content
    fileInput.value = '';
    
    // Show upload zone, hide file info
    uploadZone.style.display = 'flex';
    fileInfo.style.display = 'none';
    fileNotice.style.display = 'none';
    
    // Textarea stays as is - user might have notes
    updateCharCount();
    
    showToast('File removed', 'info');
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// ============================================
// Generate Story Functions
// ============================================
async function handleGenerate() {
    const textareaInput = userInput.value.trim();
    
    // Combine file content + textarea input
    let combinedInput = '';
    
    if (uploadedFileContent) {
        combinedInput = uploadedFileContent;
        
        // If user also typed something, add it
        if (textareaInput) {
            combinedInput += '\n\n--- ADDITIONAL NOTES FROM PRODUCT OWNER ---\n\n' + textareaInput;
        }
    } else {
        combinedInput = textareaInput;
    }
    
    if (!combinedInput) {
        showToast('Please enter some requirements or upload a file', 'error');
        return;
    }
    
    const input = combinedInput;

    if (!window.groqAI.isConfigured()) {
        showToast('Please configure Groq API key in Settings first', 'error');
        openSettings();
        return;
    }

    // Show output section and loading state
    outputSection.style.display = 'block';
    loadingState.style.display = 'block';
    outputContent.style.display = 'none';
    generateBtn.disabled = true;

    try {
        // Save input
        lastInput = input;
        saveToLocalStorage();

        // Generate story using Groq AI
        const result = await window.groqAI.generateUserStories(input);
        
        if (result.success) {
            generatedStory = result.content;
            
            // Display result
            outputText.textContent = generatedStory;
            loadingState.style.display = 'none';
            outputContent.style.display = 'block';
            
            // Update usage
            window.groqAI.incrementUsage();
            updateUsageDisplay();
            
            // Save to localStorage
            saveToLocalStorage();
            
            // Scroll to output
            outputSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            showToast('User stories generated successfully!', 'success');
        } else {
            throw new Error('Failed to generate stories');
        }
    } catch (error) {
        console.error('Generation error:', error);
        showToast(`Error: ${error.message}`, 'error');
        outputSection.style.display = 'none';
    } finally {
        generateBtn.disabled = false;
    }
}

async function handleRegenerate() {
    if (!lastInput) {
        showToast('No previous input to regenerate from', 'error');
        return;
    }

    // Show loading state
    loadingState.style.display = 'block';
    outputContent.style.display = 'none';
    regenerateBtn.disabled = true;

    try {
        // Generate story using Groq AI
        const result = await window.groqAI.generateUserStories(lastInput);
        
        if (result.success) {
            generatedStory = result.content;
            
            // Display result
            outputText.textContent = generatedStory;
            loadingState.style.display = 'none';
            outputContent.style.display = 'block';
            
            // Update usage
            window.groqAI.incrementUsage();
            updateUsageDisplay();
            
            // Save to localStorage
            saveToLocalStorage();
            
            showToast('User stories regenerated!', 'success');
        } else {
            throw new Error('Failed to regenerate stories');
        }
    } catch (error) {
        console.error('Regeneration error:', error);
        showToast(`Error: ${error.message}`, 'error');
    } finally {
        regenerateBtn.disabled = false;
    }
}

// ============================================
// Utility Functions
// ============================================
function handleClear() {
    if (confirm('Are you sure you want to clear all input and output?')) {
        userInput.value = '';
        outputText.textContent = '';
        outputSection.style.display = 'none';
        lastInput = '';
        generatedStory = '';
        handleFileRemove();
        updateCharCount();
        saveToLocalStorage();
        showToast('Cleared!', 'info');
    }
}

function handleCopy() {
    const text = outputText.textContent;
    if (!text) {
        showToast('Nothing to copy', 'error');
        return;
    }

    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!', 'success');
        
        // Visual feedback
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
            copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy to Clipboard';
        }, 2000);
    }).catch(err => {
        console.error('Copy failed:', err);
        showToast('Failed to copy', 'error');
    });
}

function updateCharCount() {
    const count = userInput.value.length;
    charCount.textContent = count.toLocaleString();
}

function toggleInstructions() {
    instructionsContent.classList.toggle('active');
    instructionsToggle.classList.toggle('active');
}

function showToast(message, type = 'info') {
    toastMessage.textContent = message;
    
    // Change icon based on type
    const icon = toast.querySelector('i');
    if (type === 'success') {
        icon.className = 'fas fa-check-circle';
    } else if (type === 'error') {
        icon.className = 'fas fa-exclamation-circle';
    } else {
        icon.className = 'fas fa-info-circle';
    }
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ============================================
// LocalStorage Functions
// ============================================
function saveToLocalStorage() {
    localStorage.setItem('userInput', userInput.value);
    localStorage.setItem('generatedStory', generatedStory);
}

function loadFromLocalStorage() {
    const savedInput = localStorage.getItem('userInput');
    const savedStory = localStorage.getItem('generatedStory');
    
    if (savedInput) {
        userInput.value = savedInput;
        lastInput = savedInput;
        updateCharCount();
    }
    
    if (savedStory) {
        generatedStory = savedStory;
        outputText.textContent = savedStory;
        outputSection.style.display = 'block';
        loadingState.style.display = 'none';
        outputContent.style.display = 'block';
    }
}

console.log('✅ User Story Agent - Created by Jazz Hong | Powered by Groq AI');
