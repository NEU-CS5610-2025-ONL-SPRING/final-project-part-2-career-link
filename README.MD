# CareerLink

CareerLink is a web application designed to connect job seekers with employers by providing a seamless platform for job postings and applications. Employers can create, manage, and delete job postings, while job seekers can apply for jobs, track applications, and maintain a comprehensive profile with details such as skills, experience, and projects.

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



## Setup and Common Errors :

1. Run `npm install` in both client\careerlink_folder and api folder.
2. Create .env file inside `api` folder and add DATABASE_URL and JWT_SECRET. 
    Format for DATABASE_URL = 'postgres://username:password@host:port/carrerlink'
    Format for JWT_SECRET = 'ANY_LARGE_STRING'
3. If any issue with Prisma occurs when trying to run backend use `npx prisma generate` inside API folder.
4. Please make sure postgres is installed for backend to work. Can be installed from https://www.postgresql.org/ 

