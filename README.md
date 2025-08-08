# AI-Powered PBN Platform

A comprehensive AI-first Private Blog Network (PBN) platform that auto-generates SEO-optimized articles with backlinks, supports external client orders, and delivers static site ZIP packages per domain for deployment.

## 🏗️ Project Architecture

```
pbn/
├── backend/                 # Node.js/Express API server
│   ├── controllers/         # API route controllers
│   ├── services/           # Business logic services
│   ├── db/                 # Database configuration (Prisma)
│   ├── routes/             # API route definitions
│   └── utils/              # Utility functions
├── frontend/               # React-based admin dashboard
│   └── blog-order/         # Main frontend application
├── astro-builds/           # Static site generation
│   ├── templates/          # Astro template repository
│   └── domains/            # Generated domain websites
└── README.md              # This file
```

## 🚀 Features Overview

### Core Features
- **AI-Powered Content Generation**: Generate SEO-optimized articles using AI models
- **Domain Management**: Create and manage multiple domains with different templates
- **Internal Link System**: Automatically insert relevant internal links in articles
- **Quality Control**: AI-driven quality checks with retry mechanisms
- **Version Management**: Maintain multiple versions of articles
- **Static Site Generation**: Build and deploy Astro-based static sites
- **Template System**: Switch between different Astro templates
- **Admin Dashboard**: Comprehensive web interface for managing the platform

### Advanced Features
- **Bulk Operations**: Create multiple domains and articles at once
- **Content Pipeline**: 8-step automated content generation process
- **File Management**: Automatic markdown file creation and management
- **Build System**: Automated domain building and ZIP generation
- **Error Handling**: Comprehensive error handling and logging
- **TypeScript Support**: Full TypeScript support in frontend

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Prisma ORM
- **AI Integration**: Google Gemini AI, OpenAI API support
- **File System**: fs-extra for file operations
- **Archiving**: archiver for ZIP file generation

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Markdown**: React Markdown with GFM support

### Static Site Generation
- **Framework**: Astro
- **Styling**: Tailwind CSS
- **Templates**: Multiple pre-built templates
- **Content**: Markdown-based content management

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone <repository-url>
cd pbn
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database and API keys

# Set up database
npx prisma generate
npx prisma migrate dev

# Start the server
npm start
```

### 3. Frontend Setup
```bash
cd frontend/blog-order

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API URL

# Start the development server
npm run dev
```

### 4. Environment Variables

#### Backend (.env)
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/pbn_db"

# AI Services
GOOGLE_AI_API_KEY="your-google-ai-key"
OPENAI_API_KEY="your-openai-key"

# Server
PORT=5000
NODE_ENV=development

# File Paths
ASTRO_BUILDS_PATH="./astro-builds"
DOMAINS_PATH="./astro-builds/domains"
TEMPLATES_PATH="./astro-builds/templates"
```

#### Frontend (.env)
```env
VITE_REACT_APP_API_URL=http://localhost:5000
VITE_REACT_APP_API_VERSION=1
```

## 🎯 Core Features Explained

### 1. AI-Powered Content Generation

The platform uses advanced AI models to generate high-quality, SEO-optimized content.

#### Features:
- **Multi-Model Support**: Google Gemini, OpenAI GPT models
- **Custom Prompts**: Support for custom user prompts
- **SEO Optimization**: Automatic SEO optimization
- **Backlink Integration**: Automatic backlink insertion
- **Content Structure**: Structured content with title, intro, body, conclusion

#### Usage:
```javascript
// Generate article with AI
const params = {
    domain_id: 'domain-id',
    niche: 'Technology',
    keyword: 'productivity',
    topic: 'Top Productivity Tools',
    internalLinks: true,
    userPrompt: 'optional custom prompt'
};
const result = await runBlogPipeline(params);
```

### 2. Domain Management System

Comprehensive domain management with template support and folder creation.

#### Features:
- **Domain CRUD**: Create, read, update, delete domains
- **Bulk Operations**: Create multiple domains at once
- **Template System**: Switch between different Astro templates
- **Folder Management**: Automatic domain folder creation
- **Status Tracking**: Track domain build status and post count

