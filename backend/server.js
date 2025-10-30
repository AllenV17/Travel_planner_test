const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pool = require('./config/database');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/trips', require('./routes/trip.routes'));
app.use('/api/destinations', require('./routes/destination.routes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Travel Mitr API is running' });
});

// Test database connection
async function testConnection() {
  try {
    await pool.execute('SELECT 1');
    console.log('✅ MySQL database connected successfully');
  } catch (error) {
    console.error('❌ MySQL connection error:', error.message);
  }
}

// Create database tables
async function createTables() {
  try {
    // User table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS User (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Destination table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS Destination (
        dest_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        state VARCHAR(50) NOT NULL,
        city VARCHAR(50) NOT NULL,
        pincode VARCHAR(10) NOT NULL
      )
    `);

    // TransportOption table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS TransportOption (
        trans_id INT AUTO_INCREMENT PRIMARY KEY,
        source_id INT NOT NULL,
        dest_id INT NOT NULL,
        mode VARCHAR(50) NOT NULL,
        base_cost DECIMAL(10, 2) NOT NULL,
        duration INT NOT NULL,
        comfort_level INT NOT NULL,
        FOREIGN KEY (source_id) REFERENCES Destination(dest_id),
        FOREIGN KEY (dest_id) REFERENCES Destination(dest_id)
      )
    `);

    // RideFare table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS RideFare (
        ride_id INT AUTO_INCREMENT PRIMARY KEY,
        trans_id INT NOT NULL,
        app_name VARCHAR(50) NOT NULL,
        fare DECIMAL(10, 2) NOT NULL,
        estimated_time INT NOT NULL,
        FOREIGN KEY (trans_id) REFERENCES TransportOption(trans_id)
      )
    `);

    // Trip table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS Trip (
        trip_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        source_id INT NOT NULL,
        dest_id INT NOT NULL,
        selected_mode VARCHAR(50) NOT NULL,
        total_cost DECIMAL(10, 2) NOT NULL,
        total_duration INT NOT NULL,
        comfort_score INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES User(user_id),
        FOREIGN KEY (source_id) REFERENCES Destination(dest_id),
        FOREIGN KEY (dest_id) REFERENCES Destination(dest_id)
      )
    `);

    console.log('✅ Database tables created successfully');
  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
  }
}

