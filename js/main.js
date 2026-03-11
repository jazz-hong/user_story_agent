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

// Sections
const inputSection = document.getElementById('inputSection');
const chatSection = document.getElementById('chatSection');

// Chat Elements
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendChatBtn = document.getElementById('sendChatBtn');
const chatFileBtn = document.getElementById('chatFileBtn');
const chatFileInput = document.getElementById('chatFileInput');
const chatFilePreview = document.getElementById('chatFilePreview');
const chatFileName = document.getElementById('chatFileName');
const removeChatFileBtn = document.getElementById('removeChatFileBtn');

// Story Output Elements
const storyOutput = document.getElementById('storyOutput');
const storiesContainer = document.getElementById('storiesContainer');
const storyCount = document.getElementById('storyCount');
const copyAllStoriesBtn = document.getElementById('copyAllStoriesBtn');

let chatFile = null;
let chatFileContent = '';
let stories = []; // Store parsed stories

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

// Theme elements
const themeOptions = document.querySelectorAll('input[name="theme"]');

// OpenProject elements
const openProjectUrl = document.getElementById('openprojectUrl');
const openProjectApiKey = document.getElementById('openprojectApiKey');
const toggleOpenProjectKeyBtn = document.getElementById('toggleOpenProjectKeyBtn');
const testOpenProjectBtn = document.getElementById('testOpenProjectBtn');

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
    loadSavedTheme();
    setupThemeListeners();
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

    // OpenProject settings
    if (toggleOpenProjectKeyBtn) {
        toggleOpenProjectKeyBtn.addEventListener('click', toggleOpenProjectKeyVisibility);
    }
    if (testOpenProjectBtn) {
        testOpenProjectBtn.addEventListener('click', handleTestOpenProject);
    }

    // Load OpenProject settings when opening settings modal
    const originalOpenSettings = openSettings;
    openSettings = function() {
        originalOpenSettings();
        // Load OpenProject settings
        if (openProjectUrl) {
            openProjectUrl.value = localStorage.getItem('openproject_url') || '';
        }
        if (openProjectApiKey) {
            openProjectApiKey.value = localStorage.getItem('openproject_api_key') || '';
        }
    };

    // Instructions toggle
    instructionsToggle.addEventListener('click', toggleInstructions);

    // Keyboard shortcut (Ctrl/Cmd + Enter to generate)
    userInput.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            handleGenerate();
        }
    });

    // Chat Events
    chatInput.addEventListener('keydown', (e) => {
        // Ctrl+Enter or Cmd+Enter to send
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            handleSendChat();
        }
    });

    // Auto-resize textarea
    chatInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 150) + 'px';
    });

    sendChatBtn.addEventListener('click', handleSendChat);
    chatFileBtn.addEventListener('click', () => chatFileInput.click());
    chatFileInput.addEventListener('change', handleChatFileSelect);
    removeChatFileBtn.addEventListener('click', handleChatFileRemove);

    // Copy All Stories
    copyAllStoriesBtn.addEventListener('click', handleCopyAllStories);
}

// ============================================
// Theme Switching Functions
// ============================================
function applyTheme(theme) {
    const link = document.querySelector('link[href*="style"]');
    if (!link) return;

    if (theme === 'cyberpunk') {
        link.href = 'css/style-concept2.css';
    } else if (theme === 'hacker') {
        link.href = 'css/style-hacker.css';
    } else {
        link.href = 'css/style.css';
    }

    localStorage.setItem('selected_theme', theme);
}

function loadSavedTheme() {
    const savedTheme = localStorage.getItem('selected_theme') || 'original';
    themeOptions.forEach(option => {
        if (option.value === savedTheme) {
            option.checked = true;
        }
    });
    applyTheme(savedTheme);
}

