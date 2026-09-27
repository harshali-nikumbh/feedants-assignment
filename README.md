# Feedants Competition Details – Full Stack Assignment

A functional full-stack implementation of the Feedants Competition Details screen for the Full Stack Development Internship technical assignment.

The application follows the provided design reference while implementing dynamic competition data, participant registration, capacity management, time-based competition states, and video submission functionality.

---

## Author

**Harshali Nikumbh**  
B.Tech ENTC | Full Stack Development

This project was developed as part of the Feedants Full Stack Development Internship technical assignment.

**GitHub:** https://github.com/harshali-nikumbh

## Tech Stack

### Frontend

- React Native
- Expo
- TypeScript
- Expo Router
- Expo Document Picker
- React Native Vector Icons

### Backend

- Node.js
- Express.js
- Mongoose
- Multer
- CORS
- Helmet

### Database

- MongoDB

---

## Features

### Competition Details

Competition information is fetched dynamically from the backend and MongoDB.

The screen displays:

- Competition title
- Category and competition type
- Prize pool
- Entry fee
- Participant capacity
- Remaining spots
- Registration progress
- Judge information
- Important dates
- About competition
- Judging parameters
- Rules and eligibility
- Rewards
- Previous winners

### Registration

- Register for a competition
- Dynamic registered/unregistered state
- Registration start and end validation
- Duplicate registration prevention
- Participant capacity validation
- Atomic participant-slot reservation
- Protection against inconsistent participant counts during concurrent registrations

### Video Submission

- Upload video submissions
- Maximum file size of 50 MB
- Video MIME type validation
- Submission requires prior registration
- Submission start and end validation
- Duplicate submission prevention
- Uploaded submission status
- View uploaded video from the application

### Time-Based States

The application dynamically handles states such as:

- Registration not started
- Registration open
- Registration closed
- Competition full
- Submission not started
- Submission open
- Submission closed
- Submission already uploaded

---

## Architecture

```text
React Native / Expo
        |
        | HTTP API
        v
Node.js + Express
        |
        +--------------------+
        |                    |
        v                    v
    MongoDB              File Storage
                         (local uploads/)
```

Competition, registration, and submission data are persisted in MongoDB.

Video files are handled by Multer and stored locally in the backend `uploads/` directory during development.

---

## Project Structure

```text
FeedantsAssignment/
│
├── mobile/
│   ├── src/
│   │   ├── app/
│   │   │   ├── _layout.tsx
│   │   │   └── index.tsx
│   │   │
│   │   ├── components/
│   │   │   ├── CompetitionStats.tsx
│   │   │   ├── ImportantDates.tsx
│   │   │   └── JudgeCard.tsx
│   │   │
│   │   ├── constants/
│   │   └── hooks/
│   │
│   ├── app.json
│   ├── package.json
│   └── tsconfig.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── competition.controller.js
│   │   │   ├── registration.controller.js
│   │   │   └── submission.controller.js
│   │   │
│   │   ├── models/
│   │   │   ├── Competition.js
│   │   │   ├── Registration.js
│   │   │   └── Submission.js
│   │   │
│   │   ├── routes/
│   │   │   ├── competition.routes.js
│   │   │   ├── registration.routes.js
│   │   │   └── submission.routes.js
│   │   │
│   │   ├── seed/
│   │   │   └── seedCompetition.js
│   │   │
│   │   └── app.js
│   │
│   ├── package.json
│   └── uploads/
│
└── README.md
```

---

## Database Design

### Competition

Stores the main competition information.

Important fields include:

- title
- category
- type
- prizePool
- entryFee
- maxParticipants
- registeredParticipants
- registrationStart
- registrationEnd
- submissionStart
- submissionEnd
- resultDate
- status
- judge
- about
- judgingParameters
- rules
- rewards
- previousWinners

### Registration

Stores participant registration information.

```text
competition
participantName
status
createdAt
updatedAt
```

A unique compound index on:

```text
competition + participantName
```

prevents duplicate registrations.

### Submission

Stores uploaded submission information.

```text
competition
participantName
fileName
filePath
fileType
status
createdAt
updatedAt
```

A unique compound index on:

```text
competition + participantName
```

prevents multiple submissions from the same participant for the same competition.

---

## API Endpoints

### Competition

```text
GET /api/competitions/:id
```

Fetches competition details.

### Registration

```text
POST /api/registrations
```

Registers a participant.

```text
GET /api/registrations
```

Checks the registration state for a participant.

### Submission

```text
POST /api/submissions
```

Uploads a video submission.

```text
GET /api/submissions
```

Fetches the participant's existing submission.

Uploaded files are served through:

```text
/uploads/:filename
```

---

## Business Logic and Validations

### Registration

Before registration, the backend validates:

1. Competition exists
2. Registration has started
3. Registration deadline has not passed
4. Participant has not already registered
5. Competition still has available capacity

Participant capacity is updated using an atomic MongoDB increment with a capacity condition:

```text
registeredParticipants < maxParticipants
```

