# Feedants Competition Details – Full Stack Assignment

A functional full-stack implementation of the Feedants Competition Details screen.

The project includes a React Native frontend, Node.js + Express backend, and MongoDB database with support for competition registration, participant limits, time-based states, and video submissions.

---

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

### Database
- MongoDB

---

## Features

### Competition Details
- Dynamic competition information
- Prize pool
- Entry fee
- Participant limit
- Remaining spots
- Registration progress
- Judge information
- Previous winners
- Rewards
- Rules and judging parameters
- Important competition dates

### Registration
- Dynamic registration state
- Register for a competition
- Prevent duplicate registrations
- Registration start and end validation
- Prevent registration when competition is full
- Atomic participant-slot reservation
- Protection against inconsistent participant counts

### Submission
- Video file upload
- Maximum file size of 50 MB
- Video MIME type validation
- Submission start/end validation
- Submission requires prior registration
- Prevent duplicate submissions
- Uploaded video can be viewed from the application

### Time-dependent States
The application dynamically handles:

- Registration not started
- Registration open
- Registration closed
- Competition full
- Submission not started
- Submission open
- Submission closed
- Submission already uploaded

---

## Project Structure

```text
FeedantsAssignment/
│
├── mobile/
│   ├── src/
│   │   ├── app/
│   │   │   └── index.tsx
│   │   ├── components/
│   │   │   ├── CompetitionStats.tsx
│   │   │   ├── ImportantDates.tsx
│   │   │   └── JudgeCard.tsx
│   │   ├── constants/
│   │   └── hooks/
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── seed/
│   │   └── app.js
│   ├── uploads/
│   └── package.json
│
└── README.md