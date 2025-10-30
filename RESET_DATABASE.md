# 🔄 How to Reset and Reload Database

## If you're getting "server error" or "no transport options available"

The backend server automatically seeds data when it starts. If you're having issues, follow these steps:

---

## Quick Reset Method (RECOMMENDED - EASIEST!) ⚡

### Option A: Use the Reset Script (EASIEST!)

**Just run this one command:**

```bash
cd backend
node reset-and-reseed.js
```

That's it! The script will:
- ✅ Clear all existing data
- ✅ Reseed all destinations
- ✅ Add all 21 transport options
- ✅ Add ride fare comparisons
- ✅ Verify everything worked

**You should see:**
```
✅ Database reseeded successfully!
Destinations: 8
Transport Options: 21
Ride Fares: 12
```

---

### Option B: Manual Reset

### Step 1: Stop the Backend Server
Press `Ctrl+C` in the terminal where backend is running

### Step 2: Clear Database Tables

Open MySQL and run these commands:

```sql
-- Connect to database
USE travel_mitr;

-- Clear all data (keeps table structure)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE Trip;
TRUNCATE TABLE RideFare;
TRUNCATE TABLE TransportOption;
TRUNCATE TABLE Destination;
TRUNCATE TABLE User;
SET FOREIGN_KEY_CHECKS = 1;

-- Verify tables are empty
SELECT 'Destinations' as Table, COUNT(*) as Count FROM Destination
UNION ALL SELECT 'Transport', COUNT(*) FROM TransportOption
UNION ALL SELECT 'RideFare', COUNT(*) FROM RideFare;
```

### Step 3: Restart Backend Server

```bash
cd backend
npm start
```

You should see:
```
✅ Sample data seeded successfully
```

### Step 4: Verify Data

Run the verification script:
```bash
mysql -u root -p travel_mitr < database_setup.sql
```

Or check manually:
```sql
SELECT * FROM Destination;
SELECT * FROM TransportOption;
SELECT * FROM RideFare;
```

---

## Complete Reset Method (Nuclear Option)

If the above doesn't work, start completely fresh:

### Step 1: Drop and Recreate Database

```sql
DROP DATABASE IF EXISTS travel_mitr;
CREATE DATABASE travel_mitr;
```

### Step 2: Update .env File

Make sure your `.env` file in the `backend` folder has:
```
DB_NAME=travel_mitr
```

### Step 3: Restart Backend

The server will automatically:
1. Create all tables
2. Seed destinations
3. Seed transport options
4. Seed ride fares

```bash
cd backend
npm start
```

---

## Troubleshooting Specific Errors

### Error: "No transport options available for this route"

**Cause:** Database doesn't have data for that route

**Solution:** 
1. Check which destinations exist: `SELECT * FROM Destination;`
2. Check which routes have data: `SELECT * FROM TransportOption;`
3. If data is missing, restart backend to re-seed

### Error: "Cannot read property 'dest_id' of undefined"

**Cause:** Destination lookup failed

**Solution:**
1. Verify destination exists: `SELECT * FROM Destination WHERE name = 'Mumbai Airport';`
2. Check for typos in destination names
3. Re-seed database

### Error: "Connection refused" or "Access denied"

**Cause:** MySQL connection issues

**Solution:**
1. Check MySQL is running: `mysql -u root -p`
2. Verify `.env` credentials
3. Check database exists: `SHOW DATABASES;`

---

## Current Sample Routes

After seeding, you should have routes for:

1. ✅ Mumbai Airport → Mumbai Central (Cab, Auto, Bus)
2. ✅ Delhi Airport → Delhi Railway Station (Cab, Auto, Bus)
3. ✅ Bangalore Airport → Bangalore City (Cab, Auto, Bus)
4. ✅ Pune Airport → Pune Station (Cab, Auto, Bus)
5. ✅ Mumbai Central → Delhi Airport (Train, Flight, Bus)
6. ✅ Mumbai Airport → Delhi Railway Station (Flight, Train, Bus)
7. ✅ Bangalore Airport → Pune Airport (Flight, Train, Bus)

Each Cab route has 3 ride options: Uber, Ola, Rapido

---

## Manual Data Check

### Check Destinations
```sql
SELECT dest_id, name, city, state FROM Destination;
```

### Check Specific Route
```sql
-- Example: Mumbai Airport to Mumbai Central
SELECT 
    t.mode,
    t.base_cost,
    t.duration,
    t.comfort_level
FROM TransportOption t
JOIN Destination s ON t.source_id = s.dest_id
JOIN Destination d ON t.dest_id = d.dest_id
WHERE s.name = 'Mumbai Airport' 
  AND d.name = 'Mumbai Central';
```

### Check Ride Fares
```sql
SELECT 
    r.app_name,
    r.fare,
    r.estimated_time
FROM RideFare r
JOIN TransportOption t ON r.trans_id = t.trans_id
JOIN Destination s ON t.source_id = s.dest_id
WHERE s.name = 'Mumbai Airport'
  AND t.mode = 'Cab';
```

---

## Still Having Issues?

1. Check backend console for errors
2. Verify MySQL user has CREATE/DROP privileges
3. Check `.env` file has correct database name
4. Make sure no other processes are using the database
5. Try the complete reset method above

---

## Quick Commands Reference

```bash
# Connect to MySQL
mysql -u root -p

# Use database
USE travel_mitr;

# Check tables exist
SHOW TABLES;

# Count records
SELECT COUNT(*) FROM Destination;
SELECT COUNT(*) FROM TransportOption;
SELECT COUNT(*) FROM RideFare;

# Clear and restart (keeps structure)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE Trip;
TRUNCATE TABLE RideFare;
TRUNCATE TABLE TransportOption;
TRUNCATE TABLE Destination;
SET FOREIGN_KEY_CHECKS = 1;

# Exit MySQL
EXIT;
```

---

**Pro Tip:** Keep the backend console visible to see seeding messages. If you see "✅ Sample data seeded successfully", the data is loaded!