This prevents multiple concurrent requests from reserving the same final participant slot.

If registration creation fails after a slot has been reserved, the participant count is rolled back.

### Submission

Before accepting a submission, the backend validates:

1. Competition exists
2. Participant is registered
3. Participant has not already submitted
4. Submission period has started
5. Submission deadline has not passed
6. A file is present
7. Uploaded file is a video
8. File size does not exceed 50 MB

Duplicate submissions are additionally protected by a unique MongoDB index.

---

## Running the Project

### Prerequisites

Make sure the following are installed:

- Node.js
- npm
- MongoDB
- Git

---

### 1. Clone the repository

```bash
git clone https://github.com/harshali-nikumbh/feedants-assignment.git
cd feedants-assignment
```

---

### 2. Start MongoDB

Make sure the local MongoDB service is running on:

```text
mongodb://127.0.0.1:27017
```

---

### 3. Configure the backend

Go to:

```text
server/
```

Create a `.env` file using the environment variables expected by the backend.

Example:

```env
MONGO_URI=mongodb://127.0.0.1:27017/feedants
PORT=5000
```

Do not commit the `.env` file to GitHub.

---

### 4. Install backend dependencies

```bash
cd server
npm install
```

Start the backend in development mode:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

---

### 5. Seed the competition

If the database needs to be populated with the sample competition:

```bash
npm run seed
```

---

### 6. Install frontend dependencies

Open another terminal:

```bash
cd mobile
npm install
```

Start Expo:

```bash
npm start
```

For the web version, press:

```text
w
```

Expo will open the React Native web application.

The local web application normally runs at:

```text
http://localhost:8081
```

---

## Demo Flow

The implemented flow can be demonstrated as follows:

1. Open the Competition Details screen.
2. View dynamically loaded competition information.
3. View participant capacity and registration progress.
4. View the current registration state.
5. View time-dependent registration information.
6. Navigate through About Competition, Judging Parameters, and Rules & Eligibility.
7. View rewards and previous winners.
8. View the current submission state.
9. Open the uploaded submission video.
10. Demonstrate backend validations and edge cases using the APIs.

---

## Important Assumptions

- A full authentication system was outside the scope of the provided assignment, so the current demo uses a fixed participant identity for demonstrating user-specific registration and submission states.
- The competition data is stored in MongoDB and served through the backend rather than being hardcoded into the UI.
- Video files are stored locally during development.
- The current implementation is intended as a functional assignment implementation rather than a production deployment.
- The provided design was used as the visual reference for the competition details screen.

---

## Major Technical Decisions

### MongoDB

MongoDB was selected because the assignment explicitly requires MongoDB and the competition contains nested structures such as judge information, rewards, and previous winners.

### Separate Registration and Submission Models

Registration and submission data are maintained separately from the competition document. This keeps participant actions independently queryable and avoids continuously growing arrays inside the competition document.

### Atomic Capacity Reservation

Participant capacity is updated using an atomic conditional MongoDB operation rather than simply reading the current count and incrementing it afterward.

This reduces the possibility of two concurrent registration requests exceeding the competition capacity.

### Unique Compound Indexes

Unique indexes on:

```text
competition + participantName
```

provide database-level protection against duplicate registrations and submissions.

### Component-Based Frontend

Repeated or logically independent UI sections were extracted into reusable React Native components such as:

- `CompetitionStats`
- `ImportantDates`
- `JudgeCard`

This keeps the main competition screen easier to maintain.

---

## Trade-offs

### Local File Storage

Local storage was used for video submissions to keep the assignment simple and runnable locally.

For production, object storage would be more appropriate.

### Demo Participant Identity

A fixed participant identity is used for the assignment demonstration because a complete authentication and user-management system was not required by the task.

### Client-Side State Display

The frontend calculates certain display states from competition timestamps, while the backend independently validates the same business rules.

This provides a responsive UI without relying on the frontend for security or business-rule enforcement.

---

## Production Improvements

If this module were developed further for production, the following improvements would be considered:

- JWT or OAuth-based authentication
- User and role management
- Cloud object storage such as S3-compatible storage for videos
- CDN delivery for uploaded media
- Stronger file-content validation in addition to MIME type checks
- Background processing for large video uploads
- Rate limiting
- Request validation middleware
- Centralized error handling
- Structured logging and monitoring
- Pagination for large participant/submission datasets
- API versioning
- Automated tests
- CI/CD pipeline
- Docker-based deployment
- Horizontal backend scaling
- Database monitoring and performance optimization
- Transactions or additional recovery mechanisms for more complex multi-step operations

---

## Current Status

The implementation includes:

- Dynamic competition data
- React Native competition details screen
- Competition registration
- Capacity management
- Time-based lifecycle validation
- Concurrent registration protection
- Video submission
- Submission validation
- Duplicate submission protection
- MongoDB persistence
- Reusable frontend components
- Local video playback

The project was developed as a functional full-stack implementation of the Feedants Competition Details assignment.
