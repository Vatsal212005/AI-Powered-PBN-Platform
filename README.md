# Blog Generation Features

## Overview

This document describes the enhanced blog generation system with internal link support and a comprehensive pipeline for AI-powered content creation.

## 🧩 Task 1: Internal Link Toggle Logic

### Frontend Implementation

The internal link toggle has been added to the blog generation form in `GenBlogs.tsx`:

- **Toggle Location**: Between the "Use Custom Prompt" toggle and the main form
- **Visual Design**: Green toggle when enabled, gray when disabled
- **State Management**: Uses `internalLinksEnabled` state variable
- **Form Integration**: Automatically included in form submission

### Backend Implementation

#### Database Schema
- Added `internal_links` boolean field to the `Article` model
- Default value: `false`
- Migration required: `add_internal_links_flag`

#### Internal Links Service (`internalLinksService.js`)
- **`getRelevantArticles(domainId, currentTopic, limit)`**: Fetches relevant articles from the same domain
- **`insertInternalLinks(content, relevantArticles, numLinks)`**: Inserts 1-2 internal links into blog content
- **`processInternalLinks(content, domainId, currentTopic, enableInternalLinks)`**: Main processing function

#### Key Features:
- **Relevance Scoring**: Articles scored based on niche/keyword overlap
- **Smart Placement**: Links inserted in middle of sentences for natural flow
- **Random Count**: 1-2 links inserted randomly
- **Fallback Handling**: Returns original content if processing fails

### Integration Points

1. **AI Service**: Modified `generateMarkdown()` to process internal links after generation
2. **Core Services**: Updated to pass `internalLinks` and `domainId` parameters
3. **Controllers**: Updated to handle the new parameter in API requests

## 🚀 Task 2: Blog Generation Pipeline

### Pipeline Architecture

The new pipeline (`pipelineService.js`) implements a comprehensive 8-step process:

#### Step 1: AI Inference
- **Purpose**: Extract topic, anchor text, and suggested backlink from custom prompts
- **Function**: `inferFromPrompt(userPrompt, params)`
- **Fallback**: Uses provided parameters if inference fails

#### Step 2: Blog Generation
- **Purpose**: Generate full-length blog content using AI
- **Function**: `generateMarkdown()` with enhanced parameters
- **Features**: Structured response with title, intro, body, conclusion

#### Step 3: Internal Link Processing
- **Purpose**: Insert relevant internal links if enabled
- **Function**: `processInternalLinks()`
- **Logic**: Only processes if `internalLinks` is true and `domainId` is provided

#### Step 4: Frontmatter Fixing
- **Purpose**: Ensure proper markdown frontmatter structure
- **Function**: `fixFrontmatterStructure()`

#### Step 5: Quality Check
- **Purpose**: Comprehensive validation of generated content
- **Function**: `performQualityCheck()`
- **Checks**:
  - Word count (500-3000 words)
  - Required frontmatter fields (title, description, tags)
  - Internal link presence (if enabled)
  - AI detection avoidance
  - SEO compliance

#### Step 6: Retry Logic
- **Purpose**: Automatic regeneration if QC fails
- **Max Attempts**: Configurable (default: 3)
- **Feedback Integration**: Uses QC recommendations for improvement

#### Step 7: Metadata Extraction
- **Purpose**: Extract and structure article metadata
- **Function**: `extractMetadata()`
- **Data**: Title, description, slug, tags, author, pubDate, wordCount, internalLinksCount

#### Step 8: Database & File Storage
- **Purpose**: Save to database and write to Astro files
- **Database**: Creates article and version records
- **File System**: Writes to `src/content/posts/` directory

### Quality Check Enhancements

#### Custom Checks Added:
```javascript
const customChecks = {
    wordCount: content.split(/\s+/).length,
    hasTitle: content.includes('title:'),
    hasDescription: content.includes('description:'),
    hasTags: content.includes('tags:'),
    hasInternalLinks: params.internalLinks ? content.includes('(/posts/') : true,
    minWordCount: 500,
    maxWordCount: 3000
};
```

#### QC Integration:
- Combines AI-based QC with custom checks
- Provides detailed feedback for retry logic
- Logs issues and recommendations