#### Available Templates:
- **MicroblogLayout**: Full-featured blog with RSS, sitemap, tags
- **MinimalLayout**: Clean, simple blog template
- **ModernLayout**: Modern design with advanced features

#### Usage:
```javascript
// Create domain
const domain = await createDomain({
    name: 'My Website',
    slug: 'my-website',
    url: 'https://mywebsite.com',
    tags: 'blog, tech, personal'
});

// Switch template
await switchDomainTemplate('my-website', 'MinimalLayout');
```

### 3. Internal Link System

Automatically insert relevant internal links in generated content.

#### Features:
- **Relevance Scoring**: Articles scored based on niche/keyword overlap
- **Smart Placement**: Links inserted in middle of sentences for natural flow
- **Random Count**: 1-2 links inserted randomly
- **Fallback Handling**: Returns original content if processing fails

#### Usage:
```javascript
// Enable internal links
const params = {
    domain_id: 'domain-id',
    internalLinks: true,
    // ... other parameters
};
```

### 4. Quality Control System

AI-driven quality checks with automatic retry mechanisms.

#### Quality Checks:
- **Word Count**: 500-3000 words
- **Frontmatter**: Required fields (title, description, tags)
- **Internal Links**: Presence check if enabled
- **AI Detection**: Avoid AI detection patterns
- **SEO Compliance**: SEO best practices

#### Retry Logic:
- **Max Attempts**: Configurable (default: 3)
- **Feedback Integration**: Uses QC recommendations for improvement
- **Automatic Regeneration**: Regenerates content if QC fails

### 5. Content Pipeline

8-step automated content generation process.

#### Pipeline Steps:
1. **AI Inference**: Extract topic, anchor text, suggested backlink
2. **Blog Generation**: Generate full-length blog content
3. **Internal Link Processing**: Insert relevant internal links
4. **Frontmatter Fixing**: Ensure proper markdown structure
5. **Quality Check**: Comprehensive validation
6. **Retry Logic**: Automatic regeneration if needed
7. **Metadata Extraction**: Extract and structure metadata
8. **Database & File Storage**: Save to database and write files

### 6. Version Management

Maintain multiple versions of articles with selection capabilities.

#### Features:
- **Version Creation**: Create new versions for each edit
- **Version Selection**: Select which version to use
- **Version History**: Track all versions with metadata
- **Content Comparison**: Compare different versions

#### Usage:
```javascript
// Create new version
const version = await createVersion(articleId, newContent);

// Set selected version
await setSelectedVersion(articleId, versionId);
```

### 7. Static Site Generation

Build and deploy Astro-based static sites.

#### Features:
- **Template System**: Multiple pre-built templates
- **Automatic Building**: npm run build for each domain
- **ZIP Generation**: Automatic ZIP file creation
- **Preview System**: Preview sites before deployment
- **Download System**: Download built sites as ZIP files

#### Usage:
```javascript
// Build domain
await buildDomain('my-website');

// Download domain
const zipPath = await downloadDomain('my-website');
```

## 🎨 Frontend Dashboard

### Features:
- **Responsive Design**: Mobile-friendly interface
- **Real-time Updates**: Live status updates
- **TypeScript Support**: Full type safety
- **Error Handling**: Comprehensive error handling
- **Loading States**: Smooth loading experiences

### Pages:
- **Dashboard**: Overview of domains and articles
- **Create Domain**: Domain creation interface
- **View Domains**: Domain management interface
- **Generate Blogs**: AI content generation
- **Edit Blogs**: Article editing interface

### Components:
- **BlogLayout**: Main layout component
- **Sidebar**: Navigation sidebar
- **BlogCreationForm**: AI content generation form
- **DomainTable**: Domain management table

## 🔌 API Endpoints

### Domain Management
- `POST /api/v1/domain/createDomain` - Create domain
- `GET /api/v1/domain/getAllDomains` - Get all domains
- `PUT /api/v1/domain/updateDomain/:id` - Update domain
- `DELETE /api/v1/domain/deleteDomain/:id` - Delete domain
- `POST /api/v1/domain/createDomainFolder` - Create domain folder
- `PUT /api/v1/domain/switchDomainTemplate` - Switch template
- `POST /api/v1/domain/buildDomain/:domainName` - Build domain

