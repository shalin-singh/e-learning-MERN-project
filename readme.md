# eLearning Management System

The eLearning Management System is a web application designed to facilitate online education and course management. It allows administrators to manage courses, materials, and enrollment requests, while students can enroll in courses, access study materials, and watch lectures.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Admin Dashboard:**
  - Manage courses, materials, and enrollment requests.
  - Approve or reject enrollment requests.
  
- **Student Portal:**
  - Browse and enroll in available courses.
  - Access course materials, including lectures and other study resources.
  
- **Course Materials:**
  - Upload and manage course materials, including lectures, PDFs, and other resources.
  
- **User Authentication:**
  - Secure user authentication and authorization.
  
- **Responsive Design:**
  - User-friendly interface accessible on various devices.
  
## Technologies Used

- **Node.js:** Backend server platform.
- **Express:** Web application framework.
- **MongoDB:** Database for storing course, user, and enrollment data.
- **Mongoose:** Object Data Modeling (ODM) library for MongoDB.
- **EJS:** Template engine for rendering dynamic HTML content.
- **Multer:** Middleware for handling file uploads.
- **Passport:** Authentication middleware.
- **Bootstrap:** CSS framework for responsive design.
- **Heroku:** Deployment platform (optional).

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/elearning-management-system.git
   
   cd elearning-management-system
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example` and set up your environment variables (e.g., database connection URL, session secret).

4. Start the server:
   ```
   npm start
   ```

5. Access the application in your browser at `http://localhost:3000`.

## Usage
- Home Page: Access the home page at `/`.
- Admin Portal: Access the admin dashboard at `/admin/dashboard`.
- Student Portal: Access the student portal at `/student/enrolled-courses`.

## Contributing

Contributions are welcome! If you have suggestions, improvements, or bug fixes, please submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).