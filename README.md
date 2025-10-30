# Travel Mitr - Intelligent Travel Route and Fare Optimizer

An intelligent web-based system that provides optimized travel routes between destinations by comparing fares from multiple platforms (Uber, Ola, Rapido, etc.) and recommending the best route based on cost, time, and comfort preferences.

## 🚀 Features

- **User Authentication**: Secure registration and login system
- **Route Optimization**: Intelligent algorithm that considers cost, time, and comfort
- **Multi-Platform Comparison**: Compare fares from Uber, Ola, Rapido, and direct bookings
- **Customizable Preferences**: Adjust priority weights for cost, time, and comfort
- **Trip History**: Save and manage your travel plans
- **PDF Export**: Export trip details as PDF
- **Modern UI**: Beautiful, responsive design with gradient effects

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MySQL** database
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** enabled

### Frontend
- **React.js** with React Router
- **Axios** for API calls
- **React Icons** for UI icons
- **Modern CSS** with animations and responsive design

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v14 or higher)
2. **MySQL** (v5.7 or higher)
3. **npm** or **yarn**

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Travel_planner
```

### 2. Database Setup

1. Create a MySQL database:

```sql
CREATE DATABASE travel_mitr;
```

2. Update the database configuration in `backend/.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=travel_mitr
```

### 3. Backend Setup

```bash
cd backend
npm install
```

The backend will automatically create tables and seed sample data when you start the server.

### 4. Backend Configuration

Create a `.env` file in the `backend` directory (if not already created):

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=travel_mitr

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
```

### 5. Frontend Setup

```bash
cd frontend
npm install
```

### 6. Start the Application

**Terminal 1 - Backend Server:**
```bash
cd backend
npm start
# or for development with auto-reload
npm run dev
```

The backend will run on `http://localhost:5000`

**Terminal 2 - Frontend Server:**
```bash
cd frontend
npm start
```

The frontend will run on `http://localhost:3000` and automatically open in your browser.

## 📊 Database Schema

### Tables

1. **User** - Stores user information
2. **Destination** - Stores location details
3. **TransportOption** - Stores available transport modes and base costs
4. **RideFare** - Stores fare comparisons from different apps
5. **Trip** - Stores user's saved travel plans

### Sample Data

The application automatically seeds sample data including:
- Sample destinations (Airports, Railway Stations)
- Sample transport options (Cab, Auto, Bus)
- Sample ride fare comparisons (Uber, Ola, Rapido)

## 🔑 Usage

### 1. Register/Login

- Navigate to the login page
- Create an account or login with existing credentials

### 2. Search Route

- Enter source and destination
- Adjust optimization preferences (cost, time, comfort)
- Click "Find Best Route"

### 3. View Recommendations

- See the best recommended route
- Compare all available options
- View fare comparisons from different platforms

### 4. Save Trip

- Selected routes are automatically saved to trip history

### 5. Manage Trips

- View all saved trips in the History section
- Export trip details as PDF
- Delete unwanted trips

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Trips
- `GET /api/trips` - Get all trips for authenticated user
- `GET /api/trips/:tripId` - Get specific trip
- `POST /api/trips/optimize` - Optimize route and create trip
- `DELETE /api/trips/:tripId` - Delete trip

### Destinations
- `GET /api/destinations` - Get all destinations
- `GET /api/destinations/search?q=query` - Search destinations

## 🧮 Optimization Algorithm

The route optimization algorithm:

1. Fetches all available transport options between source and destination
2. Retrieves fare comparisons from multiple platforms
3. Normalizes cost, time, and comfort scores (0-100)
4. Calculates composite score based on user preferences:
   ```
   Score = (costWeight × costScore) + (timeWeight × timeScore) + (comfortWeight × comfortScore)
   ```
5. Recommends the option with the highest composite score

## 📁 Project Structure

```
Travel_planner/
├── backend/
│   ├── config/
│   │   └── database.js          # Database configuration
│   ├── models/
│   │   ├── user.model.js
│   │   ├── destination.model.js
│   │   ├── transport.model.js
│   │   ├── ridefare.model.js
│   │   └── trip.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── trip.routes.js
│   │   └── destination.routes.js
│   ├── middleware/
│   │   └── auth.middleware.js   # JWT verification
│   ├── server.js                # Main server file
│   ├── package.json
│   └── .env
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   ├── Dashboard/
│   │   │   ├── TripHistory/
│   │   │   ├── Profile/
│   │   │   └── Common/
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── README.md
└── README.md
```

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- Protected API routes
- SQL injection prevention with parameterized queries
- CORS configuration

## 🎨 Design Features

- Modern gradient design
- Responsive layout for all devices
- Smooth animations and transitions
- Intuitive user interface
- Visual feedback for all actions

## 🚀 Future Enhancements

- Real-time fare fetching from actual APIs
- Multiple route options (with connections)
- Map integration
- Weather-based recommendations
- Traffic information integration
- Email notifications
- Social sharing features

## 📝 Notes

- The current implementation uses simulated fare data
- For production, integrate with actual ride-hailing APIs
- Update JWT_SECRET in production environment
- Implement proper error logging
- Add unit and integration tests

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests.

## 📄 License

This project is open source and available for educational purposes.

## 👨‍💻 Author

Created as a mini project demonstrating MERN stack development with database optimization.

---

**Happy Traveling with Travel Mitr! 🚗✈️**

