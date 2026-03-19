# 🚀 ZeroPilot | AI-Powered Instagram Automation

**ZeroPilot** is a next-generation SaaS platform designed to automate Instagram engagement using advanced AI. Developed with a focus on high-impact interactions, ZeroPilot handles your DMs and comments so you can focus on building your brand.

---

## ✨ Features

- 🤖 **AI-Powered Responses**: Integrated with Google Gemini Flash for near-instant, context-aware conversations.
- 💬 **DM Automation**: Set up keyword triggers to automatically handle inquiries and lead generation.
- 📝 **Comment Automation**: Automatically reply to post comments and send private DMs to engaged followers.
- 📊 **Smart Metrics**: Real-time tracking of engagement, responses, and automation performance.
- 🛡️ **Elite Security**: Production-grade webhook signature validation and per-user rate limiting to prevent flooding.
- ⚡ **Ultra-Fast Webhooks**: Optimized backend with parallel DB processing for minimal latency.
- 🎨 **Cyberpunk Aesthetic**: A premium, futuristic dashboard designed for the modern creator economy.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
- **Authentication**: [Clerk](https://clerk.com/)
- **Database**: [PostgreSQL (Neon DB)](https://neon.tech/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **AI Engine**: [Google Gemini AI](https://deepmind.google/technologies/gemini/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 🚀 Getting Started

1. **Clone the repository**
2. **Install dependencies**: `npm install`
3. **Environment Setup**: Create a `.env` file with:
   - `DATABASE_URL`
   - `CLERK_SECRET_KEY` & `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `INSTAGRAM_CLIENT_ID` & `INSTAGRAM_CLIENT_SECRET`
   - `GEMINI_API_KEY`
4. **Push Schema**: `npx prisma db push`
5. **Run Locally**: `npm run dev`

---

## 👨‍💻 Developer

**ZeroPilot** is maintained and primarily developed by:

**[Vishesh Jha](https://github.com/vjha)** *(Main Developer)*

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*“Elevate your Instagram presence with the pilot that never sleeps.”* 🚀