function setupThemeListeners() {
    themeOptions.forEach(option => {
        option.addEventListener('change', (e) => {
            applyTheme(e.target.value);
        });
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

function toggleOpenProjectKeyVisibility() {
    if (!openProjectApiKey) return;
    const type = openProjectApiKey.type === 'password' ? 'text' : 'password';
    openProjectApiKey.type = type;
    const icon = toggleOpenProjectKeyBtn.querySelector('i');
    icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
}

async function handleTestOpenProject() {
    const url = openProjectUrl.value.trim();
    const apiKey = openProjectApiKey.value.trim();

    if (!url || !apiKey) {
        showToast('Please enter both URL and API key', 'error');
        return;
    }

    // Configure OpenProject API
    OpenProjectAPI.configure(url, apiKey);

    try {
        // Test the connection
        const result = await OpenProjectAPI.testConnection();
        showToast(`Connected! Welcome, ${result.user.name}`, 'success');
    } catch (error) {
        showToast('Connection failed: ' + error.message, 'error');
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

// ============================================
// Chat Functions
// ============================================
async function handleChatFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        try {
            showToast('Processing file...', 'info');

            // Check if it's an image
            if (file.type.startsWith('image/')) {
                // For images, just store the file and show preview
                chatFile = file;
                chatFileContent = ''; // No text extraction for images
                chatFileName.textContent = file.name;
                chatFilePreview.style.display = 'block';
                showToast('Image attached! You can describe what you want.', 'success');
            } else {
                // For documents, extract text
                const content = await window.fileProcessor.processFile(file);
                chatFile = file;
                chatFileContent = content;
                chatFileName.textContent = file.name;
                chatFilePreview.style.display = 'block';
                showToast('File loaded! Click send to generate stories.', 'success');
            }
        } catch (error) {
            showToast(`Error: ${error.message}`, 'error');
            console.error('Chat file processing error:', error);
        }
    }
}

function handleChatFileRemove() {
    chatFile = null;
    chatFileContent = '';
    chatFileInput.value = '';
    chatFilePreview.style.display = 'none';
}

async function handleSendChat() {
    const message = chatInput.value.trim();

    if (!message && !chatFileContent) {
        showToast('Please enter a message or attach a file', 'error');
        return;
    }

    if (!window.groqAI.isConfigured()) {
        showToast('Please configure Groq API key in Settings first', 'error');
        openSettings();
        return;
    }

    // Add user message to chat
    addChatMessage('user', message);
    chatInput.value = '';
    chatInput.style.height = 'auto';

    // Show loading
    const loadingMsg = addChatMessage('bot', 'Thinking...', true);
    sendChatBtn.disabled = true;

    try {
        // Prepare input: message + file content
        let input = message;
        if (chatFileContent) {
            input = `File content:\n${chatFileContent}\n\nUser message: ${message}`;
        } else if (chatFile && chatFile.type.startsWith('image/')) {
            input = `Image file: ${chatFile.name}\n\nUser message: ${message}`;
        }

        // Generate story from chat
        const result = await window.groqAI.generateStoryFromChat(input);

        // Remove loading message
        loadingMsg.remove();

        if (result.success) {
            addChatMessage('bot', result.content);

            // Show story output
            showStoryOutput(result.content);

            // Update usage
            window.groqAI.incrementUsage();
            updateUsageDisplay();

            // Clear file after sending
            handleChatFileRemove();
        } else {
            throw new Error('Failed to generate story');
        }
    } catch (error) {
        console.error('Chat error:', error);
        loadingMsg.remove();
        addChatMessage('bot', `Error: ${error.message}`);
        showToast(`Error: ${error.message}`, 'error');
    } finally {
        sendChatBtn.disabled = false;
    }
}

function addChatMessage(role, content, isLoading = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${role}${isLoading ? ' loading' : ''}`;

    const avatarIcon = role === 'bot' ? 'fa-robot' : 'fa-user';

    // For bot messages, preserve line breaks
    const formattedContent = content.replace(/\n/g, '<br>');

    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas ${avatarIcon}"></i>
        </div>
        <div class="message-content">
            <p>${formattedContent}</p>
        </div>
    `;

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    return messageDiv;
}

// ============================================
// Story Output Functions
// ============================================
function showStoryOutput(content) {
    // Parse stories from content
    stories = parseStories(content);

    // Update UI
    storyCount.textContent = `${stories.length} story/stories`;
    storiesContainer.innerHTML = '';

    // Create a card for each story
    stories.forEach((story, index) => {
        const card = createStoryCard(story, index);
        storiesContainer.appendChild(card);
    });

    storyOutput.style.display = 'block';

    // Scroll to story output
    storyOutput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function parseStories(content) {
    // Split by "## USER STORY" pattern
    const storyPattern = /## USER STORY \d+\/\d+:/gi;
    const parts = content.split(storyPattern);

    const parsedStories = [];

    // First part might be empty or intro text
    for (let i = 1; i < parts.length; i++) {
        const storyText = '## USER STORY ' + parts[i].trim();
        parsedStories.push(storyText);
    }

    // If no stories found, use the whole content as one story
    if (parsedStories.length === 0) {
        parsedStories.push(content);
    }

    return parsedStories;
}

function createStoryCard(storyContent, index) {
    const card = document.createElement('div');
    card.className = 'story-card';
    card.dataset.index = index;

    card.innerHTML = `
        <div class="story-card-header">
            <span class="story-card-number">Story ${index + 1}</span>
            <div class="story-card-actions">
                <button class="btn btn-primary btn-upload-story" data-index="${index}" title="Upload to OpenProject">
                    <i class="fas fa-cloud-upload-alt"></i> Upload
                </button>
                <button class="btn btn-success btn-copy-story" data-index="${index}">
                    <i class="fas fa-copy"></i> Copy
                </button>
                <button class="btn btn-info btn-edit-story" data-index="${index}">
                    <i class="fas fa-edit"></i> Edit
                </button>
            </div>
        </div>
        <textarea class="story-card-content" data-index="${index}" rows="12" disabled>${storyContent}</textarea>
    `;

    // Add event listeners
    const copyBtn = card.querySelector('.btn-copy-story');
    const editBtn = card.querySelector('.btn-edit-story');
    const uploadBtn = card.querySelector('.btn-upload-story');
    const textarea = card.querySelector('.story-card-content');

    copyBtn.addEventListener('click', () => handleCopySingleStory(index, textarea.value, copyBtn));
    editBtn.addEventListener('click', () => handleEditSingleStory(index, textarea, editBtn));
    uploadBtn.addEventListener('click', () => handleUploadToOpenProject(index, textarea.value, uploadBtn));

    return card;
}

function handleCopySingleStory(index, content, btnElement) {
    if (!content) {
        showToast('Nothing to copy', 'error');
        return;
    }

    navigator.clipboard.writeText(content).then(() => {
        showToast('Story copied to clipboard!', 'success');

        // Visual feedback
        const originalHTML = btnElement.innerHTML;
        btnElement.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
            btnElement.innerHTML = originalHTML;
        }, 2000);
    }).catch(err => {
        console.error('Copy failed:', err);
        showToast('Failed to copy', 'error');
    });
}

function handleEditSingleStory(index, textarea, btnElement) {
    const isEditing = !textarea.disabled;

    if (isEditing) {
        // Save and disable
        textarea.disabled = true;
        textarea.classList.remove('edit-mode');
        btnElement.innerHTML = '<i class="fas fa-edit"></i> Edit';
        showToast(`Story ${index + 1} updated!`, 'success');
    } else {
        // Enable editing
        textarea.disabled = false;
        textarea.classList.add('edit-mode');
        textarea.focus();
        btnElement.innerHTML = '<i class="fas fa-check"></i> Confirm';
    }
}

function handleCopyAllStories() {
    if (stories.length === 0) {
        showToast('No stories to copy', 'error');
        return;
    }

    const allStories = stories.join('\n\n---\n\n');

    navigator.clipboard.writeText(allStories).then(() => {
        showToast('All stories copied to clipboard!', 'success');

        // Visual feedback
        const originalHTML = copyAllStoriesBtn.innerHTML;
        copyAllStoriesBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
            copyAllStoriesBtn.innerHTML = originalHTML;
        }, 2000);
    }).catch(err => {
        console.error('Copy failed:', err);
        showToast('Failed to copy', 'error');
    });
}

