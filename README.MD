# CareerLink

CareerLink is a web application designed to connect job seekers with employers by providing a seamless platform for job postings and applications. Employers can create, manage, and delete job postings, while job seekers can apply for jobs, track applications, and maintain a comprehensive profile with details such as skills, experience, and projects.

## Career Link Webiste
https://careerlink-frontend.vercel.app/

In order for backend to spinup its server please go to companies page available in the nav bar so it makes an API call to the server, so backend can be up and running.

## Video link of the project 
https://youtu.be/gIxPVH62HSA

## Key Features

### Authentication & Security
- Users authenticate via token cookies stored as HTTP-only cookies to enhance security and prevent XSS attacks.

### Role-Based Access Control (RBAC)
- **Job Seekers**: Can apply for jobs, manage their profiles, and track applications.
- **Employers**: Can create, update, and delete job postings they own.

### Comprehensive Job Management
- Employers can post jobs.
- Job seekers can filter and apply for jobs based on location, salary, and skills.

## Technology Stack

- **Frontend**: React.js  
- **Backend**: Node.js & Express.js  
- **Database**: PostgreSQL  
- **Authentication**: Token-based authentication with HTTP-only cookies  

This robust system ensures a secure, scalable, and user-friendly experience for both job seekers and employers.

### Setup

1. **Install Dependencies:**
   - Open terminal in `client/careerlink_folder` and `api` folder.
   - Run `npm install` in both directories to install necessary dependencies.

2. **Set Environment Variables:**
   - Create a `.env` file inside the `api` folder.
   - Add the following environment variables:
     ```plaintext
     DATABASE_URL=postgres://username:password@host:port/carrerlink
     JWT_SECRET=ANY_LARGE_STRING
     CLOUDINARY_CLOUD_NAME=Add_cloudinary_name
     CLOUDINARY_API_KEY=Add_cloudinary_API_KEY
     CLOUDINARY_API_SECRET=Add_cloudinary_API_KEY_Secret
     GOOGLE_AI_API_KEY=Add_google_studio_api_key
     PORT=8080
     NODE_ENV=production
     ```
   - Replace placeholders (`username`, `password`, `host`, `port`, etc.) with your actual database and API credentials.

3. **Database Setup:**
   - Ensure PostgreSQL is installed. If not, download and install from [PostgreSQL](https://www.postgresql.org/).

4. **Prisma Setup:**
   - If encountering issues with Prisma, run `npx prisma generate` inside the `api` folder to regenerate Prisma client.

5. **Run Backend:**
   - In the `api` folder, run `node index.js` to start the backend server.

### Frontend Setup

1. **Environment Configuration:**
   - Update the `.env` file in the `client/careerlink_folder` for local development:
     ```plaintext
     REACT_APP_API_URL=http://localhost:8080
     ```
   - Adjust `REACT_APP_API_URL` to match your backend API endpoint for local testing.

2. **Run Frontend:**
   - In `client/careerlink_folder`, run `npm start` to start the frontend server.

### Connecting Frontend to Backend

- To connect the frontend to a deployed backend server:
  - Update the `REACT_APP_API_URL` in the `.env` file to your backend's deployed URL.

### Common Issues

- If facing issues, ensure all dependencies are installed, environment variables are correctly set, and PostgreSQL is properly configured.


### External API 
- **AI-Powered Resume Review:**
  - This project integrates **Google AI Studio's API**, utilizing the **Gemini 2.0 Flash model** to review resumes uploaded by job seekers.
  - The AI provides personalized suggestions to help improve resume quality.
  - This feature is accessible on the **Job Seeker's Profile page**, after uploading a resume.

- **Resume Storage with Cloudinary:**
  - We use **Cloudinary SDKs** to securely store uploaded resumes in the cloud.
  - This ensures that resumes are easily accessible to both **Job Seekers** and **Employers**, improving the overall user experience and performance.


  ### Tests
- To Run tests go inside `client/careerlink_folder` and run `npm test`
- There are total 3 test classes inside `src/tests` folder




