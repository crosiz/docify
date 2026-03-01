# Docify - AI-Powered Knowledge Management System
Developed by [Crosiz](https://crosiz.com)

Docify is a comprehensive, production-ready AI knowledge management system that allows teams to instantly find answers from internal documents, emails, and corporate data using advanced retrieval-augmented generation (RAG).

## 🚀 Key Features
- **AI-Powered Chat & Search**: Semantic search across documents and emails using OpenAI.
- **Document Processing**: Upload and chunk PDFs, Word docs, and CSVs.
- **Unified Knowledge Graph**: Visual relationship mapping of internal data.
- **Authentication**: Secure Google OAuth and email login via NextAuth.
- **Responsive UI**: Fully mobile-responsive interface with dark/light mode toggles.
- **Production Ready**: Optimized compiler settings, secure environment variables, and scalable database architecture.

---

## 📋 Production Setup Checklist

To deploy Docify to a production environment (like Vercel, AWS, or Railway), you must configure the following external services and environment variables. 

### 1. Environment Variables
Copy the template `.env.example` file to a new `.env` file:
```bash
cp .env.example .env
```
You **must** fill in the real values for your production deployment. **Do not** commit your actual `.env` file to GitHub!

### 2. Database (PostgreSQL & Prisma)
Docify uses Prisma ORM with a PostgreSQL database (e.g., NeonDB, Supabase, or AWS RDS).
1. Create a production PostgreSQL database.
2. Set the connection string as `DATABASE_URL` in your `.env` file.
3. Run the Prisma migrations to generate the schema:
```bash
npx prisma generate
npx prisma db push
```

### 3. Authentication (NextAuth & Google)
Docify uses NextAuth.js for secure authentication.
1. Generate a strong random string for `NEXTAUTH_SECRET` (e.g., `openssl rand -base64 32`).
2. Set `NEXTAUTH_URL` to your production domain (e.g., `https://docify.yourdomain.com`).
3. Set up a **Google Cloud Console** OAuth application to get your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`. Make sure to add your production URL to the authorized redirect URIs.

### 4. AI Services (OpenAI & SERP)
1. Obtain an **OpenAI API Key** from the OpenAI Developer dashboard and set it as `OPENAI_API_KEY`. Note: You must have active billing credits for the embeddings and GPT-4 model to function.
2. Obtain a **SERP API Key** if you intend to use live web-search context, and set it as `SERP_API_KEY`.

---

## 🛠️ Build and Deploy

Once your environment is fully configured, you can build the application:

```bash
# Install dependencies
pnpm install

# Build for production
pnpm run build

# Start the production server
pnpm start
```

### Vercel Deployment (Recommended)
If deploying to Vercel:
1. Push your repository to GitHub.
2. Import the project in the Vercel dashboard.
3. Add all your production environment variables in the Vercel Settings -> Environment Variables tab.
4. Vercel will automatically run `pnpm run build` and deploy your application.

---

## 🔒 Security Notes
- All `console.log` statements have been stripped from the production build via `next.config.mjs` to prevent data leakage.
- Ensure your `DATABASE_URL` uses `sslmode=require` in production.
- Never hardcode API keys. Always use the `.env` system.

---
*Designed and Developed by Crosiz*