## 📝 Editor Integration

### New Services (`editorService.js`)

#### Functions:
- **`updateArticleContent(articleId, newContent, options)`**: Updates both DB and Astro files
- **`updateAstroFile(domainSlug, articleSlug, content)`**: Updates markdown files
- **`publishArticle(articleId)`**: Publishes article to Astro
- **`getArticleForEditing(articleId)`**: Retrieves article for editing

#### Features:
- **Dual Updates**: Changes saved to both database and Astro files
- **Version Control**: Creates new versions for each edit
- **Status Tracking**: Maintains article status (draft/published)
- **Error Handling**: Graceful fallback if file operations fail

### New API Endpoints

```
GET /api/v1/articles/getForEditing/:id
PUT /api/v1/articles/updateContent/:id
```

## 🎯 Frontend Enhancements

### New UI Components

#### Metadata Display:
- Shows extracted metadata (title, slug, word count, internal links)
- Displays tags and description
- Real-time updates after generation

#### File Information:
- Shows file write status
- Displays file path and name
- Error reporting for failed writes

#### Enhanced Response Handling:
- Handles new response format with metadata
- Displays pipeline results
- Shows QC status and attempts

## 🔧 Configuration

### Environment Variables Required:
```bash
DATABASE_URL=postgresql://...
# Other existing variables
```

### Database Migration:
```bash
cd pbn/backend
npx prisma migrate dev --name add_internal_links_flag
```

## 🧪 Testing

### Test Script:
```bash
cd pbn/backend
node test-pipeline.js
```

### Manual Testing:
1. Enable internal links toggle
2. Generate blog with domain selected
3. Verify internal links appear in content
4. Check metadata and file information
5. Test editor functionality

## 📊 Monitoring & Logging

### Pipeline Logging:
- Step-by-step progress logging
- Error tracking with context
- Performance metrics (attempts, timing)

### QC Logging:
- Detailed issue reporting
- Recommendation tracking
- Success/failure rates

## 🚀 Usage Examples

### Basic Blog Generation:
```javascript
const params = {
    domain_id: 'domain-id',
    niche: 'Technology',
    keyword: 'productivity',
    topic: 'Top Productivity Tools',
    internalLinks: true
};
const result = await runBlogPipeline(params);
```

### Custom Prompt with Internal Links:
```javascript
const params = {
    domain_id: 'domain-id',
    userPrompt: 'Write about AI in healthcare',
    internalLinks: true
};
const result = await runBlogPipeline(params);
```

## 🔄 Future Enhancements

### Planned Features:
1. **Advanced NLP**: Better relevance scoring for internal links
2. **Link Analytics**: Track internal link performance
3. **Bulk Operations**: Generate multiple articles with internal linking
4. **Template System**: Pre-defined internal link strategies
5. **A/B Testing**: Compare internal link placement strategies

### Performance Optimizations:
1. **Caching**: Cache relevant articles for faster internal link processing
2. **Batch Processing**: Process multiple articles simultaneously
3. **Async Operations**: Parallel processing where possible

## 🐛 Troubleshooting

### Common Issues:

1. **Internal Links Not Appearing**:
   - Check if domain has other articles
   - Verify `internalLinks` flag is true
   - Check console for relevance scoring logs

2. **QC Failures**:
   - Review QC feedback in logs
   - Check word count requirements
   - Verify frontmatter structure

3. **File Write Errors**:
   - Check domain folder exists
   - Verify file permissions
   - Check disk space

### Debug Mode:
Enable detailed logging by setting environment variable:
```bash
DEBUG=pipeline:*
```

## 📚 API Reference

### Generate Article:
```http
POST /api/v1/ai/generateArticle
Content-Type: application/json

{
    "domain_id": "uuid",
    "niche": "Technology",
    "keyword": "productivity",
    "topic": "Top Tools",
    "internalLinks": true,
    "userPrompt": "optional custom prompt"
}
```

### Update Content:
```http
PUT /api/v1/articles/updateContent/:id
Content-Type: application/json

{
    "content": "updated markdown content"
}
```
