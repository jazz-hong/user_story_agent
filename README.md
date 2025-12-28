# 🚀 User Story Agent - AI-Powered Agile Story Generator

> **Transform complex requirements into professional Agile User Stories in seconds with TRUE AI!**

Built by **Jazz Hong** | Powered by Groq AI (Llama 3.3 70B Versatile)

A powerful web-based tool designed specifically for Product Owners to automatically generate well-structured, Agile-compliant user stories from meeting minutes, bullet points, or any raw requirement input.

---

## 🤖 **POWERED BY GROQ AI** ⚡

**Your agent uses REAL AI intelligence - Ultra-fast, Free, and Powerful!**

✅ **Truly understands documents** - Real AI comprehension using Llama 3.3 70B  
✅ **Intelligently reads tables** - Extracts clean content from complex documents  
✅ **Generates like an expert** - Professional stories every time  
✅ **FREE Tier** - 14,400 requests/day (perfect for 2-10 Product Owners!)  
✅ **Ultra-Fast** - Fastest LLM inference in the world  
✅ **Works Everywhere** - Any browser, any device  

**[🚀 Setup in 30 Seconds](GROQ-SETUP-GUIDE.md)** | **[⚙️ Get Free API Key](https://console.groq.com)**

---

## 📁 **File Upload Feature**

**Just drag & drop your meeting minutes files!**
- 📄 Word Documents (.docx)
- 🌐 HTML Files (.html) - Perfect for your HTML meeting notes!
- 📝 Markdown (.md)
- 📑 PDF Files (.pdf)
- 📃 Text Files (.txt)

**AI-Powered:** Upload any file → AI reads and understands → Clean professional story generated! ✨

---

## 🚀 **Quick Start (2 Minutes)**

### **Step 1: Get Your Free Groq API Key (30 seconds)**
1. Visit [console.groq.com](https://console.groq.com)
2. Sign up (free - no credit card needed)
3. Create API key (starts with `gsk_`)
4. Copy the key

### **Step 2: Configure the Agent (30 seconds)**
1. Open the User Story Agent website
2. Click ⚙️ Settings (top-right)
3. Paste your API key
4. Click "Save API Key"
5. See green "AI Connected" ✅

### **Step 3: Generate Stories (1 minute)**
1. Upload your meeting notes file **OR** paste text
2. Click "Generate User Stories"
3. Review the output (clean, professional stories!)
4. Copy to OpenProject

**Done! Save 25-30 minutes per story!** 🎉

📖 **[Detailed Setup Guide](GROQ-SETUP-GUIDE.md)** - Complete walkthrough with screenshots

---

## ✨ Features

### 🤖 **AI-Powered Intelligence**
- **Real AI Understanding**: Uses Groq's Llama 3.3 70B Versatile model for true comprehension
- **Smart Document Analysis**: Reads and understands Word, PDF, HTML, Markdown files
- **Intelligent Table Parsing**: Extracts meaningful content from complex tables
- **Context-Aware Generation**: Understands business context and technical requirements
- **Professional Output**: Generates stories that match senior BA quality

### 📁 **File Upload & Processing**
- **Multiple Formats**: .docx, .html, .md, .pdf, .txt
- **Drag & Drop**: Simply drag files onto the page
- **Smart Extraction**: Automatically extracts text from any format
- **Table Detection**: Identifies and processes tabular data intelligently

### 🎯 **Story Generation**
- **Proper Format**: Follows "As a [role], I want to [action], So that [benefit]"
- **Acceptance Criteria**: Generates 3-7 clear, testable checklist items
- **Clarification Flagging**: Identifies ambiguities with specific questions
- **Story Splitting**: Automatically suggests when to split complex requirements
- **Standard Roles**: Uses Developer, User, Administrator, System roles
- **OpenProject Ready**: Output formatted for direct copy-paste

### 🛠️ **Technical Features**
- **API Key Management**: Secure local storage of your Groq API key
- **Usage Tracking**: Monitor your daily API usage (14,400 free requests/day)
- **Auto-Save**: Input and stories saved to browser localStorage
- **Responsive Design**: Works on desktop, tablet, mobile
- **Privacy-First**: API key never leaves your browser
- **Fast Generation**: 5-10 seconds per story (Groq is ultra-fast!)

---

## 🎨 Currently Completed Features

✅ **File Upload & Processing**
   - Drag & drop file upload
   - Multi-format support (Word, HTML, PDF, Markdown, Text)
   - Automatic text extraction
   - File validation and error handling
   - Visual file information display

✅ **User Story Generation Engine**
   - Single story generation for focused requirements
   - Multiple story generation with automatic splitting
   - Intelligent complexity assessment

✅ **Professional UI/UX**
   - Clean, modern interface with gradient design
   - Drag & drop upload zone
   - Real-time character counting
   - Loading states and animations
   - Toast notifications for user feedback
   - Collapsible instructions panel

✅ **Smart Analysis**
   - Feature extraction from raw text
   - Role detection based on context
   - Complexity scoring algorithm
   - Action and benefit inference

✅ **Output Formatting**
   - OpenProject-ready structure
   - Clear separation of clarifications (for PO review only)
   - Definition of Done (DoD) placeholder section
   - Numbered stories when splitting required

---

## 📋 Functional Entry Points

### **Main Page: `index.html`**
- **Input Area**: Paste your requirements, meeting minutes, or feature ideas
- **Generate Button**: Click to analyze and generate user stories
- **Output Display**: View formatted stories ready for OpenProject
- **Copy to Clipboard**: One-click copy functionality

### **Table Converter: `table-converter.html`** ⭐ NEW!
- **Table Input**: Paste Word tables (status tracking, issue lists, etc.)
- **Auto-Convert**: Transforms each table row into story-ready format
- **Individual Copy**: Copy tasks one-by-one for the User Story Agent
- **Perfect for**: Meeting minutes tables, issue tracking exports, status reports

### **Keyboard Shortcuts**
- `Ctrl/Cmd + Enter`: Generate stories from input area

---

## 🚀 How to Use

### **🎯 Method 1: Upload Files (RECOMMENDED!)** ⭐

**The easiest way - Just upload your meeting minutes file!**

1. Open `index.html` in your browser
2. **Drag & drop** your file onto the upload zone, OR click to browse
3. Supported formats:
   - 📄 Word documents (.docx) - Your meeting minutes from Word
   - 🌐 HTML files (.html) - Your HTML meeting notes
   - 📝 Markdown (.md)
   - 📑 PDF files (.pdf)
   - 📃 Text files (.txt)
4. File is automatically processed and text extracted
5. Click **"Generate User Stories"**
6. Done! ✨

**Perfect for:**
- Weekly meeting minutes saved in Word
- HTML-formatted notes
- Exported project documents
- Any documented requirements

---

### **📋 Method 2: For Word Tables / Status Tracking Tables**

**Use the Table Converter for tabular data:**

1. Open `table-converter.html`
2. Copy your entire Word table
3. Paste it into the converter
4. Click "Convert to Story Format"
5. Copy each task individually
6. Paste into the main User Story Agent (`index.html`)

**Example Word Table:**
```
No   Module          Issue/Task           Current Status        Status
1    Phase 2 App     Upload Issue         Only works on SSO     Pending
2    Portal          Login Problem        Users can't login     In Progress
```

**Converts to:**
```
Phase 2 App - Upload Issue

Module/Phase: Phase 2 App
Issue/Task: Upload Issue
Current Situation:
- Only works on SSO DC
- Production points to SSO only
Requirements:
- Fix upload on all environments
...
```

---

### **✍️ Method 3: Manual Text Input**

### **Step 1: Input Requirements**
Paste your requirements in any format:

```
Example Input:

- Need a dashboard for admins to view user analytics
- Should show active users, registration trends over time
- Export data to CSV format
- Real-time updates preferred
- Filter by date range
```

### **Step 2: Generate Stories**
Click the **"Generate User Stories"** button. The agent will:
1. Analyze the complexity and features
2. Determine if splitting is needed
3. Generate properly formatted user stories
4. Flag any clarifications needed

### **Step 3: Review Output**
Check the generated story:

```
═══════════════════════════════════════
USER STORY: Admin Analytics Dashboard
═══════════════════════════════════════

📖 Story Statement:
As an Administrator, I want to view user analytics on a dashboard, so that I can monitor and analyze key metrics effectively

📝 Description:
Context:
- Need a dashboard for admins to view user analytics
- Should show active users, registration trends over time
- Export data to CSV format

Requirements:
- Real-time updates preferred
- Filter by date range

✅ Acceptance Criteria:
☐ System displays all required information accurately
☐ Dashboard shows active users count
☐ Registration trends are displayed over time
☐ User can successfully export data in CSV format
☐ Real-time updates work as expected
☐ Date range filter functions correctly
☐ Error handling is implemented for edge cases

✔️ Definition of Done (DoD):
[Paste your standard DoD here]

⚠️ CLARIFICATION NEEDED (For PO Review - Remove before adding to OpenProject):
• What specific metrics/data points must be displayed? Are there any additional filters needed?
• What is the acceptable latency/update frequency for real-time updates?
• What is the expected user interface flow? Any specific UI/UX requirements?

═══════════════════════════════════════
```

### **Step 4: Handle Clarifications**
1. Review the **⚠️ CLARIFICATION NEEDED** section
2. Consult with your supervisor/team
3. Get answers to the questions
4. Come back and regenerate with more detailed input

### **Step 5: Finalize & Copy**
1. **Remove** the clarification section (it's for PO review only)
2. **Paste** your project's standard Definition of Done
3. **Copy** the final story to clipboard
4. **Paste** into OpenProject

---

## 📊 Story Output Structure

Every generated story follows this consistent format:

```
═══════════════════════════════════════
USER STORY: [Brief, Descriptive Title]
═══════════════════════════════════════

📖 Story Statement:
As a [role], I want to [action], so that [benefit]

📝 Description:
[Detailed context and specific requirements]

✅ Acceptance Criteria:
☐ [Criterion 1]
☐ [Criterion 2]
☐ [Criterion N]

✔️ Definition of Done (DoD):
[Paste your standard DoD here]

⚠️ CLARIFICATION NEEDED (For PO Review - Remove before adding to OpenProject):
• [Question 1]
• [Question 2]

═══════════════════════════════════════
```

---

## 🔄 Multiple Story Splitting

When the agent detects complexity, it automatically splits into multiple stories:

```
╔═══════════════════════════════════════════════════════════════╗
║           MULTIPLE STORIES DETECTED & GENERATED               ║
╚═══════════════════════════════════════════════════════════════╝

📦 Epic/Feature: [Base Feature Name]

This requirement has been split into 3 related user stories:

───────────────────────────────────────────────────────────────

>>> STORY 1/3: [Feature Name] - Dashboard

[Full Story 1 Details...]

>>> STORY 2/3: [Feature Name] - Export Functionality

[Full Story 2 Details...]

>>> STORY 3/3: [Feature Name] - Real-time Updates

[Full Story 3 Details...]
```

---

## 💡 Best Practices

### **For Better Results:**

1. **Be Specific**: Include as many details as possible in your input
2. **Use Structure**: Bullet points help the agent identify distinct requirements
3. **Include Context**: Mention the user type, environment, or business goal
4. **Technical Details**: Add any known technical constraints or preferences

### **Example of Good Input:**
```
Admin User Management Module

- Administrators need ability to create, edit, and delete user accounts
- Must include email validation and password strength requirements
- Should send welcome email upon account creation
- Bulk user import from CSV file
- Audit log for all user management actions
- Role-based permissions (Admin, Manager, Viewer)
```

### **What Makes Input "Good":**
✅ Clear feature/module name
✅ Multiple specific requirements
✅ Technical details mentioned
✅ User roles identified
✅ Expected behaviors described

---

## ⚙️ Agent Intelligence Features

### **Automatic Detection:**
- **Role Inference**: Identifies if requirements are for Developer, User, Administrator, or System
- **Feature Extraction**: Recognizes keywords like dashboard, export, notification, search, etc.
- **Complexity Assessment**: Scores requirements as low/medium/high complexity
- **Split Recommendations**: Suggests when requirements should be multiple stories

### **Built-in Knowledge:**
The agent understands common patterns:
- Dashboard/Analytics features
- Export/Import functionality
- Search and Filter capabilities
- Notification systems
- Authentication/Authorization
- Form validation
- Real-time updates
- API integrations

---

## 🎯 Features NOT Yet Implemented

⏳ **Planned Enhancements:**
- [ ] Template customization (customize output format)
- [ ] Story templates library (pre-built templates for common features)
- [ ] Export to multiple formats (Markdown, JSON, JIRA format)
- [ ] Story versioning (track changes over regenerations)
- [ ] Collaboration features (share stories with team members)
- [ ] Integration with project management tools (direct API push)
- [ ] AI-powered suggestion improvements
- [ ] Multi-language support
- [ ] Story quality scoring
- [ ] Historical analysis of generated stories

---

## 🛠️ Recommended Next Steps

### **For Immediate Use:**
1. ✅ Start using the tool with your real meeting minutes
2. ✅ Build a library of your most common DoD templates
3. ✅ Share with other POs in your organization
4. ✅ Gather feedback for improvements

### **For Enhancement:**
1. 📝 Collect edge cases where the agent needs improvement
2. 🔄 Iterate on prompt engineering for better outputs
3. 🎨 Customize the UI to match your company branding
4. 📊 Track time savings and productivity improvements
5. 🤝 Request features based on team needs

---

## 📁 Project Structure

```
user-story-agent/
├── 🎯 MAIN APPLICATION
│   ├── index.html              # Main User Story Agent with Groq AI
│   └── table-converter.html    # (Legacy - may be removed)
│
├── 📚 DOCUMENTATION
│   ├── README.md               # This file - complete documentation
│   ├── GROQ-SETUP-GUIDE.md     # 🌟 START HERE - Setup in 30 seconds
│   ├── WORKFLOW-GUIDE.md       # Real-world usage workflows
│   ├── FEATURES.md             # Complete feature list
│   ├── HOW-IT-WORKS.md         # Technology explanation
│   ├── GET-STARTED.md          # Quick start guide
│   └── CHANGELOG.md            # Version history
│
├── 🎨 STYLES
│   └── css/
│       └── style.css           # Complete styling with modal & settings
│
└── 💻 JAVASCRIPT
    └── js/
        ├── groq-ai.js          # 🌟 Groq API integration
        ├── file-processor.js   # File upload & text extraction
        ├── agent.js            # (Legacy - may not be used)
        └── main.js             # Main application logic
```

---

## 🎓 Understanding the Output

### **Story Statement Components:**

**"As a [role]"**
- Standard roles: Developer, User, Administrator, System
- Agent automatically infers from context

**"I want to [action]"**
- Extracted from your requirements
- Focused on the main capability needed

**"So that [benefit]"**
- Business value or user benefit
- Inferred or extracted from "so that" phrases in input

### **Acceptance Criteria:**

- ✅ Checklist format (not Gherkin - simpler for developers)
- ✅ Flexible count based on complexity
- ✅ Includes standard criteria like error handling
- ✅ Feature-specific criteria based on keywords

### **Clarification Section:**

- ⚠️ Only for PO review - NOT for developers
- ⚠️ Must be removed before pasting to OpenProject
- ⚠️ Contains specific questions to ask supervisor
- ⚠️ Prevents sprint misdirection

---

## 🔒 Data Privacy & Security

**Your data stays secure!**
- ✅ **API Key Storage**: Stored locally in your browser (localStorage), never sent to any server except Groq
- ✅ **Meeting Notes**: Sent to Groq API over HTTPS for AI processing
- ✅ **No Training**: According to Groq's policy, your data is NOT used for model training
- ✅ **No Tracking**: We don't track your usage or collect analytics
- ✅ **Full Control**: Clear your API key anytime from Settings

**Groq API Privacy:**
- Industry-standard HTTPS encryption
- SOC 2 Type II compliant
- Data processed and discarded (not stored permanently)
- Read more: [Groq Privacy Policy](https://groq.com/privacy-policy/)

---

## 💰 Cost & Usage

### **FREE Tier (Perfect for Small Teams)**
- **14,400 requests per day**
- **Resets daily at midnight UTC**
- **No credit card required**
- **No expiration**

### **Usage for 2 Product Owners:**
- Average: 20 stories/day per PO = 40 requests/day
- **That's only 0.28% of your daily limit!** 🎯
- You'll NEVER hit the free limit with normal usage

### **If You Need More:**
- Upgrade to paid tier: **$0.27 per million tokens**
- Extremely cheap even for large teams
- [Groq Pricing Details](https://groq.com/pricing/)

---

## 💻 Technical Stack

- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **AI Engine**: Groq API with Llama 3.3 70B Versatile model
- **File Processing Libraries**:
  - Mammoth.js - Word document (.docx) processing
  - PDF.js - PDF text extraction
  - Marked.js - Markdown parsing
  - Native HTML parsing for HTML files
- **Icons**: Font Awesome 6.4.0
- **Fonts**: Google Fonts (Inter)
- **Storage**: Browser localStorage API
- **Compatibility**: All modern browsers (Chrome, Firefox, Safari, Edge)

---

## 🤝 Support & Feedback

### **Getting Help:**
- Review the "How to Use This Agent" panel in the application
- Check this README for detailed documentation
- Test with simple examples first

### **Providing Feedback:**
Share your experience:
- What works well?
- What could be improved?
- What features are missing?
- Any bugs or issues encountered?

---

## 📝 Example Scenarios

### **Scenario 1: Simple Feature**

**Input:**
```
User login page needed
Username and password fields
Remember me checkbox
Forgot password link
```

**Output:** Single focused user story

---

### **Scenario 2: Complex Feature (Auto-Split)**

**Input:**
```
Complete e-commerce checkout system
- Shopping cart management
- Payment gateway integration (Stripe)
- Order confirmation email
- Inventory deduction
- Shipping address validation
- Tax calculation
- Discount code application
- Order history tracking
```

**Output:** Multiple stories (likely 3-4), each focusing on one aspect

---

## 🌟 Success Metrics

Track your productivity improvements:
- ⏱️ **Time Saved**: Compare story writing time before/after
- 📊 **Story Quality**: Measure acceptance rate by team
- 🔄 **Iteration Reduction**: Fewer story rewrites needed
- 💬 **Clarity Improvements**: Less clarification needed during sprint planning

---

## 📜 Version History

### **v2.0.0** (Current) - **AI-Powered with Groq** 🤖
- ✅ **TRUE AI Integration**: Groq API with Llama 3.3 70B Versatile
- ✅ **Smart Document Understanding**: Real AI comprehension
- ✅ **Intelligent Table Parsing**: Extracts clean content from complex tables
- ✅ **API Key Management**: Secure settings panel
- ✅ **Usage Tracking**: Monitor daily API usage
- ✅ **Ultra-Fast Generation**: 5-10 seconds per story
- ✅ **Professional Quality**: Senior BA-level output

### **v1.0.0** - Initial Release
- ✅ File upload support (Word, PDF, HTML, Markdown, Text)
- ✅ Rule-based story generation
- ✅ Smart splitting algorithm
- ✅ Professional UI with animations
- ✅ Copy-paste functionality
- ✅ Local storage persistence

---

## 🎉 Credits & Acknowledgments

**Created by:** Jazz Hong  
**AI Model:** Groq (Llama 3.3 70B Versatile)  
**Purpose:** Empowering Product Owners with AI-powered story generation

Built with ❤️ for Product Owners who want to:
- Save time on story writing (70-80% faster!)
- Maintain consistency across stories
- Focus on strategy over documentation
- Empower their teams with clear requirements

---

## 📞 Quick Reference

| Action | Method |
|--------|--------|
| **Setup API Key** | Click ⚙️ Settings → Paste key → Save |
| **Generate Stories** | Click "Generate" or `Ctrl/Cmd + Enter` |
| **Upload File** | Drag & drop or click upload zone |
| **Copy Output** | Click "Copy to Clipboard" button |
| **Clear Input** | Click "Clear" button |
| **Regenerate** | Click "Regenerate" after reviewing |
| **Check Usage** | Click ⚙️ Settings → View usage stats |
| **Remove API Key** | Click ⚙️ Settings → "Clear API Key" |

---

**🚀 Ready to transform your requirements into professional user stories?**

### **First Time User:**
1. Read [GROQ-SETUP-GUIDE.md](GROQ-SETUP-GUIDE.md) (takes 2 minutes)
2. Get your free API key from [console.groq.com](https://console.groq.com)
3. Open `index.html` in your browser
4. Configure your API key in Settings
5. Start generating stories!

### **Returning User:**
- Just open `index.html` and start working
- Your API key is already saved
- Upload files or paste requirements
- Generate professional stories in seconds

---

**Built by Jazz Hong** | Powered by Groq AI | Manifesting Agile Excellence ✨🤖

© 2024 Jazz Hong. All rights reserved.

