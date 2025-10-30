# Testing Guide - Travel Mitr

## 🧪 How to Test the Application

### Pre-requisites
1. MySQL database `travel_mitr` is created
2. Backend server is running on port 5000
3. Frontend server is running on port 3000

---

## Test Case 1: User Registration

### Steps:
1. Open `http://localhost:3000`
2. Click "Sign up" link
3. Fill in the form:
   - Name: Test User
   - Email: test@example.com
   - Phone: 9876543210
   - Password: password123
4. Click "Sign Up"

### Expected Result:
- ✅ Successfully redirects to dashboard
- ✅ Shows user's name in navbar
- ✅ No errors displayed

### Test Database:
```sql
SELECT * FROM User WHERE email = 'test@example.com';
```
Should return the newly created user.

---

## Test Case 2: User Login

### Steps:
1. Logout if logged in
2. Click "Login"
3. Enter:
   - Email: test@example.com
   - Password: password123
4. Click "Login"

### Expected Result:
- ✅ Successfully logs in
- ✅ Redirects to dashboard
- ✅ Shows welcome message

---

## Test Case 3: Search and Optimize Route

### Steps:
1. On the dashboard, enter:
   - From: "Mumbai" (select Mumbai Airport)
   - To: "Mumbai Central" (select Mumbai Central)
2. Adjust preferences if needed
3. Click "Find Best Route"

### Expected Result:
- ✅ Shows recommendation card
- ✅ Displays best option with highlighting
- ✅ Shows all available options
- ✅ Displays cost, duration, comfort scores
- ✅ Shows fare comparisons from different apps

### Test API:
```bash
curl -X POST http://localhost:5000/api/trips/optimize \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "source_id": 1,
    "dest_id": 3,
    "cost_weight": 0.4,
    "time_weight": 0.3,
    "comfort_weight": 0.3
  }'
```

---

## Test Case 4: View Trip History

### Steps:
1. Complete at least one route optimization
2. Click "History" in the navbar
3. View the list of trips

### Expected Result:
- ✅ Shows all saved trips
- ✅ Displays source and destination
- ✅ Shows date and time
- ✅ Shows cost, duration, mode

### Test Database:
```sql
SELECT t.*, s.name as source, d.name as destination 
FROM Trip t
JOIN Destination s ON t.source_id = s.dest_id
JOIN Destination d ON t.dest_id = d.dest_id
WHERE t.user_id = 1
ORDER BY t.created_at DESC;
```

---

## Test Case 5: Export Trip to PDF

### Steps:
1. Go to Trip History
2. Click the PDF icon on any trip
3. Check the print dialog

### Expected Result:
- ✅ Opens print preview
- ✅ Shows trip details
- ✅ Formatted nicely
- ✅ Includes all information

---

## Test Case 6: Delete Trip

### Steps:
1. Go to Trip History
2. Click the trash icon on any trip
3. Confirm deletion

### Expected Result:
- ✅ Trip is removed from list
- ✅ Shows confirmation message
- ✅ Database updated

### Test Database:
```sql
SELECT COUNT(*) FROM Trip WHERE trip_id = DELETED_ID;
```
Should return 0.

---

## Test Case 7: Search Destinations

### Steps:
1. On dashboard, start typing in "From" field
2. Type "Mumbai"
3. Type "Delhi"

### Expected Result:
- ✅ Shows dropdown with matching results
- ✅ Displays destination name and location
- ✅ Clicking selects the destination
- ✅ Dropdown closes after selection

---

## Test Case 8: Adjust Optimization Preferences

### Steps:
1. On dashboard, adjust the sliders:
   - Cost Priority: 60%
   - Time Priority: 30%
   - Comfort Priority: 10%
2. Note that other sliders adjust automatically
3. Search for a route

### Expected Result:
- ✅ Sliders update correctly
- ✅ Weights add up to 100%
- ✅ Different recommendation based on weights
- ✅ Score calculation reflects preferences

---

## Test Case 9: Multiple Optimization Options

### Steps:
1. Search for Mumbai Airport to Mumbai Central
2. Review all displayed options

### Expected Result:
- ✅ Shows Cab, Auto, Bus options
- ✅ Each shows different apps (Uber, Ola, Rapido)
- ✅ Highlights cheapest option
- ✅ Shows composite scores

