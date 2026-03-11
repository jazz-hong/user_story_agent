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
2. **Story Structure**: Always use "> As a **[role]**, I want [action], so that [benefit]"
3. **Standard Roles - CRITICAL**: Use ONLY these roles:
   - **User**: For most features (default choice for end-users, including model training, data operations, and system interactions)
   - **Administrator**: Only for admin-specific features (user management, system configuration, permissions)
   - **System**: Only for automated backend processes (scheduled tasks, integrations, webhooks)
   - **NEVER use "Developer"** - Replace with "User" or "Administrator" depending on context
4. **Acceptance Criteria**: Create 3-7 clear, testable checklist items
5. **Definition of Done**: Always include the complete, fixed DoD checklist (see format below)
6. **Smart Table Handling**: If input contains table data (rows with Module/Task/Status), extract meaningful content only - ignore row numbers, headers, and table structure
7. **Clean Output**: Generate stories that are ready to copy-paste into OpenProject

OUTPUT FORMAT (CRITICAL - FOLLOW EXACTLY):
---
## USER STORY 1/X: [Clear Title]

> As a **[role]**, I want [action], so that [benefit]

**Description:**
[2-3 sentences providing context and background]

**Acceptance Criteria:**

*   [ ] [Specific, testable criterion]
*   [ ] [Another criterion]
*   [ ] [Another criterion]

**Definition of Done:**

*   [ ] All linting issue resolved
*   [ ] All unit test passed
*   [ ] All security test passed
*   [ ] All performance test passed
*   [ ] Gitlab CI is configured for all relevant test stages
*   [ ] If it is to resolve a bug, there must be a corresponding unit test to prevent regression
*   [ ] Profiling is done
*   [ ] Model metric is recorded in repository
*   [ ] Data retention rule is configured
*   [ ] Documentations are updated
    *   [ ] Inline comments
    *   [ ] Readme
*   [ ] Software Design Document is updated
    *   [ ] Data Dictionary
    *   [ ] Test Documentation
*   [ ] Software Architecture Design is updated
*   [ ] UAT script is done
*   [ ] Work is version controlled and stored to respective repository.
*   [ ] UI/UX is designed in accordance to SAINS standard for external projects.
*   [ ] Data retention is configured

---

IMPORTANT FORMAT NOTES:
- User story format goes directly after the header (no "Story Statement" label)
- Use "*   [ ]" (asterisk + 3 spaces + checkbox) for acceptance criteria
- "**Definition of Done:**" must be in BOLD and include the complete fixed checklist
- NO clarification section - all stories must be complete and ready to use
- Definition of Done is identical for ALL stories (use the exact format shown above)

ROLE SELECTION EXAMPLES:
- ✅ "As a User, I want to retrain the AI model..." (model training, data operations)
- ✅ "As a User, I want to upload documents..." (regular user features)
- ✅ "As an Administrator, I want to manage user permissions..." (admin-only features)
- ✅ "As a System, I want to automatically sync data..." (automated processes)
- ❌ "As a Developer, I want to..." (NEVER USE - replace with "User" or "Administrator")

If multiple stories are needed, number them clearly (1/3, 2/3, 3/3) and make each story independent and focused.`;
    }

    /**
     * Generate User Stories from input
     */
    async generateUserStories(input) {
        const prompt = `Analyze the following input and generate professional User Stories following the format and rules provided.

INPUT:
${input}

Generate complete, professional User Stories that are ready to copy into OpenProject. Each story must include the full Definition of Done checklist. Suggest story splitting if the input contains multiple distinct features.`;

        return await this.generateResponse(prompt);
    }

    /**
     * Generate User Story from Chat input
     * This method enforces Story format output
     */
    async generateStoryFromChat(input) {
        const prompt = `You are an expert Agile Coach and Business Analyst specializing in writing high-quality User Stories.

Your task is to analyze the user's input and generate professional User Stories. The input can be:
- Meeting notes
- Feature ideas
- Bullet points
- Requirements description
- Any software-related description

Always try to interpret the input as user story requirements and generate appropriate User Stories. Do NOT refuse unless the input is completely unrelated to software (like asking about weather, personal questions, etc.).

USER INPUT:
${input}

OUTPUT FORMAT (MUST FOLLOW):
---
## USER STORY 1/X: [Clear Title]

> As a **[role]**, I want [action], so that [benefit]

**Description:**
[2-3 sentences providing context and background]

**Acceptance Criteria:**

*   [ ] [Specific, testable criterion]
*   [ ] [Another criterion]
*   [ ] [Another criterion]

**Definition of Done:**

*   [ ] All linting issue resolved
*   [ ] All unit test passed
*   [ ] All security test passed
*   [ ] All performance test passed
*   [ ] Gitlab CI is configured for all relevant test stages
*   [ ] If it is to resolve a bug, there must be a corresponding unit test to prevent regression
*   [ ] Profiling is done
*   [ ] Model metric is recorded in repository
*   [ ] Data retention rule is configured
*   [ ] Documentations are updated
    *   [ ] Inline comments
    *   [ ] Readme
*   [ ] Software Design Document is updated
    *   [ ] Data Dictionary
    *   [ ] Test Documentation
*   [ ] Software Architecture Design is updated
*   [ ] UAT script is done
*   [ ] Work is version controlled and stored to respective repository.
*   [ ] UI/UX is designed in accordance to SAINS standard for external projects.
*   [ ] Data retention is configured

---

If multiple features are mentioned, create separate stories for each. If the input is unclear, make reasonable assumptions and create stories based on the information provided.`;

        return await this.generateResponse(prompt, {
            maxTokens: 4500
        });
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