// Store current story being uploaded
let currentUploadingStory = { index: 0, content: '' };

function handleUploadToOpenProject(index, content, btnElement) {
    // Get OpenProject settings
    const openProjectUrl = localStorage.getItem('openproject_url') || '';
    const openProjectApiKey = localStorage.getItem('openproject_api_key') || '';

    if (!openProjectUrl || !openProjectApiKey) {
        showToast('Please configure OpenProject in Settings first', 'error');
        openSettings();
        return;
    }

    // Initialize OpenProject API
    OpenProjectAPI.configure(openProjectUrl, openProjectApiKey);

    // Store current story info
    currentUploadingStory = { index, content, btnElement };

    // Show project selection modal
    showProjectSelectionModal();
}

async function showProjectSelectionModal() {
    // Create modal if not exists
    let modal = document.getElementById('opProjectModal');
    if (!modal) {
        modal = createOpenProjectModal();
        document.body.appendChild(modal);
    }

    // Show loading state
    const modalBody = modal.querySelector('.modal-body');
    modalBody.innerHTML = '<div class="loading-state"><div class="spinner"></div><p>Loading projects...</p></div>';

    // Show modal
    modal.style.display = 'flex';

    try {
        // Fetch projects
        const projects = await OpenProjectAPI.getProjects();

        if (projects.length === 0) {
            modalBody.innerHTML = '<p>No projects found. You may not have access to any projects.</p><button class="btn btn-secondary" onclick="closeOPModal()">Close</button>';
            return;
        }

        // Render project list
        modalBody.innerHTML = `
            <h3 style="margin-bottom: 1rem;">Select Project</h3>
            <div style="max-height: 300px; overflow-y: auto;">
                ${projects.map(p => `
                    <button class="btn btn-secondary" style="width: 100%; margin-bottom: 0.5rem; justify-content: flex-start;"
                            onclick="selectProject(${p.id}, '${p.name.replace(/'/g, "\\'")}')">
                        <i class="fas fa-folder"></i> ${p.name}
                    </button>
                `).join('')}
            </div>
            <button class="btn btn-secondary" style="margin-top: 1rem;" onclick="closeOPModal()">Cancel</button>
        `;
    } catch (error) {
        modalBody.innerHTML = `<p style="color: red;">Error loading projects: ${error.message}</p>
            <button class="btn btn-secondary" onclick="closeOPModal()">Close</button>`;
    }
}

