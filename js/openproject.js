/**
 * OpenProject API Integration (via Local Proxy)
 * Handles authentication, project listing, and work package creation
 * Uses local proxy server to bypass CORS restrictions
 */

const OpenProjectAPI = {
    proxyUrl: '',
    apiKey: '',

    /**
     * Initialize with stored credentials
     */
    init() {
        // Get the proxy URL from localStorage or use default
        this.proxyUrl = localStorage.getItem('openproject_proxy_url') || 'http://localhost:3001';
        this.apiKey = localStorage.getItem('openproject_api_key') || '';
        return this.isConfigured();
    },

    /**
     * Check if credentials are configured
     */
    isConfigured() {
        return this.proxyUrl && this.apiKey;
    },

    /**
     * Save credentials
     */
    configure(proxyUrl, apiKey) {
        this.proxyUrl = proxyUrl.replace(/\/$/, ''); // Remove trailing slash
        this.apiKey = apiKey;
        localStorage.setItem('openproject_proxy_url', this.proxyUrl);
        localStorage.setItem('openproject_api_key', this.apiKey);
    },

    /**
     * Clear credentials
     */
    clear() {
        this.proxyUrl = '';
        this.apiKey = '';
        localStorage.removeItem('openproject_proxy_url');
        localStorage.removeItem('openproject_api_key');
    },

    /**
     * Make API request via proxy
     */
    async proxyRequest(endpoint, options = {}) {
        if (!this.isConfigured()) {
            throw new Error('OpenProject is not configured. Please set up the proxy server.');
        }

        const url = `${this.proxyUrl}${endpoint}`;
        const body = {
            apiKey: this.apiKey,
            ...options.body
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.details || errorData.message || `API error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('OpenProject API error:', error);
            if (error.message === 'Failed to fetch') {
                throw new Error('Cannot connect to proxy server. Make sure local-server.js is running on port 3001.');
            }
            throw error;
        }
    },

    /**
     * Test connection - get current user
     */
    async testConnection() {
        const data = await this.proxyRequest('/api/openproject/test');
        return {
            success: true,
            user: data.user
        };
    },

    /**
     * Get all projects the user has access to
     */
    async getProjects() {
        const projects = await this.proxyRequest('/api/openproject/projects');
        return projects;
    },

    /**
     * Get work package types for a project
     */
    async getWorkPackageTypes(projectId) {
        const types = await this.proxyRequest('/api/openproject/types', {
            body: { projectId }
        });
        return types;
    },

    /**
     * Create a work package (User Story)
     */
    async createWorkPackage(projectId, typeId, subject, description) {
        const result = await this.proxyRequest('/api/openproject/work_packages', {
            body: {
                projectId,
                typeId,
                subject,
                description
            }
        });

        return result;
    },

    /**
     * Parse story content to extract title and description
     */
    parseStoryContent(content) {
        // Try to extract the story title from the content
        // Look for patterns like "## Story 1:" or just use first line
        const lines = content.trim().split('\n');
        let subject = 'User Story';
        let description = content;

        // Check if first line is a header like "## Story 1:"
        if (lines[0] && lines[0].match(/^#{1,3}\s+Story\s+\d+/i)) {
            subject = lines[0].replace(/^#{1,3}\s+Story\s+\d+:\s*/, '').trim();
            description = lines.slice(1).join('\n').trim();
        } else if (lines[0]) {
            // Use first non-empty line as subject
            const firstLine = lines[0].replace(/^[-*]\s*/, '').trim();
            if (firstLine.length > 0 && firstLine.length < 100) {
                subject = firstLine;
                description = lines.slice(1).join('\n').trim();
            }
        }

        return { subject, description };
    }
};

// Export for use in main.js
window.OpenProjectAPI = OpenProjectAPI;
