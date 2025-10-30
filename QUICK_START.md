# Quick Start Guide - Travel Mitr

## 🚀 Get Started in 5 Minutes

### Prerequisites Check

Ensure you have installed:
- ✅ Node.js (v14+)
- ✅ MySQL (v5.7+)
- ✅ npm or yarn

### Step 1: Database Setup (2 minutes)

Open MySQL command line or MySQL Workbench and run:

```sql
CREATE DATABASE travel_mitr;
```

### Step 2: Configure Backend (1 minute)

Navigate to backend folder and create/edit `.env` file:

```bash
cd backend
```

Create `.env` file with:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=travel_mitr

JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
```

**Important:** Replace `your_password_here` with your actual MySQL password (or leave empty if no password).

### Step 3: Install Dependencies (1 minute)

**Backend:**
```bash
cd backend
npm install
```

**Frontend (in a new terminal):**
```bash
cd frontend
npm install
```

### Step 4: Start the Application (1 minute)

**Terminal 1 - Start Backend:**
```bash
cd backend
npm start
```

You should see:
```
🚀 Server is running on port 5000
✅ MySQL database connected successfully
✅ Database tables created successfully
✅ Sample data seeded successfully
```

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm start
```

The browser should automatically open at `http://localhost:3000`

### Step 5: Test the Application

1. Click "Sign up" to create an account
2. Enter your details and register
3. You'll be redirected to the dashboard
4. Search for a route (e.g., "Mumbai" to "Delhi")
5. Click "Find Best Route"
6. See the recommendations!

## 🎯 Default Test Accounts

You can create any account. Sample destinations are pre-loaded:
- Mumbai Airport
- Delhi Airport
- Bangalore Airport
- And more...

## 🔧 Troubleshooting

### Backend won't start
- Check if MySQL is running: `mysql -u root -p`
- Verify database exists: `SHOW DATABASES;`
- Check `.env` file credentials

### Frontend won't start
- Make sure backend is running first
- Check if port 3000 is available
- Run `npm install` again if dependencies are missing

### Database connection error
- Verify MySQL service is running
- Check username and password in `.env`
- Ensure database `travel_mitr` exists

### No data showing
- Backend automatically seeds data on first run
- If no data appears, restart backend server
- Check browser console for errors

## 📋 Default Sample Data

The system automatically creates:
- 8 sample destinations (airports, stations)
- Multiple transport options (Cabs, Autos, Buses)
- Ride fare comparisons (Uber, Ola, Rapido)

## 🎨 What to Expect

1. **Dashboard:** Beautiful gradient design with route search
2. **Recommendation Card:** Highlights the best option
3. **All Options:** Shows complete comparison
4. **History:** Saves all your trips
5. **Profile:** Manage your account

## 📝 Next Steps

- Try different source/destination combinations
- Adjust optimization preferences (cost, time, comfort)
- Export trips as PDF
- View trip history

---

**Need Help?** Check the main README.md for detailed documentation.

Happy Traveling! 🚗✈️

