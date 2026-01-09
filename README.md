# User Story Agent

**Version:** v2.1.0 🚀  
**Creator:** Jazz Hong  
**License:** MIT License

---

## 📖 What is This?

A lightweight web tool that transforms meeting notes or raw requirements into **production-ready Agile user stories** using AI (Groq AI - Llama 3.3 70B).

**Input:** Meeting notes, bullet points, or feature ideas  
**Output:** Professional user stories with acceptance criteria and comprehensive Definition of Done

---

## ✨ Key Features

- 📁 **Multiple file formats**: .docx, .pdf, .html, .md, .txt
- 🎯 **Drag & drop** or paste text input
- 🤖 **AI-powered generation** with category classification (Backend, Frontend, Mobile, ML)
- ✅ **Production-ready** with 18-item Definition of Done checklist
- 👥 **Role enforcement**: User/Administrator/System only
- 📊 **Usage tracking**: Monitor daily API usage
- 📋 **Copy to clipboard**: Direct export to OpenProject
- 🔄 **Regenerate**: Get alternative versions
- 🆓 **Free tier**: 14,400 requests/day

---

## 🚀 Quick Start

### 1️⃣ Setup API Key
1. Open the app in your browser
2. Click **Settings** (⚙️) button
3. Get free API key at [console.groq.com](https://console.groq.com)
4. Save API key

### 2️⃣ Generate Stories
- **Option A**: Type/paste requirements in text area
- **Option B**: Drag & drop a file + optional notes

### 3️⃣ Use Your Stories
1. Review generated stories
2. Copy to clipboard
3. Paste into OpenProject
4. Done! 🎯

---

## 📋 Output Format

```markdown
## USER STORY 1/X: [Title] (Category)

As a [User/Administrator/System], I want [action], so that [benefit].

**Description:**  
[Context and background]

**Acceptance Criteria:**
*   [ ] [Testable criterion]
*   [ ] [Another criterion]

**Definition of Done:**
*   [ ] All linting issues resolved
*   [ ] All unit tests passed
*   [ ] All security tests passed
*   [ ] All performance tests passed
*   [ ] GitLab CI configured
*   [ ] Regression tests for bugs
*   [ ] Profiling completed
*   [ ] Model metrics recorded
*   [ ] Data retention configured
*   [ ] Documentation updated (inline, README)
*   [ ] Software Design Document updated
*   [ ] Software Architecture Design updated
*   [ ] UAT script completed
*   [ ] Version controlled
*   [ ] UI/UX meets SAINS standards
```

---

## 🛠️ Technical Stack

| Component | Technology |
|-----------|-----------|
| Frontend | Pure HTML/CSS/JavaScript |
| AI Engine | Groq API (Llama 3.3 70B) |
| File Processing | mammoth.js, pdf.js, marked.js |
| Styling | Custom CSS (glassmorphism) |
| Icons | Font Awesome 6.4.0 |

---

## 📦 Deployment

**Static web app** - no backend needed! Deploy to:
- GitHub Pages
- Netlify / Vercel
- Cloudflare Pages
- AWS S3 + CloudFront

All processing happens client-side in the browser.

---

## 🔄 Version History

**v2.1.0** (Current) - January 2026
- Streamlined instructions panel (removed outdated step)
- Cleaner user guidance

**v2.0.0** - January 2026
- Comprehensive 18-item Definition of Done
- Role enforcement (User/Administrator/System only)
- Removed clarification section
- Production-ready format

**v1.x** - Initial Release
- Basic story generation
- Placeholder DoD

---

## 🎯 Benefits

✔️ **Zero manual edits** - Production-ready output  
✔️ **Consistent quality** - Same DoD across all stories  
✔️ **Fast generation** - Ultra-fast AI processing  
✔️ **Free to use** - Generous free tier  
✔️ **No backend** - Deploy anywhere  

---

## 📝 License

MIT License

---

## 👨‍💻 Creator

**Jazz Hong**

Built with 💡 | Powered by Groq AI | Empowering Agile Excellence

---

## 🤝 Contributing

Issues, feature requests, and pull requests welcome!
