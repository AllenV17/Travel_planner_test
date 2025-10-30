# Complete Setup Instructions - Travel Mitr

## 📋 Table of Contents
1. [System Requirements](#system-requirements)
2. [Step-by-Step Setup](#step-by-step-setup)
3. [Configuration](#configuration)
4. [Running the Application](#running-the-application)
5. [Verification](#verification)
6. [Troubleshooting](#troubleshooting)

---

## System Requirements

### Required Software:
- **Node.js**: Version 14.0.0 or higher
- **MySQL**: Version 5.7 or higher
- **npm**: Version 6.0.0 or higher (comes with Node.js)
- **Code Editor**: Visual Studio Code (recommended)

### Check Versions:
```bash
node --version    # Should show v14.0.0 or higher
npm --version     # Should show 6.0.0 or higher
mysql --version   # Should show 5.7 or higher
```

---

## Step-by-Step Setup

### Step 1: Clone/Download the Project

If you have the project files, navigate to the project directory:
```bash
cd Travel_planner
```

### Step 2: Install MySQL

#### On Windows:
1. Download MySQL Installer from https://dev.mysql.com/downloads/installer/
2. Run the installer
3. Select "Developer Default" setup type
4. Complete installation with root password

#### On Mac:
```bash
brew install mysql
brew services start mysql
```

#### On Linux (Ubuntu):
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo mysql_secure_installation
```

### Step 3: Create Database

Open MySQL Command Line or MySQL Workbench:

```sql
-- Create database
CREATE DATABASE travel_mitr;

-- Verify creation
SHOW DATABASES;

-- You should see 'travel_mitr' in the list
```

### Step 4: Configure Backend

1. Navigate to backend folder:
```bash
cd backend
```

2. Create `.env` file (copy from `.env.example` if exists):
```bash
# On Windows (PowerShell)
copy NUL .env

# On Mac/Linux
touch .env
```

3. Edit `.env` file and add:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=travel_mitr

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
```

**Important:** Replace `your_mysql_password` with your actual MySQL root password.

### Step 5: Install Backend Dependencies

In the backend directory:
```bash
npm install
```

This will install:
- express
- mysql2
- dotenv
- cors
- bcryptjs
- jsonwebtoken
- pdfkit

### Step 6: Configure Frontend

1. Navigate to frontend folder:
```bash
cd ../frontend
```

2. Install frontend dependencies:
```bash
npm install
```

This will install:
- react
- react-dom
- react-router-dom
- axios
- react-icons
- jspdf

### Step 7: Start the Backend Server

**Option A - Production Mode:**
```bash
cd backend
npm start
```

**Option B - Development Mode (with auto-reload):**
```bash
cd backend
npm run dev
```

You should see:
```
🚀 Server is running on port 5000
✅ MySQL database connected successfully
✅ Database tables created successfully
✅ Sample data seeded successfully
```

**Note:** The server automatically creates all tables and seeds sample data on first run.

### Step 8: Start the Frontend Server

Open a **new terminal window** (keep backend running):

```bash
cd frontend
npm start
```

This will:
1. Start the React development server
2. Open browser automatically at `http://localhost:3000`
3. Watch for file changes and hot-reload

---

## Configuration

### Database Configuration

Edit `backend/.env` to customize database settings:

```env
# Database
DB_HOST=localhost          # Database host
DB_USER=root              # MySQL username
DB_PASSWORD=your_password # MySQL password
DB_NAME=travel_mitr       # Database name
```

### Server Configuration

```env
# Server
PORT=5000                 # Backend port
JWT_SECRET=your_secret    # Change in production!
JWT_EXPIRE=7d            # Token expiration
```

### Frontend Configuration

The frontend proxies API requests to `http://localhost:5000` (configured in `package.json`).

---

## Running the Application

### Start Development Servers:

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### Access the Application:

Open browser: `http://localhost:3000`

### First-Time Setup:

1. The application opens to the login page
2. Click "Sign up" to create an account
3. Fill in the registration form
4. You'll be redirected to the dashboard
5. Start searching for routes!

---

## Verification

### Check Backend is Running:

1. Open browser: `http://localhost:5000/api/health`
2. Should see: `{"message":"Travel Mitr API is running"}`

### Check Database Tables:

```sql
USE travel_mitr;

SHOW TABLES;
-- Should show: User, Destination, TransportOption, RideFare, Trip

SELECT COUNT(*) FROM Destination;
-- Should return 8 (sample destinations)
```

### Check Frontend is Running:

1. Browser should open automatically
2. Should see login page
3. No console errors (open DevTools)

---

## Troubleshooting

### Problem: "Cannot connect to database"

**Solution:**
1. Check MySQL is running:
   ```bash
   # Windows
   services.msc → Find MySQL → Start
   
   # Mac/Linux
   mysqladmin -u root -p status
   ```

2. Verify credentials in `.env`:
   ```env
   DB_PASSWORD=your_actual_password
   ```

3. Test connection:
   ```bash
   mysql -u root -p
   ```

### Problem: "Port 5000 already in use"

**Solution:**
1. Find the process:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   
   # Mac/Linux
   lsof -i :5000
   ```

2. Kill the process or change PORT in `.env`

### Problem: "Port 3000 already in use"

**Solution:**
1. The React CLI will ask to use a different port
2. Type 'Y' to accept
3. Or find and kill the process on port 3000

### Problem: "Module not found"

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Problem: "Database tables not created"

**Solution:**
1. Check backend console for errors
2. Verify database exists: `SHOW DATABASES;`
3. Check MySQL user has CREATE privileges
4. Restart backend server

### Problem: "npm install fails"

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Try with verbose flag
npm install --verbose

# Or use different registry
npm install --registry https://registry.npmjs.org/
```

### Problem: "CORS errors in browser"

**Solution:**
- Verify backend CORS is enabled
- Check backend URL in frontend API service
- Ensure backend is running on port 5000

### Problem: "Authentication not working"

**Solution:**
1. Clear browser local storage
2. Check JWT_SECRET in `.env` is set
3. Verify token in browser console:
   ```javascript
   localStorage.getItem('token')
   ```

### Problem: "No data showing"

**Solution:**
1. Check backend console for errors
2. Verify database has data:
   ```sql
   SELECT * FROM Destination;
   ```
3. Restart backend server to re-seed data

---

## Production Deployment

### Backend:
1. Update `JWT_SECRET` to strong random string
2. Set proper `DB_PASSWORD`
3. Use process manager (PM2):
   ```bash
   npm install -g pm2
   pm2 start backend/server.js --name travel-mitr-backend
   ```

### Frontend:
1. Build for production:
   ```bash
   cd frontend
   npm run build
   ```
2. Serve build folder with nginx or similar

### Database:
1. Create separate production database
2. Use strong credentials
3. Enable SSL connections
4. Regular backups

---

## Quick Command Reference

```bash
# Start backend
cd backend && npm start

# Start frontend
cd frontend && npm start

# Check MySQL status
mysql -u root -p -e "SELECT 1"

# View database
mysql -u root -p
USE travel_mitr;
SHOW TABLES;

# Clear and reinstall
rm -rf node_modules package-lock.json && npm install
```

---

## Support

### Common Commands:

**Database:**
```sql
-- View users
SELECT * FROM User;

-- View trips
SELECT * FROM Trip;

-- View destinations
SELECT * FROM Destination;
```

**Backend:**
```bash
# View logs
tail -f backend/logs/app.log  # If logging enabled

# Test API
curl http://localhost:5000/api/health
```

**Frontend:**
```bash
# Check build
npm run build

# Test
npm test  # If tests exist
```

---

## Next Steps

After successful setup:

1. ✅ Create your first account
2. ✅ Search for routes
3. ✅ Explore the dashboard
4. ✅ Check trip history
5. ✅ Try different preferences
6. ✅ Export trips to PDF

See `TESTING_GUIDE.md` for comprehensive testing procedures.

---

**Setup Complete! 🎉**

If you encounter any issues not covered here, please check:
- README.md for general documentation
- QUICK_START.md for abbreviated guide
- TESTING_GUIDE.md for testing procedures

Happy coding! 🚀

