/**
 * Groq AI Integration for User Story Agent
 * 
 * Created by: Jazz Hong
 * AI Model: Groq (Llama 3.3 70B Versatile)
 * FREE Tier: 14,400 requests/day
 * Perfect for 2-10 Product Owners
 */

class GroqAI {
    constructor() {
        this.apiKey = this.loadApiKey();
        this.endpoint = 'https://api.groq.com/openai/v1/chat/completions';
        this.model = 'llama-3.3-70b-versatile'; // Latest & most versatile model
        this.maxTokens = 4000;
        this.temperature = 0.7;
    }

    /**
     * Load API key from localStorage
     */
    loadApiKey() {
        return localStorage.getItem('groq_api_key') || '';
    }

    /**
     * Save API key to localStorage
     */
    saveApiKey(apiKey) {
        const trimmedKey = apiKey.trim();
        localStorage.setItem('groq_api_key', trimmedKey);
        this.apiKey = trimmedKey;
        return true;
    }

    /**
     * Clear API key from localStorage
     */
    clearApiKey() {
        localStorage.removeItem('groq_api_key');
        this.apiKey = '';
    }

    /**
     * Check if API key is configured
     */
    isConfigured() {
        return this.apiKey && this.apiKey.length > 0;
    }

    /**
     * Validate API key format
     */
    isValidKeyFormat(apiKey) {
        // Groq API keys start with 'gsk_'
        return apiKey && apiKey.trim().startsWith('gsk_') && apiKey.trim().length > 20;
    }

    /**
     * Test API key by making a simple request
     */
    async testApiKey(apiKey = this.apiKey) {
        try {
            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [
                        { role: 'user', content: 'Say "API key is valid" if you can read this.' }
                    ],
                    max_tokens: 20,
                    temperature: 0.1
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || 'Invalid API key');
            }

            return { success: true, message: 'API key is valid!' };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    /**
     * Generate AI response using Groq API
     */
    async generateResponse(prompt, options = {}) {
        if (!this.isConfigured()) {
            throw new Error('Groq API key is not configured. Please add your API key in Settings.');
        }

        const systemPrompt = options.systemPrompt || this.getDefaultSystemPrompt();
        const maxTokens = options.maxTokens || this.maxTokens;
        const temperature = options.temperature || this.temperature;

        try {
            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: prompt }
                    ],
                    max_tokens: maxTokens,
                    temperature: temperature,
                    stream: false
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || 'Failed to generate response');
            }

            const data = await response.json();
            const content = data.choices[0]?.message?.content;

            if (!content) {
                throw new Error('No response from AI');
            }

            return {
                success: true,
                content: content,
                usage: data.usage // Token usage stats
            };

        } catch (error) {
            console.error('Groq API Error:', error);
            throw new Error(`AI Generation Failed: ${error.message}`);
        }
    }

    /**
     * Default system prompt for User Story generation
     */
    getDefaultSystemPrompt() {
        return `You are an expert Agile Coach and Business Analyst specializing in writing high-quality User Stories for software development teams.

Your task is to analyze input (which may come from meeting notes, bullet points, Word documents with tables, or informal descriptions) and generate professional User Stories.

KEY RULES:
1. **One Feature Per Story**: If input contains multiple features, create separate stories
2. **Story Structure**: Always use "As a [role], I want to [action], so that [benefit]"
3. **Standard Roles**: Use only: Developer, User, Administrator, System
4. **Acceptance Criteria**: Create 3-7 clear, testable checklist items
5. **Flag Ambiguities**: Add "⚠️ CLARIFICATION NEEDED" section with specific questions
6. **Definition of Done**: Always include a placeholder section
7. **Smart Table Handling**: If input contains table data (rows with Module/Task/Status), extract meaningful content only - ignore row numbers, headers, and table structure
8. **Clean Output**: Generate stories that are ready to copy-paste into OpenProject
9. **Category Classification**: Analyze each story and classify it into ONE of these categories:
   - Backend (API, database, server-side logic, integrations, microservices)
   - Frontend (UI/UX, web interfaces, client-side features, styling)
   - Mobile (iOS/Android apps, mobile-specific features, native functionality)
   - Machine Learning (AI models, data science, ML pipelines, model training)

OUTPUT FORMAT (CRITICAL - FOLLOW EXACTLY):
---
## USER STORY 1/X: [Clear Title] (Category)

As a [role], I want [action], so that [benefit].

**Description:**  
[2-3 sentences providing context and background]

**Acceptance Criteria:**

*   [ ] [Specific, testable criterion]
*   [ ] [Another criterion]
*   [ ] [Another criterion]

Definition of Done:  
[Standard DoD will be added from project template]

**⚠️ CLARIFICATION NEEDED (For PO Review - Remove before adding to OpenProject):**
• [Specific question about ambiguous requirement]
• [Another question if needed]

---

IMPORTANT FORMAT NOTES:
- Category must be in parentheses after the title (e.g., "## USER STORY 1/3: Enhance AI Model Accuracy (Backend)")
- User story format goes directly after the header (no "Story Statement" label)
- Use "*   [ ]" (asterisk + 3 spaces + checkbox) for acceptance criteria
- "Definition of Done:" comes BEFORE clarification section
- Use bullet points with "•" for clarification questions

If multiple stories are needed, number them clearly (1/3, 2/3, 3/3) and make each story independent and focused.`;
    }

    /**
     * Generate User Stories from input
     */
    async generateUserStories(input) {
        const prompt = `Analyze the following input and generate professional User Stories following the format and rules provided.

INPUT:
${input}

Generate complete, professional User Stories that are ready to copy into OpenProject. Remember to flag any ambiguities and suggest story splitting if the input contains multiple distinct features.`;

        return await this.generateResponse(prompt);
    }

    /**
     * Get API usage statistics (estimated - Groq doesn't expose this directly)
     */
    getUsageStats() {
        const requestsToday = parseInt(localStorage.getItem('groq_requests_today') || '0');
        const lastResetDate = localStorage.getItem('groq_last_reset') || '';
        const today = new Date().toDateString();

        // Reset counter if it's a new day
        if (lastResetDate !== today) {
            localStorage.setItem('groq_requests_today', '0');
            localStorage.setItem('groq_last_reset', today);
            return { requests: 0, limit: 14400, percentage: 0 };
        }

        const percentage = ((requestsToday / 14400) * 100).toFixed(1);

        return {
            requests: requestsToday,
            limit: 14400,
            percentage: parseFloat(percentage)
        };
    }

    /**
     * Increment request counter
     */
    incrementUsage() {
        const stats = this.getUsageStats();
        const newCount = stats.requests + 1;
        localStorage.setItem('groq_requests_today', newCount.toString());
        localStorage.setItem('groq_last_reset', new Date().toDateString());
    }

    /**
     * Get model information
     */
    getModelInfo() {
        return {
            name: 'Llama 3.3 70B Versatile',
            provider: 'Groq',
            speed: 'Ultra-fast',
            cost: 'FREE (14,400 requests/day)',
            description: 'Latest versatile open-source model optimized for speed and quality'
        };
    }
}

// Create global instance
window.groqAI = new GroqAI();

console.log('✅ Groq AI Integration loaded - Created by Jazz Hong');
