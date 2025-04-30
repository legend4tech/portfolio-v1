# Legend4Tech Portfolio - Modern Developer Showcase

✨ **A cutting-edge portfolio built with Next.js 15, TypeScript, and Dottie React for stunning animations**

🔗 **Live at:** [https://legend4tech.com](https://legend4tech.com)

![Portfolio Screenshot](https://legend4tech.com/og-image.png)

## 🚀 Technologies Used

- **Next.js 15** - Latest App Router for optimal performance
- **TypeScript** - Type-safe code for better developer experience
- **Tailwind CSS** - Utility-first styling framework
- **Dottie React** - Beautiful dot-based animations and transitions
- **Shadcn UI** - Beautiful Ui Components Library
- **Geist Font** - Modern typography by Vercel

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- npm

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/legend4tech/portfoliov1-.git
   cd portfolio
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**  
   Create a `.env.local` file based on `.env.example`
   ```bash
   cp .env.example .env.local
   ```

### Running the Project

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the portfolio.

## ✨ Key Features

- **Dot Animations** - Powered by Dottie React for unique dot-based transitions
- **Responsive Design** - Looks great on all devices
- **Performance Optimized** - Next.js 15 static generation and image optimization
- **Dark Mode Design** - Sleek Dark purple and blue

## 🎨 Dottie React Implementation

This portfolio uses **Dottie React** for creating beautiful dot-based animations:

```tsx
import { Dottie } from "dottie-react";

const AnimatedSection = () => (
  <Dottie dots={50} color="#3b82f6" size={5} speed={2} opacity={0.7}>
    {/* Your content here */}
  </Dottie>
);
```

### Dottie React Features Used:

- Smooth dot transitions between pages
- Interactive hover effects with dots
- Background dot patterns for visual interest

## 📂 Project Structure

```
portfolio/
├── app/               # Next.js 15 App Router
│   ├── (sections)/    # Portfolio sections
│   ├── components/    # Reusable components
│   └── page.tsx       # Home page
├── lib/               # Utility functions
├── public/            # Static assets
├── styles/            # Global styles
└── types/             # TypeScript types
```

## 🚀 Deployment

The portfolio is configured for easy deployment on:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fportfolio)

### Other Deployment Options:

- **Netlify**
- **Cloudflare Pages**
- **Self-hosted** (Docker, Node.js server)

## 🤝 Contributing

While this is my personal portfolio, I welcome suggestions and feedback!

1. Fork the project
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📜 License

MIT © 2023 Legend4Tech. All rights reserved.

---

💡 **Tip**: Run `npm run build` locally to test production build before deploying.
