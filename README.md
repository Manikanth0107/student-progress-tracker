
# Student Progress Tracker

A full-stack MERN application designed to manage and visualize student progress using data from the Codeforces API. This system provides a comprehensive dashboard for tracking contest performance, problem-solving metrics, and automated inactivity detection.


## Features

-  Fetch & display Codeforces profile data
- Rating change visualized via charts
- Heatmaps & bar charts for problem-solving trends
- Filter by time (e.g., last 30 days, all-time)
- Automated Daily Sync. A background cron job runs daily (default at 2 AM) to fetch updated Codeforces data for all enrolled students, minimizing live API calls during user interaction.
- Detailed Student Profile. Interactive rating graph with filtering for the last 30, 90, or 365 days. Key metrics like total problems solved, average problems per day, and average problem rating, filterable by 7, 30, or 90 days.
- Inactivity Detection & Notifications. Automatically identifies students with no submissions in the last 7 days.
- Modern UI/UX - Fully responsive design for desktop, tablet, and mobile.Seamless light and dark mode toggle.


## Tech Stack

**Client:** React.js, Redux Toolkit, Material-UI (MUI), Recharts, React Router, Axios

**Server:** Node.js, Express.js, MongoDB, Mongoose

**Services & Tools:** Codeforces API, Node Cron, SendGrid


## Project Structure

The project is structured as two main folders: client and server

- /client: Contains the entire React frontend application, structured with features, components, pages, and Redux state management.

- /server: Contains the Node.js/Express backend, with a clear separation of concerns for routes, controllers, models, and services


## Demo

Demo Video: https://drive.google.com/file/d/1l93Pa4K8XUxFQy_ZQOOrXhSQii9pr1hG/view?usp=sharing


## Installation & Setup

Clone the project

```bash
  git clone https://github.com/Manikanth0107/student-progress-tracker
  
```

Go to the project directory

```bash
  cd student-progress-tracker
```

Setup the Backend Server: 
```bash
  cd server
  npm install
```
- Create .env file in server folder and fill in the required environment variables (see below).

Start the server

```bash
  node index.js
```

- The server will be running on http://localhost:5000.

Setup the Client: 

- Open a new terminal window.
```bash
  cd server
  npm install
```

Start the Client server:

```bash
  npm run dev
```

- The React application will open in your browser at http://localhost:5173.


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file in the /server directory:

`PORT` The port for the backend server (e.g., 5000).

`MONGODB_URI` Your MongoDB connection string.


## API Endpoints

A brief overview of the available API routes:



| Method | Endpoint     | Description                |
| :-------- | :------- | :------------------------- |
| `GET` | `/api/students` | Get all enrolled students |
| `GET` | `/api/students/:id` | Retrieve a specific student by ID |
| `POST` | `/api/students/:id` | Update a specific student's information by ID |
| `DELETE` | `/api/students/:id` | Delete a student entry by ID |
| `POST` | `/api/students/sync-ratings` |Sync student ratings  |
| `GET` | `/api/students/contests/:handle` | Fetch contest history for a student by handle |
| `GET` | `/api/students/analytics/:handle` |Fetch analytical data (e.g., performance metrics) for a student |





## Screenshots

- Dashboard
![Image](https://github.com/Manikanth0107/student-progress-tracker/blob/2545978edd000c0c6aa0acf380ac3370ccf1b335/Dashboard.png)

- Students Overview
![Image](https://github.com/Manikanth0107/student-progress-tracker/blob/2545978edd000c0c6aa0acf380ac3370ccf1b335/Students-Overview.png)

- Student Profile - Contest History
![Image](https://github.com/Manikanth0107/student-progress-tracker/blob/2545978edd000c0c6aa0acf380ac3370ccf1b335/Students-Profile.png)

- Student Profile - Problem Solving Data

![Image](https://github.com/Manikanth0107/student-progress-tracker/blob/2545978edd000c0c6aa0acf380ac3370ccf1b335/Students-Profile2.png)


## Authors

- Bairagoni manikanth
- LinkedIn www.linkedin.com/in/bairagoni-manikanth