async function selectProject(projectId, projectName) {
    const modal = document.getElementById('opProjectModal');
    const modalBody = modal.querySelector('.modal-body');

    modalBody.innerHTML = '<div class="loading-state"><div class="spinner"></div><p>Loading work package types...</p></div>';

    try {
        const types = await OpenProjectAPI.getWorkPackageTypes(projectId);

        if (types.length === 0) {
            modalBody.innerHTML = '<p>No work package types found for this project.</p><button class="btn btn-secondary" onclick="showProjectSelectionModal()">Back</button>';
            return;
        }

        // Store selected project
        window.selectedOPProject = { id: projectId, name: projectName };

        // Render type list
        modalBody.innerHTML = `
            <p style="margin-bottom: 1rem;">Project: <strong>${projectName}</strong></p>
            <h3 style="margin-bottom: 1rem;">Select Work Package Type</h3>
            <div style="max-height: 300px; overflow-y: auto;">
                ${types.map(t => `
                    <button class="btn" style="width: 100%; margin-bottom: 0.5rem; justify-content: flex-start; background: ${t.color || '#666'}; color: white;"
                            onclick="selectWorkPackageType(${t.id}, '${t.name.replace(/'/g, "\\'")}')">
                        <i class="fas fa-tag"></i> ${t.name}
                    </button>
                `).join('')}
            </div>
            <button class="btn btn-secondary" style="margin-top: 1rem;" onclick="showProjectSelectionModal()">Back</button>
        `;
    } catch (error) {
        modalBody.innerHTML = `<p style="color: red;">Error loading types: ${error.message}</p>
            <button class="btn btn-secondary" onclick="showProjectSelectionModal()">Back</button>`;
    }
}

async function selectWorkPackageType(typeId, typeName) {
    const { index, content, btnElement } = currentUploadingStory;
    const { id: projectId, name: projectName } = window.selectedOPProject;

    const modal = document.getElementById('opProjectModal');
    const modalBody = modal.querySelector('.modal-body');

    // Show loading
    btnElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
    btnElement.disabled = true;

    try {
        // Parse story content
        const { subject, description } = OpenProjectAPI.parseStoryContent(content);

        // Create work package
        const result = await OpenProjectAPI.createWorkPackage(projectId, typeId, subject, description);

        // Success!
        btnElement.innerHTML = '<i class="fas fa-check"></i> Uploaded!';
        showToast(`Story uploaded to ${projectName}!`, 'success');

        // Open the work package in new tab
        window.open(result.workPackage.link, '_blank');

        closeOPModal();
    } catch (error) {
        btnElement.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Failed';
        showToast('Upload failed: ' + error.message, 'error');

        // Reset button after delay
        setTimeout(() => {
            btnElement.innerHTML = '<i class="fas fa-upload"></i> Upload';
            btnElement.disabled = false;
        }, 2000);
    }
}

function closeOPModal() {
    const modal = document.getElementById('opProjectModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function createOpenProjectModal() {
    const modal = document.createElement('div');
    modal.id = 'opProjectModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <div class="modal-header">
                <h2><i class="fas fa-upload"></i> Upload to OpenProject</h2>
                <button class="modal-close" onclick="closeOPModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="loading-state">
                    <div class="spinner"></div>
                    <p>Loading...</p>
                </div>
            </div>
        </div>
    `;

    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeOPModal();
        }
    });

    return modal;
}

console.log('✅ User Story Agent - Created by Jazz Hong | Powered by Groq AI');
