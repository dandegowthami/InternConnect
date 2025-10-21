InternConnect

InternConnect is a web-based platform that connects students with internship opportunities and allows recruiters to manage applications efficiently. This full-stack project includes a Node.js + Express backend and a React frontend, along with features like authentication, profile management, notifications, and application tracking.

Features
Student Features

Register and login with email verification

Complete and edit profile

Browse and search for internship opportunities

Apply for internships

Track application status (shortlisted/rejected)

View notifications related to applications

Recruiter Features

Register and login as a recruiter

Post and manage internships

View applications for their internships

Shortlist or reject applicants

Receive notifications for applicant actions

Admin Features (Optional)

Manage users and recruiters

Monitor platform activity

Technologies Used

Frontend:

React.js

Vite

CSS & Bootstrap

Backend:

Node.js

Express.js

MongoDB (Mongoose)

JWT for authentication

Nodemailer for email notifications

Project Structure
InternConnect/
├── Backend/
│   ├── config/            # Database configuration
│   ├── controllers/       # Backend logic
│   ├── middleware/        # Auth and file upload middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── utils/             # Utility functions
│   ├── uploads/           # Uploaded files (resumes/screenshots)
│   └── server.js          # Backend server entry point
├── Frontend/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # React pages
│   │   ├── styles/        # CSS files
│   │   ├── api.js         # Axios API calls
│   │   └── main.jsx       # React entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── .gitignore

Installation
Backend
cd Backend
npm install


Create a .env file in Backend with your environment variables:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password


Start the server:

npm run dev

Frontend
cd Frontend
npm install
npm run dev


The frontend will run on http://localhost:5173 (default Vite port).

Usage

Open the frontend in your browser.

Register as a student or recruiter.

Login and explore available features.

Students can apply for internships and track status.

Recruiters can post internships and manage applications.

Contributions

Contributions are welcome! You can:

Report bugs

Suggest new features

Submit pull requests

License

This project is licensed under the MIT License.
