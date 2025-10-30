# ✅ Setup Checklist for Travel Mitr

## What You Need to Do

### Step 1: Install Requirements ✅
- [ ] Node.js installed (check with: `node --version`)
- [ ] MySQL installed (check with: `mysql --version`)

### Step 2: Create MySQL Database
- [ ] Open MySQL Command Line or MySQL Workbench
- [ ] Run: `CREATE DATABASE travel_mitr;`
- [ ] Verify: `SHOW DATABASES;`

### Step 3: Create Backend .env File ⚠️ **YOU NEED TO DO THIS**
- [ ] Go to `backend` folder
- [ ] Create a new file named `.env` (not .txt!)
- [ ] Open `backend/ENV_INSTRUCTIONS.txt` to see what to paste
- [ ] Add your MySQL password if you have one

**Quick Content for .env:**
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=travel_mitr

JWT_SECRET=travel_mitr_super_secret_jwt_key_2024
JWT_EXPIRE=7d
```

### Step 4: Install Dependencies
- [ ] Open terminal in `backend` folder
- [ ] Run: `npm install`
- [ ] Wait for installation to complete

- [ ] Open terminal in `frontend` folder
- [ ] Run: `npm install`
- [ ] Wait for installation to complete

### Step 5: Start Backend Server
- [ ] In `backend` folder terminal
- [ ] Run: `npm start`
- [ ] Should see: "🚀 Server is running on port 5000"
- [ ] Should see: "✅ MySQL database connected successfully"
- [ ] Should see: "✅ Database tables created successfully"
- [ ] Should see: "✅ Sample data seeded successfully"

### Step 6: Start Frontend Server
- [ ] Open NEW terminal window/tab
- [ ] Navigate to `frontend` folder
- [ ] Run: `npm start`
- [ ] Browser should open automatically at `http://localhost:3000`

### Step 7: Test the Application
- [ ] See login page in browser
- [ ] Click "Sign up"
- [ ] Create an account
- [ ] Try searching for routes
- [ ] Explore the dashboard

## Troubleshooting

### If backend won't start:
- [ ] Check MySQL is running
- [ ] Check .env file exists and has correct password
- [ ] Check database `travel_mitr` exists

### If frontend won't start:
- [ ] Make sure backend is running first
- [ ] Check port 3000 is available
- [ ] Try running `npm install` again

### If no data showing:
- [ ] Restart backend server (it seeds data on startup)

## Summary

**YOU MUST CREATE THESE:**
1. ✅ MySQL database `travel_mitr`
2. ✅ Backend `.env` file

**EVERYTHING ELSE IS AUTOMATIC:**
- Database tables are created automatically
- Sample data is loaded automatically
- Frontend connects automatically

## Quick Commands

```bash
# Check if Node.js installed
node --version

# Check if MySQL installed
mysql --version

# Create database
mysql -u root -p
CREATE DATABASE travel_mitr;
EXIT;

# Install backend
cd backend
npm install
npm start

# Install frontend (new terminal)
cd frontend
npm install
npm start
```

## Need Help?

See other documentation files:
- `START_HERE.md` - Quick overview
- `QUICK_START.md` - 5-minute setup
- `SETUP_INSTRUCTIONS.md` - Detailed guide
- `README.md` - Full documentation

