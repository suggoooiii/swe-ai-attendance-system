# AI-Based Attendance System

This project is an AI-based attendance system built using React for the frontend and Flask for the backend. The system allows users to register, login, and check-in using facial recognition. Admin users can manage other users and view attendance records.

## Table of Contents

- [AI-Based Attendance System](#ai-based-attendance-system)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Technologies Used](#technologies-used)
  - [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Backend Setup](#backend-setup)
    - [Frontend Setup](#frontend-setup)
  - [Usage](#usage)
  - [Project Structure](#project-structure)
  - [API Endpoints](#api-endpoints)
    - [Authentication](#authentication)
    - [User Management](#user-management)
    - [Attendance](#attendance)
  - [Contributing](#contributing)

## Features

- User registration and login
- Facial recognition for check-in
- Admin panel for managing users
- JWT-based authentication
- Responsive design using Chakra UI

## Technologies Used

- **Frontend**: React, Vite, Chakra UI, Axios, React Router
- **Backend**: Flask, Flask-SQLAlchemy, Flask-JWT-Extended, face_recognition
- **Database**: SQLite

## Installation

### Prerequisites

- Node.js and npm
- Python 3.x
- Virtualenv (optional but recommended)

### Backend Setup

1. Clone the repository:
    ```
    sh git clone https://github.com/yourusername/ai-attendance-system.git cd ai-attendance-system/backend_flask
```
2. Create a virtual environment and activate it:
```
sh python -m venv venv source venv/bin/activate # On Windows use venv\Scripts\activate
```
3. Install the required Python packages:
   ```
sh flask run
    ```


### Frontend Setup

1. Navigate to the frontend directory:
    ```cd ../attendance-system-React```

2. Install the required npm packages:
   ```sh npm install```

3. Run the frontend:
   ```sh npm start```

## Usage

1. Open your browser and navigate to `http://localhost:3000` to access the frontend.
2. Register a new user or login with existing credentials.
3. Use the check-in feature to verify your identity using facial recognition.
4. Admin users can manage other users and view attendance records.
   
## Project Structure
ai-attendance-system/ ├── backend_flask/ │ ├── app.py │ ├── config.py │ ├── database.py │ ├── routes.py │ └── requirements.txt ├── attendance-system-React/ │ ├── public/ │ ├── src/ │ │ ├── components/ │ │ ├── App.jsx │ │ ├── main.jsx │ │ ├── axiosConfig.js │ │ ├── index.css │ │ └── theme.js │ ├── .gitignore │ ├── index.html │ ├── package.json │ ├── README.md │ └── vite.config.js


## API Endpoints

### Authentication

- `POST /register`: Register a new user
- `POST /login`: Login a user and return JWT tokens
- `POST /refresh`: Refresh the access token

### User Management

- `GET /users`: Get a list of all users (Admin only)
- `POST /update_role`: Update the role of a user (Admin only)

### Attendance

- `POST /checkin`: Check-in using facial recognition
- `POST /verify_identity`: Verify identity using facial recognition

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.