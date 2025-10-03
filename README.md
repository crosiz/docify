# AKOP - AI-Powered Knowledge Management System

AKOP is a comprehensive AI-powered knowledge management system that helps employees find answers from internal documents and emails instantly using advanced AI technology.

## 🚀 Features

### Core Functionality
- **Document Upload & Processing**: Upload PDFs, Word documents, and CSV files with drag-and-drop interface
- **AI-Powered Search**: Semantic search across all documents and emails using OpenAI embeddings
- **Intelligent Q&A**: Get instant AI-generated answers from your knowledge base
- **Email Integration**: Connect and search through your email inbox
- **Real-time Processing**: Automatic text extraction and embedding generation

### User Interface
- **Modern Dashboard**: Clean, professional interface with real-time statistics
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark/Light Mode**: Automatic theme switching based on system preferences
- **Settings Management**: Configurable file size limits, AI response length, and more

## 🛠️ How It Works

### 1. Document Processing Pipeline
\`\`\`
Upload File → Extract Text → Generate Embeddings → Store in Vector Database → Ready for Search
\`\`\`

1. **File Upload**: Users drag and drop files (PDF, DOCX, CSV) up to 50MB
2. **Text Extraction**: System extracts text content from uploaded documents
3. **Embedding Generation**: OpenAI's `text-embedding-3-small` model creates vector embeddings
4. **Indexing**: Embeddings are stored for fast semantic search

### 2. AI Search & Q&A System
\`\`\`
User Query → Generate Query Embedding → Vector Similarity Search → Retrieve Relevant Docs → AI Answer Generation
\`\`\`

1. **Query Processing**: User's search query is converted to embeddings
2. **Semantic Search**: System finds most relevant documents using cosine similarity
3. **Context Assembly**: Top matching documents provide context for AI
4. **Answer Generation**: OpenAI GPT-4o-mini generates contextual answers

### 3. Email Integration
\`\`\`
Connect Email → Sync Messages → Extract Content → Generate Embeddings → Include in Search
\`\`\`

1. **Email Connection**: OAuth-style authentication with email providers
2. **Content Sync**: Automatic synchronization of email messages
3. **Processing**: Email content is processed same as documents
4. **Unified Search**: Emails appear alongside documents in search results

## 📋 Setup Instructions

### Prerequisites
- Node.js 18+ and npm/yarn
- OpenAI API key
- Modern web browser

### Environment Configuration

1. **Copy the environment template:**
\`\`\`bash
cp .env.example .env.local
\`\`\`

2. **Add your credentials to `.env.local`:**
\`\`\`env
# Required: OpenAI API Configuration
OPENAI_API_KEY=sk-your-openai-api-key-here

# Required: Application URL
NEXTAUTH_URL=http://localhost:3000

# Optional: File Upload Configuration
MAX_FILE_SIZE=52428800

# Optional: Production Database URLs
# DATABASE_URL=your_database_url_here
# VECTOR_DB_URL=your_vector_database_url_here
\`\`\`

### Installation & Running

1. **Install dependencies:**
\`\`\`bash
npm install
\`\`\`

2. **Start the development server:**
\`\`\`bash
npm run dev
\`\`\`

3. **Open your browser:**
Navigate to `http://localhost:3000`

## 🔧 API Endpoints

### Document Management
- `POST /api/documents/process` - Process uploaded documents
- `POST /api/embeddings` - Generate embeddings for text content

### AI & Search
- `POST /api/search` - Perform semantic search across knowledge base
- `POST /api/ai/answer` - Generate AI answers from search results
- `POST /api/ai/summarize` - Create document summaries

### Email Integration
- `POST /api/email/sync` - Synchronize email content

## 📁 Project Structure

\`\`\`
akop-mvp/
├── app/
│   ├── api/                 # API routes
│   │   ├── ai/             # AI-powered endpoints
│   │   ├── documents/      # Document processing
│   │   ├── embeddings/     # Vector embedding generation
│   │   ├── email/          # Email integration
│   │   └── search/         # Search functionality
│   ├── email/              # Email integration page
│   ├── settings/           # Settings management
│   ├── upload/             # File upload interface
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Dashboard homepage
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── ai-answer.tsx       # AI response display
│   ├── document-grid.tsx   # Document listing
│   ├── email-setup.tsx     # Email configuration
│   ├── search-bar.tsx      # Search interface
│   ├── sidebar.tsx         # Navigation sidebar
│   └── upload-zone.tsx     # File upload component
└── lib/
    └── utils.ts            # Utility functions
\`\`\`

## 🎯 Usage Guide

### Uploading Documents
1. Navigate to "Upload Files" in the sidebar
2. Drag and drop files or click to browse
3. Supported formats: PDF, DOCX, DOC, CSV (up to 50MB)
4. Files are automatically processed and indexed

### Searching Knowledge Base
1. Use the search bar on the dashboard
2. Type natural language questions
3. Get AI-generated answers with source citations
4. View relevant documents and emails

### Email Integration
1. Go to "Email Integration" page
2. Connect your email account (Gmail/Outlook)
3. System automatically syncs and indexes emails
4. Emails appear in search results alongside documents

### Settings Configuration
1. Access "Settings" from the sidebar
2. Configure file size limits
3. Adjust AI response length
4. Manage email sync preferences
5. Clear cache or reset to defaults

## 🔒 Security & Privacy

- **API Key Security**: OpenAI API keys stored as environment variables
- **File Processing**: Documents processed locally, not sent to external services
- **Email Privacy**: Email content processed locally for search indexing
- **Data Storage**: All data stored locally in development mode

## 🚀 Production Deployment

For production deployment, consider:

1. **Database Integration**: Replace mock vector storage with proper vector database (Pinecone, Weaviate, or FAISS)
2. **File Storage**: Implement proper file storage (AWS S3, Google Cloud Storage)
3. **Authentication**: Add user authentication and authorization
4. **Email Security**: Implement proper OAuth flows for email providers
5. **Monitoring**: Add logging and error tracking
6. **Scaling**: Configure for horizontal scaling and load balancing

## 📊 System Requirements

### Development
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 2GB free space
- **Network**: Internet connection for OpenAI API calls

### Production
- **RAM**: 8GB minimum, 16GB recommended
- **CPU**: 2+ cores recommended
- **Storage**: 10GB+ depending on document volume
- **Database**: Vector database for production scale

## 🤝 Support

For issues or questions:
1. Check the console logs for error messages
2. Verify your OpenAI API key is correctly configured
3. Ensure all environment variables are set
4. Check file size limits if uploads fail

## 📈 Future Enhancements

- Multi-user support with role-based access
- Advanced document parsing (OCR for scanned PDFs)
- Integration with more email providers
- Real-time collaboration features
- Advanced analytics and usage tracking
- Custom AI model fine-tuning
