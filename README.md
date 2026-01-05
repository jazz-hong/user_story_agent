# User Story Agent

**Version:** v2.0.0 🚀  
**Creator:** Jazz Hong  
**License:** MIT License

---

## 📖 Introduction

Lightweight web tool that converts meeting notes or raw requirements into well-structured, **production-ready** Agile user stories using an AI backend powered by Groq AI (Llama 3.3 70B Versatile).

---

## 🎉 What's New in v2.0.0

### ✨ Major Updates

#### 1. **Version Display**
- Version badge visible in header (glassmorphism design)
- Version information in footer
- Easy identification of current version

#### 2. **Role Restrictions** (Breaking Change)
- **Removed "Developer" role** from user stories
- **Enforced roles only**: User, Administrator, System
- **User** (default): For most features including model training, data operations, UI interactions
- **Administrator**: Admin-specific features (user management, permissions, system config)
- **System**: Automated backend processes (scheduled tasks, webhooks, integrations)

#### 3. **Comprehensive Definition of Done**
- **Fixed 18-item DoD checklist** included in every story
- No more placeholder text - complete and ready to use
- **Covers:**
  - ✅ Testing: Linting, unit tests, security tests, performance tests
  - ✅ CI/CD: GitLab CI configuration, regression prevention
  - ✅ Quality: Profiling, model metrics, data retention
  - ✅ Documentation: Inline comments, README, SDD, architecture
  - ✅ Standards: UAT scripts, version control, SAINS UI/UX compliance
- **Bold formatting**: `**Definition of Done:**`
- **Identical across all stories** - ensures consistency

#### 4. **Removed Clarification Section**
- No more "⚠️ CLARIFICATION NEEDED" section
- Stories are **complete and immediately usable**
- **Zero post-generation edits required**
- Ready to copy-paste directly into OpenProject

---

## 📋 Output Format (v2.0.0)

Generated user stories now follow this production-ready format:

```markdown
## USER STORY 1/X: [Title] (Category)

As a [User/Administrator/System], I want [action], so that [benefit].

**Description:**  
[Context and background information]

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
```

---

## ✨ Current Features

- **File input support**: .docx, .pdf, .html, .md, .txt
- **Drag & drop upload** and paste input
- **Automatic text extraction** from multiple file formats
- **AI-powered story generation** with category classification (Backend, Frontend, Mobile, ML)
- **Production-ready format** with comprehensive DoD
- **Role enforcement**: User/Administrator/System only
- **Local API key storage** (stored in browser)
- **Usage tracking**: Monitor daily API usage
- **Copy to clipboard**: Easy export to OpenProject
- **Regenerate option**: Get alternative story versions
- **Version display**: Know which version you're using

---

## 🚀 Getting Started

### 1. Setup
1. Open the application in your web browser
2. Click the **Settings** (⚙️) button in the header
3. Enter your **Groq API key** (get free at [console.groq.com](https://console.groq.com))
4. Click **Save API Key**

### 2. Generate User Stories

**Option A - Text Input:**
1. Type or paste your requirements in the text area
2. Click "Generate User Stories"

**Option B - File Upload:**
1. Drag & drop a file (.docx, .pdf, .html, .md, .txt)
2. Optionally add notes in the text area
3. Click "Generate User Stories"

### 3. Use Your Stories
1. Review the generated stories
2. Click "Copy to Clipboard"
3. Paste directly into OpenProject
4. Start working! 🎯

---

## 🎯 Benefits of v2.0.0

✔️ **Production-ready output** - Stories ready for immediate use  
✔️ **Zero post-processing** - No manual edits needed  
✔️ **Consistent quality** - Same DoD across all stories  
✔️ **Proper conventions** - User-facing roles only  
✔️ **Version transparency** - Clear version identification  
✔️ **Organizational alignment** - Meets all standards  

---

## 🆓 Free Tier

**Groq API Free Tier:**
- 14,400 requests/day
- Perfect for 2-10 Product Owners
- Ultra-fast generation (Llama 3.3 70B Versatile)

---

## 🛠️ Technical Stack

- **Frontend**: Pure HTML/CSS/JavaScript (no framework dependencies)
- **AI Backend**: Groq API (Llama 3.3 70B Versatile)
- **File Processing**: mammoth.js (Word), pdf.js (PDF), marked.js (Markdown)
- **Styling**: Custom CSS with modern glassmorphism design
- **Icons**: Font Awesome 6.4.0
- **Fonts**: Google Fonts (Inter)

---

## 📦 Deployment

This is a **static web application** - deploy to any static hosting:
- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages
- AWS S3 + CloudFront
- Or any web server

No backend required - all processing happens client-side!

---

## 🔄 Version History

### v2.0.0 (Current) - January 2026
- Added comprehensive Definition of Done (18 items)
- Enforced User/Administrator/System roles only
- Removed clarification section
- Added version display in UI
- Production-ready format

### v1.x
- Initial release with basic story generation
- Developer role included
- Placeholder DoD
- Clarification section

---

## 📝 License

MIT License — see LICENSE file for details.

---

## 👨‍💻 Creator

**Jazz Hong**

Built with 💡 | Powered by Groq AI | Empowering Agile Excellence

---

## 🤝 Contributing

Feel free to submit issues, feature requests, or pull requests to improve the User Story Agent!

