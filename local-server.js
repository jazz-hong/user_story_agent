/**
 * Local Proxy Server for OpenProject API
 * This bypasses CORS restrictions by making server-to-server requests
 *
 * Usage:
 *   npm install
 *   node local-server.js
 *
 * Then update OpenProject settings to use:
 *   - URL: http://localhost:3001 (or your server URL)
 *   - API Key: Your OpenProject API key
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// OpenProject Configuration
const OPENPROJECT_BASE_URL = process.env.OPENPROJECT_BASE_URL || 'https://openproject.lab.sains.com.my';
const OPENPROJECT_API_KEY = process.env.OPENPROJECT_API_KEY || '';

// Helper: Create Basic Auth header for OpenProject
function getAuthHeader(apiKey) {
    const auth = Buffer.from(`apikey:${apiKey}`).toString('base64');
    return `Basic ${auth}`;
}

// Proxy: Test Connection
app.post('/api/openproject/test', async (req, res) => {
    try {
        const apiKey = req.body.apiKey || OPENPROJECT_API_KEY;
        if (!apiKey) {
            res.status(400).json({ error: 'API Key required' });
            return;
        }

        const baseUrl = OPENPROJECT_BASE_URL.replace(/\/$/, '');
        const targetUrl = `${baseUrl}/api/v3/users/me`;

        console.log(`[OP Proxy] Testing connection to: ${targetUrl}`);

        const response = await fetch(targetUrl, {
            headers: {
                'Authorization': getAuthHeader(apiKey),
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            res.status(response.status).json({
                error: 'Connection failed',
                details: errorText
            });
            return;
        }

        const data = await response.json();
        res.json({
            success: true,
            user: {
                id: data.id,
                name: data.name,
                email: data.email
            }
        });
    } catch (error) {
        console.error('[OP Proxy] Test error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Proxy: Get Projects
app.post('/api/openproject/projects', async (req, res) => {
    try {
        const apiKey = req.body.apiKey || OPENPROJECT_API_KEY;
        if (!apiKey) {
            res.status(400).json({ error: 'API Key required' });
            return;
        }

        const baseUrl = OPENPROJECT_BASE_URL.replace(/\/$/, '');
        const targetUrl = `${baseUrl}/api/v3/projects?pageSize=100`;

        console.log(`[OP Proxy] Fetching projects from: ${targetUrl}`);

        const response = await fetch(targetUrl, {
            headers: {
                'Authorization': getAuthHeader(apiKey),
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            res.status(response.status).json({
                error: 'Failed to fetch projects',
                details: errorText
            });
            return;
        }

        const data = await response.json();
        const projects = data._embedded?.elements?.map(p => ({
            id: p.id,
            name: p.name,
            identifier: p.identifier,
            description: p.description?.raw || ''
        })) || [];

        res.json(projects);
    } catch (error) {
        console.error('[OP Proxy] Projects error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Proxy: Get Work Package Types for a Project
app.post('/api/openproject/types', async (req, res) => {
    try {
        const { projectId } = req.body;
        const apiKey = req.body.apiKey || OPENPROJECT_API_KEY;

        if (!apiKey) {
            res.status(400).json({ error: 'API Key required' });
            return;
        }

        if (!projectId) {
            res.status(400).json({ error: 'Project ID required' });
            return;
        }

        const baseUrl = OPENPROJECT_BASE_URL.replace(/\/$/, '');
        const targetUrl = `${baseUrl}/api/v3/projects/${projectId}/types`;

        console.log(`[OP Proxy] Fetching types from: ${targetUrl}`);

        const response = await fetch(targetUrl, {
            headers: {
                'Authorization': getAuthHeader(apiKey),
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            res.status(response.status).json({
                error: 'Failed to fetch types',
                details: errorText
            });
            return;
        }

        const data = await response.json();
        const types = data._embedded?.elements?.map(t => ({
            id: t.id,
            name: t.name,
            color: t.color
        })) || [];

        res.json(types);
    } catch (error) {
        console.error('[OP Proxy] Types error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Proxy: Create Work Package
app.post('/api/openproject/work_packages', async (req, res) => {
    try {
        const { projectId, typeId, subject, description } = req.body;
        const apiKey = req.body.apiKey || OPENPROJECT_API_KEY;

        if (!apiKey) {
            res.status(400).json({ error: 'API Key required' });
            return;
        }

        if (!projectId || !typeId || !subject) {
            res.status(400).json({ error: 'Project ID, Type ID, and Subject are required' });
            return;
        }

        const baseUrl = OPENPROJECT_BASE_URL.replace(/\/$/, '');
        const targetUrl = `${baseUrl}/api/v3/work_packages`;

        console.log(`[OP Proxy] Creating work package in project ${projectId}`);

        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Authorization': getAuthHeader(apiKey),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                subject: subject,
                description: {
                    raw: description || ''
                },
                _links: {
                    project: {
                        href: `/api/v3/projects/${projectId}`
                    },
                    type: {
                        href: `/api/v3/types/${typeId}`
                    }
                }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            res.status(response.status).json({
                error: 'Failed to create work package',
                details: errorText
            });
            return;
        }

        const data = await response.json();
        res.json({
            success: true,
            workPackage: {
                id: data.id,
                subject: data.subject,
                link: `${baseUrl}/work_packages/${data.id}`
            }
        });
    } catch (error) {
        console.error('[OP Proxy] Create work package error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', server: 'OpenProject Proxy' });
});

app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║         OpenProject Proxy Server                           ║
╠════════════════════════════════════════════════════════════╣
║  Server running on: http://localhost:${PORT}                 ║
║  OpenProject URL: ${OPENPROJECT_BASE_URL}                    ║
║                                                            ║
║  API Endpoints:                                           ║
║    POST /api/openproject/test       - Test connection    ║
║    POST /api/openproject/projects   - Get projects       ║
║    POST /api/openproject/types       - Get work types     ║
║    POST /api/openproject/work_packages - Create work pkg  ║
╚════════════════════════════════════════════════════════════╝
    `);
});
