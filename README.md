# Legend4Tech Portfolio - Modern Developer Showcase

✨ **A cutting-edge portfolio built with Next.js 15, TypeScript, and Dottie React for stunning animations**

🔗 **Live at:** [https://legend4tech.com](https://legend4tech.com)

![Portfolio Screenshot](https://legend4tech.com/og-image.png)

## 🚀 Technologies Used

- **Next.js 15** - Latest App Router for optimal performance
- **TypeScript** - Type-safe code for better developer experience
- **Tailwind CSS** - Utility-first styling framework
- **Dottie React** - Beautiful dot-based animations and transitions
- **Shadcn UI** - Beautiful UI Components Library
- **Geist Font** - Modern typography by Vercel
- **MongoDB Atlas** - Cloud database for file metadata
- **Amazon S3** - File storage solution
- **Resend** - Email delivery service

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- npm
- AWS Account (for S3)
- MongoDB Atlas Account
- Resend Account

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/legend4tech/portfolio-v1.git
   cd portfolio-v1
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**  
   Create a `.env.local` file in the root directory with the following variables:

   ```env
   # AWS S3 Configuration
   AWS_S3_BUCKET_NAME=your-bucket-name
   AWS_ACCESS_KEY_ID=your-aws-access-key
   AWS_SECRET_ACCESS_KEY=your-aws-secret-key
   AWS_REGION=your-aws-region

   # MongoDB Atlas Configuration
   MONGODB_DB=your-database-name
   MONGODB_URL=your-mongodb-connection-string

   # Resend Email Configuration
   RESEND_API_KEY=your-resend-api-key
   CONTACT_EMAIL=your-contact-email
   SENDER_EMAIL="Your Name <your-sender-email>"
   ```

### How to Obtain Each Credential

#### AWS S3 Setup:

1. Log in to AWS Management Console
2. Create an IAM user with programmatic access
3. Attach the `AmazonS3FullAccess` policy
4. Store the access key and secret in your `.env.local`

#### MongoDB Atlas Setup:

1. Create a free cluster on MongoDB Atlas
2. Create a database user with read/write privileges
3. Whitelist your IP address (or use 0.0.0.0/0 for development)
4. Get the connection string from "Connect" button

#### Resend Setup:

1. Sign up at Resend.com
2. Create an API key in the dashboard
3. Verify your sender email domain

## ✨ Key Features

- **Dot Animations** - Powered by Dottie React for unique dot-based transitions
- **Responsive Design** - Looks great on all devices
- **Performance Optimized** - Next.js 15 static generation and image optimization
- **Dark Mode Design** - Sleek Dark purple and blue
- **Secure File Uploads** - AWS S3 with MongoDB metadata tracking
- **Contact Form** - Powered by Resend for reliable email delivery

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

## 🔒 Security Note

Never commit your `.env.local` file to version control. It's already included in the `.gitignore` file to prevent accidental exposure of your credentials.

## 🚀 Deployment

The portfolio is configured for easy deployment on:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Flegend4tech%2Fportfolio-v1)

When deploying to Vercel, add your environment variables in the project settings.

## 📜 License

MIT © 2023 Legend4Tech. All rights reserved.

---

💡 **Development Tip**:

- Use `npm run build` to test the production build locally
- Use `npm run lint` to check for code quality issues
- Remember to set proper CORS policies in your AWS S3 bucket configuration