---

## Test Case 10: Profile Management

### Steps:
1. Click "Profile" in navbar
2. View profile information
3. Click "Edit Profile"
4. Update name or phone
5. Save changes

### Expected Result:
- ✅ Displays current user info
- ✅ Shows avatar with initial
- ✅ Edit mode enables input fields
- ✅ Save updates profile (demo)

---

## Test Case 11: Invalid Login Attempt

### Steps:
1. Try to login with:
   - Wrong email
   - Wrong password
   - Non-existent user

### Expected Result:
- ✅ Shows error message
- ✅ Does not login
- ✅ Stays on login page

---

## Test Case 12: Same Source and Destination

### Steps:
1. On dashboard, select same location for:
   - From: Mumbai Airport
   - To: Mumbai Airport
2. Try to optimize

### Expected Result:
- ✅ Shows error message
- ✅ Prevents search
- ✅ Suggests different destinations

---

## Database Verification Tests

### Check Sample Data:

```sql
-- Check destinations
SELECT * FROM Destination;
-- Should show 8 destinations

-- Check transport options
SELECT * FROM TransportOption;
-- Should show multiple options

-- Check ride fares
SELECT * FROM RideFare;
-- Should show comparisons from Uber, Ola, Rapido

-- Check users
SELECT * FROM User;
-- Should show registered users

-- Check trips
SELECT COUNT(*) FROM Trip;
-- Should show number of saved trips
```

---

## API Testing with Postman/curl

### Test Registration:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "API Test User",
    "email": "apitest@example.com",
    "password": "testpassword",
    "phone": "1234567890"
  }'
```

### Test Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "apitest@example.com",
    "password": "testpassword"
  }'
```

### Test Get Destinations:
```bash
curl -X GET http://localhost:5000/api/destinations \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test Search Destinations:
```bash
curl -X GET "http://localhost:5000/api/destinations/search?q=mumbai" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## UI/UX Testing

### Responsive Design:
- ✅ Test on desktop (1920x1080)
- ✅ Test on tablet (768x1024)
- ✅ Test on mobile (375x667)

### Browser Compatibility:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

### Visual Elements:
- ✅ Gradient backgrounds render properly
- ✅ Buttons have hover effects
- ✅ Cards have shadows
- ✅ Animations are smooth
- ✅ Icons display correctly

---

## Performance Testing

### Load Test:
1. Create 10 user accounts
2. Each user searches 5 routes
3. Check response times
4. Verify database performance

### Expected:
- ✅ Page load < 2 seconds
- ✅ API response < 500ms
- ✅ No memory leaks
- ✅ Efficient queries

---

## Security Testing

### Password Security:
- ✅ Passwords are hashed in database
- ✅ Plain passwords never stored
- ✅ JWT tokens required for protected routes

### SQL Injection Prevention:
- ✅ Use parameterized queries
- ✅ No raw SQL concatenation
- ✅ Test with malicious input

### XSS Prevention:
- ✅ Input sanitization
- ✅ React escapes by default
- ✅ No eval() usage

---

## Error Handling Tests

### Network Errors:
- ✅ Backend not running
- ✅ Database connection failed
- ✅ Invalid credentials

### Expected:
- ✅ Clear error messages
- ✅ Graceful degradation
- ✅ User-friendly feedback

---

## Success Criteria

All tests should pass with:
- ✅ No console errors
- ✅ No database errors
- ✅ Smooth user experience
- ✅ All features functional
- ✅ Proper error handling
- ✅ Responsive design

---

## Additional Test Scenarios

### Edge Cases:
1. Very long destination names
2. Special characters in search
3. Empty search results
4. Database timeout
5. Token expiration during use

### Integration Tests:
1. Complete user flow (register → login → search → save → view)
2. Multiple simultaneous users
3. Data consistency checks

---

## Test Report Template

```
Date: _______________
Tester: _______________

Test Cases:
[ ] User Registration
[ ] User Login
[ ] Route Optimization
[ ] Trip History
[ ] PDF Export
[ ] Delete Trip
[ ] Search Destinations
[ ] Profile Management
[ ] Responsive Design

Issues Found:
1. _________________
2. _________________

Overall Status: Pass / Fail
```

---

**Happy Testing! 🧪**