### Article Management
- `GET /api/v1/articles/getAllArticles` - Get all articles
- `GET /api/v1/articles/getArticleById/:id` - Get article by ID
- `PUT /api/v1/articles/updateArticle/:id` - Update article
- `DELETE /api/v1/articles/deleteArticle/:id` - Delete article
- `POST /api/v1/articles/setSelectedVersion/:id` - Set selected version
- `POST /api/v1/articles/publishBlog/:id` - Publish article

### AI Generation
- `POST /api/v1/ai/generateArticle` - Generate article with AI
- `POST /api/v1/ai/runQC` - Run quality check
- `POST /api/v1/ai/regenerateContent` - Regenerate content

## 🗄️ Database Schema

### Core Tables:
- **domains**: Domain information and configuration
- **articles**: Article metadata and status
- **article_versions**: Article content versions
- **users**: User management (future)

### Key Relationships:
- Domain → Articles (One-to-Many)
- Article → ArticleVersions (One-to-Many)
- Article → SelectedVersion (One-to-One)

## 🚀 Deployment

### Development
```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend/blog-order
npm run dev
```

### Production
```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend/blog-order
npm run build
# Serve the dist folder
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend/blog-order
npm test
```

### Manual Testing
1. Create a domain using the frontend
2. Generate content using AI
3. Check quality control results
4. Publish content to domain
5. Build and download domain

## 📊 Monitoring & Logging

### Logging Features:
- **Step-by-step Progress**: Pipeline progress logging
- **Error Tracking**: Detailed error context
- **Performance Metrics**: Timing and attempt tracking
- **QC Logging**: Quality check results and recommendations

### Debug Mode:
```bash
DEBUG=pipeline:*
```

## 🔧 Configuration

### Template Configuration
Templates are configured in `astro-builds/templates/template-config.json`:
```json
{
  "templates": {
    "microblog-main": {
      "name": "Microblog Main",
      "description": "Full-featured microblog",
      "features": ["RSS", "Sitemap", "Tags"],
      "category": "blog",
      "defaultLayout": "BaseLayout"
    }
  }
}
```

### Pipeline Configuration
Pipeline settings can be configured in the backend:
- Max retry attempts
- Quality check thresholds
- Content generation parameters

## 🐛 Troubleshooting

### Common Issues:

1. **Database Connection**:
   - Check DATABASE_URL in .env
   - Ensure PostgreSQL is running
   - Run `npx prisma migrate dev`

2. **AI Generation Fails**:
   - Check API keys in .env
   - Verify AI service connectivity
   - Check content generation parameters

3. **Domain Building Fails**:
   - Check domain folder exists
   - Verify npm dependencies
   - Check file permissions

4. **Frontend Issues**:
   - Check API URL in .env
   - Verify backend is running
   - Check browser console for errors

### Debug Commands:
```bash
# Check database status
npx prisma studio

# Check domain status
curl http://localhost:5000/api/v1/domain/getDomainStatus/my-website

# Test AI generation
curl -X POST http://localhost:5000/api/v1/ai/generateArticle \
  -H "Content-Type: application/json" \
  -d '{"domain_id":"test","niche":"Technology","keyword":"test"}'
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request


## 🆘 Support

For support and questions:
- Check the documentation in each component
- Review the API documentation
- Check the troubleshooting section
- Open an issue on GitHub

## 🔄 Future Enhancements

### Planned Features:
1. **Advanced NLP**: Better relevance scoring for internal links
2. **Link Analytics**: Track internal link performance
3. **Bulk Operations**: Generate multiple articles with internal linking
4. **Template System**: Pre-defined internal link strategies
5. **A/B Testing**: Compare internal link placement strategies
6. **Payment Integration**: Stripe/PayPal integration
7. **User Management**: Multi-user support
8. **Advanced Analytics**: Content performance tracking

### Performance Optimizations:
1. **Caching**: Cache relevant articles for faster processing
2. **Batch Processing**: Process multiple articles simultaneously
3. **Async Operations**: Parallel processing where possible
4. **CDN Integration**: Content delivery network support

---

This platform provides a robust, scalable solution for AI-powered content generation and static site management. The modular architecture allows for easy extension and customization while maintaining high performance and reliability.
