# Legend4Tech Portfolio Fullstack

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![AWS S3](https://img.shields.io/badge/AWS%20S3-569A31?style=for-the-badge&logo=amazon-s3&logoColor=white)](https://aws.amazon.com/s3/)
[![Resend](https://img.shields.io/badge/Resend-000000?style=for-the-badge&logo=resend&logoColor=white)](https://resend.com/)

## Overview
This project serves as the robust Fullstack for the Legend4Tech personal portfolio, built with TypeScript, Next.js API Routes, and Server Actions. It manages dynamic content such as projects, certificates, tech stack items, and user comments, offering secure administrative functionalities and integration with external services like AWS S3 for file storage and Resend for email communications.

## Features
- **Project Management**: CRUD operations for portfolio projects, including details, technologies, features, and links.
- **Certificate Management**: CRUD operations for professional certifications, including images and external verification links.
- **Tech Stack Management**: CRUD operations for displaying technical skills, categorized and ordered for presentation.
- **User Comments**: Public comment submission and retrieval for portfolio engagement.
- **Admin Authentication**: Secure login and session management for administrators using Next-Auth (Auth.js v5) with credentials and Google OAuth.
- **File Uploads**: Direct image upload capabilities to AWS S3 for projects, certificates, and user avatars.
- **Contact Form**: Email handling via Resend for direct inquiries from the portfolio.
- **GitHub Integration**: Fetches merged pull requests from a specified GitHub username to showcase open-source contributions.
- **First-Time Setup**: Guided setup process to create the initial admin account securely.

## Getting Started

### Installation
To set up the project locally, follow these steps:

```bash
# Clone the repository
git clone https://github.com/legend4tech/portfolio-v1.git

# Navigate into the project directory
cd portfolio-v1

# Install dependencies using npm or yarn
npm install
# or
yarn install
```

### Environment Variables
The project requires the following environment variables to be configured. Create a `.env.local` file in the root directory and populate it with your specific values.

```
# AWS S3 Configuration for file uploads
MY_AWS_ACCESS_KEY=your_aws_access_key_id_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key_here
AWS_S3_BUCKET_NAME=your_s3_bucket_name_here
AWS_REGION=your_aws_region_here (e.g., eu-north-1)

# Resend API Key for sending emails
RESEND_API_KEY=your_resend_api_key_here
SENDER_EMAIL="Sender Name <sender@example.com>"
CONTACT_EMAIL=your_contact_email_address_here

# MongoDB Connection
MONGODB_URL=mongodb+srv://user:password@cluster.mongodb.net/database
MONGODB_DB=portfolio

# GitHub Integration
GITHUB_USERNAME=your_github_username_here

# Next-Auth (Auth.js v5) Secret
AUTH_SECRET="a_long_random_string_for_nextauth_jwt_signing"

# Admin Setup PIN (for initial admin user creation)
ADMIN_SETUP_PIN=Number
```

## API Documentation

### Base URL
The API base URL is derived from the deployed application's root (e.g., `https://your-portfolio.com/api`).

### Endpoints

#### POST /api/upload
**Description**: Handles secure uploading of image files to an AWS S3 bucket.

**Request**:
`Content-Type: multipart/form-data`
| Field | Type | Description | Required | Example |
| :---- | :--- | :---------- | :------- | :------ |
| `file` | `File` | The image file to be uploaded. | Yes | `(binary file data)` |

**Response (200 OK)**:
```json
{
  "success": true,
  "fileUrl": "https://legend4tech-portfolio.s3.eu-north-1.amazonaws.com/unique-image-id.jpg"
}
```

**Errors**:
- `400 Bad Request`: "No file provided", "Upload failed"
- `500 Internal Server Error`: "S3 upload failed: [error message]", "Failed to upload file: [error message]"

---

#### PUT /api/admin/profile
**Description**: Updates the profile information of the authenticated admin user.

**Authentication**: Requires an active admin session.

**Request**:
`Content-Type: application/json`
```json
{
  "name": "string",
  "username": "string",
  "email": "string",
  "avatar": "string (URL, optional)",
  "currentPassword": "string (required if newPassword is provided)",
  "newPassword": "string (min 6 characters, optional)"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Profile updated successfully"
}
```

**Errors**:
- `400 Bad Request`: "Name is required", "Username is required", "Invalid email address", "Current password is required to set a new password", "Password must be at least 6 characters", "Current password is incorrect"
- `401 Unauthorized`: "Unauthorized"
- `404 Not Found`: "User not found"
- `500 Internal Server Error`: "Failed to update profile"

---

#### POST /api/admin/setup
**Description**: Creates the first admin user account. This endpoint is only accessible if no admin user currently exists in the database.

**Authentication**: None (public for initial setup).

**Request**:
`Content-Type: application/json`
```json
{
  "name": "string",
  "username": "string",
  "email": "string",
  "password": "string (min 6 characters)",
  "avatar": "string (URL, optional)",
  "secretPin": "string"
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "userId": "string (ObjectId of the newly created admin user)"
}
```
*   **Note**: This endpoint also clears the `no_admin_exists` cookie upon successful setup.

**Errors**:
- `400 Bad Request`: "Name is required", "Username is required", "Invalid email address", "Password must be at least 6 characters", "Secret PIN is required", "Admin already exists"
- `403 Forbidden`: "Invalid secret PIN"
- `500 Internal Server Error`: "Admin setup is not configured. Please set ADMIN_SETUP_PIN environment variable.", "Failed to create admin account"

---

#### GET /api/github/pull-requests
**Description**: Retrieves a list of merged GitHub pull requests for the configured `GITHUB_USERNAME`.

**Authentication**: None (public endpoint).

**Request**:
No request body.

**Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 12345,
      "title": "string",
      "url": "string (URL)",
      "mergedAt": "string (ISO Date)",
      "repository": "string",
      "repositoryUrl": "string (URL)",
      "labels": [
        {
          "name": "string",
          "color": "string (hex color code without #)"
        }
      ],
      "closedIssues": [
        {
          "number": "string",
          "url": "string (URL)"
        }
      ],
      "description": "string | null"
    }
  ],
  "count": "number"
}
```

**Errors**:
- `500 Internal Server Error`: "GitHub username not configured", "Failed to fetch pull requests"

---

## Technologies Used
The Legend4Tech Portfolio project leverages a modern and robust stack to deliver a seamless user experience and efficient content management.

| Category       | Technology         | Description                                        |
| :------------- | :----------------- | :------------------------------------------------- |
| **Frontend**   | [Next.js](https://nextjs.org/)     | React framework for production, server-side rendering, and API routes. |
|                | [React](https://react.dev/)        | JavaScript library for building user interfaces.         |
|                | [TypeScript](https://www.typescriptlang.org/) | Superset of JavaScript that adds static typing.     |
|                | [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS framework for rapid UI development. |
|                | [Shadcn/ui](https://ui.shadcn.com/) | Re-usable components built with Radix UI and Tailwind CSS. |
|                | [Framer Motion](https://www.framer.com/motion/) | Production-ready motion library for React.         |
|                | [React Query](https://tanstack.com/query/latest) | Powerful asynchronous state management for React. |
|                | [DotLottie React](https://lottiefiles.com/dotlottie) | React component for playing Lottie animations. |
| **Backend**    | [Node.js](https://nodejs.org/)     | JavaScript runtime for server-side logic.          |
|                | [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction) | API endpoints within the Next.js framework. |
|                | [Next-Auth (Auth.js)](https://next-auth.js.org/) | Flexible authentication for Next.js applications. |
|                | [MongoDB](https://www.mongodb.com/) | NoSQL document database for data storage.          |
|                | [AWS S3](https://aws.amazon.com/s3/) | Cloud object storage service for image uploads.      |
|                | [Resend](https://resend.com/)      | Email API for developers.                            |
| **Development**| [ESLint](https://eslint.org/)      | Pluggable JavaScript linter.                       |
|                | [Prettier](https://prettier.io/)   | Opinionated code formatter.                        |
|                | [Vercel Analytics](https://vercel.com/analytics) | Real-time analytics for website performance. |

## Usage
To run the application in development mode:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result. The application supports an admin dashboard for content management, accessible at `/admin`.

The first time you access `/admin`, you will be redirected to `/admin/setup` to create your initial admin account using the `ADMIN_SETUP_PIN` from your environment variables.

## Contributing
Contributions are welcome! If you have suggestions or find issues, please open an issue or submit a pull request.
*   ⭐ Fork the repository.
*   💡 Create a new branch for your feature or bug fix.
*   🛠️ Make your changes and ensure your code follows the project's coding standards.
*   ✅ Write clear commit messages.
*   🚀 Submit a pull request.

## License
This project is licensed under the [MIT License](https://github.com/legend4tech/portfolio-v1/blob/main/LICENSE).

## Author Info
Developed with passion by Ajulu Dennis.
*   🌐 [Website](https://legend4tech.com)
*   💼 [LinkedIn](https://www.linkedin.com/in/ajulu-dennis)
*   🐦 [X (Twitter)](https://x.com/legend4tech)
*   📧 [Email](mailto:ajuludennis14@gmail.com)

## Badges
[![Next.js](https://img.shields.io/badge/Framework-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/Library-React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Next-Auth](https://img.shields.io/badge/Auth-Next--Auth-blue?style=for-the-badge&logo=next.js)](https://next-auth.js.org/)
[![AWS S3](https://img.shields.io/badge/Storage-AWS_S3-569A31?style=for-the-badge&logo=amazon-s3&logoColor=white)](https://aws.amazon.com/s3/)
[![Resend](https://img.shields.io/badge/Email-Resend-black?style=for-the-badge&logo=resend&logoColor=white)](https://resend.com/)
[![Vercel](https://img.shields.io/badge/Deployment-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://www.npmjs.com/package/dokugen)