// Seed initial data
async function seedData() {
  try {
    // Check if data already exists
    const [destinations] = await pool.execute('SELECT COUNT(*) as count FROM Destination');
    if (destinations[0].count > 0) {
      console.log('✅ Sample data already exists');
      return;
    }

    // Insert sample destinations
    await pool.execute(`
      INSERT INTO Destination (name, state, city, pincode) VALUES
      ('Mumbai Airport', 'Maharashtra', 'Mumbai', '400099'),
      ('Delhi Airport', 'Delhi', 'New Delhi', '110037'),
      ('Mumbai Central', 'Maharashtra', 'Mumbai', '400008'),
      ('Delhi Railway Station', 'Delhi', 'New Delhi', '110006'),
      ('Bangalore Airport', 'Karnataka', 'Bangalore', '560300'),
      ('Bangalore City', 'Karnataka', 'Bangalore', '560001'),
      ('Pune Airport', 'Maharashtra', 'Pune', '411032'),
      ('Pune Station', 'Maharashtra', 'Pune', '411001')
    `);

    // Get all destinations by name for reliable lookups
    const [allDests] = await pool.execute('SELECT dest_id, name FROM Destination');
    
    // Create lookup map
    const destMap = {};
    allDests.forEach(d => {
      destMap[d.name] = d.dest_id;
    });

    // Insert sample transport options for multiple routes
    const routes = [
      // Mumbai Airport to Mumbai Central
      { source: 'Mumbai Airport', dest: 'Mumbai Central', options: [
        { mode: 'Cab', base_cost: 500.00, duration: 45, comfort: 8 },
        { mode: 'Auto', base_cost: 200.00, duration: 60, comfort: 4 },
        { mode: 'Bus', base_cost: 150.00, duration: 75, comfort: 5 }
      ]},
      // Delhi Airport to Delhi Railway Station
      { source: 'Delhi Airport', dest: 'Delhi Railway Station', options: [
        { mode: 'Cab', base_cost: 450.00, duration: 40, comfort: 8 },
        { mode: 'Auto', base_cost: 180.00, duration: 55, comfort: 4 },
        { mode: 'Bus', base_cost: 130.00, duration: 70, comfort: 5 }
      ]},
      // Bangalore Airport to Bangalore City
      { source: 'Bangalore Airport', dest: 'Bangalore City', options: [
        { mode: 'Cab', base_cost: 600.00, duration: 50, comfort: 8 },
        { mode: 'Auto', base_cost: 250.00, duration: 65, comfort: 4 },
        { mode: 'Bus', base_cost: 180.00, duration: 80, comfort: 5 }
      ]},
      // Pune Airport to Pune Station
      { source: 'Pune Airport', dest: 'Pune Station', options: [
        { mode: 'Cab', base_cost: 480.00, duration: 42, comfort: 8 },
        { mode: 'Auto', base_cost: 190.00, duration: 58, comfort: 4 },
        { mode: 'Bus', base_cost: 140.00, duration: 72, comfort: 5 }
      ]},
      // Mumbai Central to Delhi Airport
      { source: 'Mumbai Central', dest: 'Delhi Airport', options: [
        { mode: 'Train', base_cost: 1800.00, duration: 960, comfort: 7 },
        { mode: 'Flight', base_cost: 4500.00, duration: 120, comfort: 9 },
        { mode: 'Bus', base_cost: 1200.00, duration: 1200, comfort: 5 }
      ]},
      // Mumbai Airport to Delhi Railway Station
      { source: 'Mumbai Airport', dest: 'Delhi Railway Station', options: [
        { mode: 'Flight', base_cost: 4200.00, duration: 150, comfort: 9 },
        { mode: 'Train', base_cost: 1600.00, duration: 1020, comfort: 7 },
        { mode: 'Bus', base_cost: 1100.00, duration: 1260, comfort: 5 }
      ]},
      // Bangalore Airport to Pune Airport
      { source: 'Bangalore Airport', dest: 'Pune Airport', options: [
        { mode: 'Flight', base_cost: 3800.00, duration: 90, comfort: 9 },
        { mode: 'Train', base_cost: 1500.00, duration: 840, comfort: 7 },
        { mode: 'Bus', base_cost: 900.00, duration: 960, comfort: 5 }
      ]}
    ];

    for (const route of routes) {
      const sourceId = destMap[route.source];
      const destId = destMap[route.dest];
      
      if (sourceId && destId) {
        for (const option of route.options) {
          await pool.execute(
            'INSERT INTO TransportOption (source_id, dest_id, mode, base_cost, duration, comfort_level) VALUES (?, ?, ?, ?, ?, ?)',
            [sourceId, destId, option.mode, option.base_cost, option.duration, option.comfort]
          );
        }
      }
    }

    // Insert sample ride fares for all Cab transport options
    const [cabTransports] = await pool.execute(`
      SELECT t.trans_id, t.source_id, t.dest_id 
      FROM TransportOption t 
      WHERE t.mode = "Cab"
    `);
    
    for (const trans of cabTransports) {
      // Get source and destination for context
      const [sourceData] = await pool.execute('SELECT name FROM Destination WHERE dest_id = ?', [trans.source_id]);
      const [destData] = await pool.execute('SELECT name FROM Destination WHERE dest_id = ?', [trans.dest_id]);
      const source = sourceData[0].name;
      const dest = destData[0].name;
      
      // Set different fares based on route distance/type
      let fares = {};
      if (source.includes('Mumbai') && dest.includes('Mumbai')) {
        fares = { uber: 550, ola: 520, rapido: 480 };
      } else if (source.includes('Delhi') && dest.includes('Delhi')) {
        fares = { uber: 500, ola: 470, rapido: 440 };
      } else if (source.includes('Bangalore') && dest.includes('Bangalore')) {
        fares = { uber: 650, ola: 620, rapido: 580 };
      } else if (source.includes('Pune') && dest.includes('Pune')) {
        fares = { uber: 530, ola: 500, rapido: 460 };
      } else {
        // Default fares
        fares = { uber: 550, ola: 520, rapido: 480 };
      }
      
      await pool.execute(`
        INSERT INTO RideFare (trans_id, app_name, fare, estimated_time) VALUES
        (?, 'Uber', ?, ?),
        (?, 'Ola', ?, ?),
        (?, 'Rapido', ?, ?)
      `, [
        trans.trans_id, fares.uber, 45,
        trans.trans_id, fares.ola, 50,
        trans.trans_id, fares.rapido, 55
      ]);
    }

    console.log('✅ Sample data seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding data:', error.message);
  }
}

// Initialize server
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  await testConnection();
  await createTables();
  await seedData();
});

module.exports = app;

