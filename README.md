# SkillBridge

A web-based platform connecting skilled volunteers with NGOs for meaningful volunteer opportunities.

## Features

### For Volunteers
- **User Registration & Profile Management**: Complete registration with skills, education, experience, and preferences
- **Opportunity Discovery**: Browse and search volunteer opportunities by category, location, skills, and more
- **Application Management**: Apply for opportunities and track application status
- **Skill-based Matching**: Get personalized recommendations based on skills and interests
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### For NGOs
- **Organization Registration**: Comprehensive NGO registration with verification details
- **Opportunity Management**: Post, edit, and manage volunteer opportunities
- **Application Review**: Review volunteer applications and manage selection process
- **Volunteer Coordination**: Track and communicate with accepted volunteers
- **Dashboard Analytics**: Monitor opportunity performance and volunteer engagement

## Technology Stack

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Validator** for input validation
- **CORS** for cross-origin requests

### Frontend
- **React 19** with functional components and hooks
- **Material-UI (MUI)** for responsive UI components
- **React Router** for navigation
- **React Hook Form** for form management
- **TanStack Query** for data fetching and caching
- **Axios** for HTTP requests

## Project Structure

```
SkillBridge/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts (Auth, etc.)
│   │   ├── pages/          # Page components
│   │   └── App.js          # Main app component
│   └── package.json
├── models/                 # MongoDB schemas
│   ├── User.js            # Volunteer model
│   ├── NGO.js             # NGO model
│   └── Opportunity.js     # Opportunity model
├── routes/                 # API routes
│   ├── auth.js            # Authentication routes
│   ├── users.js           # Volunteer routes
│   ├── ngos.js            # NGO routes
│   └── opportunities.js   # Opportunity routes
├── middleware/             # Custom middleware
│   └── auth.js            # Authentication middleware
├── server.js              # Express server setup
├── package.json           # Backend dependencies
└── .env                   # Environment variables
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SkillBridge
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/skillbridge
   JWT_SECRET=your_jwt_secret_key_here_change_in_production
   JWT_EXPIRE=30d
   ```

4. **Start MongoDB**
   - For local MongoDB: `mongod`
   - For MongoDB Atlas: Update MONGODB_URI with your connection string

5. **Start the backend server**
   ```bash
   npm run server
   ```
   The server will run on http://localhost:5000

### Frontend Setup

1. **Navigate to client directory**
   ```bash
   cd client
   ```

2. **Install frontend dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start the React development server**
   ```bash
   npm start
   ```
   The frontend will run on http://localhost:3000

### Running Both Servers Concurrently

From the root directory:
```bash
npm run dev
```

This will start both the backend and frontend servers simultaneously.

## API Endpoints

### Authentication
- `POST /api/auth/register/volunteer` - Register a new volunteer
- `POST /api/auth/register/ngo` - Register a new NGO
- `POST /api/auth/login` - Login user (volunteer or NGO)
- `GET /api/auth/me` - Get current user profile

### Volunteers
- `GET /api/users/profile` - Get volunteer profile
- `PUT /api/users/profile` - Update volunteer profile
- `POST /api/users/apply/:opportunityId` - Apply for opportunity
- `GET /api/users/applications` - Get user's applications
- `GET /api/users/recommendations` - Get recommended opportunities

### NGOs
- `GET /api/ngos/profile` - Get NGO profile
- `PUT /api/ngos/profile` - Update NGO profile
- `GET /api/ngos/opportunities` - Get NGO's opportunities
- `GET /api/ngos/applications` - Get applications for NGO's opportunities
- `PUT /api/ngos/applications/:applicationId/status` - Update application status

### Opportunities
- `GET /api/opportunities` - Get all opportunities (with filtering)
- `GET /api/opportunities/:id` - Get opportunity by ID
- `POST /api/opportunities` - Create new opportunity (NGO only)
- `PUT /api/opportunities/:id` - Update opportunity (NGO only)
- `DELETE /api/opportunities/:id` - Delete opportunity (NGO only)

## Key Features Implementation

### Authentication System
- JWT-based authentication for both volunteers and NGOs
- Role-based access control with middleware
- Secure password hashing with bcryptjs
- Protected routes on both frontend and backend

### User Registration
- Multi-step registration forms for both user types
- Comprehensive data collection (skills, education, experience for volunteers)
- Organization details and verification information for NGOs
- Form validation with React Hook Form and Express Validator

### Opportunity Management
- Rich opportunity creation with detailed requirements
- Skill-based filtering and search functionality
- Application deadline and volunteer capacity management
- Status tracking (Draft, Active, Paused, Completed, Cancelled)

### Responsive Design
- Mobile-first approach with Material-UI components
- Responsive navigation with drawer for mobile
- Adaptive layouts for different screen sizes
- Touch-friendly interface elements

## Database Schema

### User (Volunteer) Model
- Personal information (name, email, phone, address)
- Skills with proficiency levels
- Education and experience history
- Availability and preferred causes
- Application history

### NGO Model
- Organization details (name, registration, type)
- Contact information and address
- Mission, description, and focus areas
- Contact person details
- Verification status and documents

### Opportunity Model
- Basic information (title, description, category)
- Requirements (skills, education, experience)
- Location and time details
- Application management
- Benefits and compensation

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@skillbridge.org or create an issue in the repository.
