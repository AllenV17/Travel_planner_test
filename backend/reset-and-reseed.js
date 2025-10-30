const pool = require('./config/database');

async function resetAndReseed() {
  try {
    console.log('=== Resetting and Reseeding Database ===\n');
    
    // Step 1: Clear existing data
    console.log('1. Clearing existing data...');
    await pool.execute('SET FOREIGN_KEY_CHECKS = 0');
    await pool.execute('TRUNCATE TABLE Trip');
    await pool.execute('TRUNCATE TABLE RideFare');
    await pool.execute('TRUNCATE TABLE TransportOption');
    await pool.execute('TRUNCATE TABLE Destination');
    await pool.execute('TRUNCATE TABLE User');
    await pool.execute('SET FOREIGN_KEY_CHECKS = 1');
    console.log('✅ All tables cleared\n');
    
    // Step 2: Insert destinations
    console.log('2. Inserting destinations...');
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
    console.log('✅ 8 destinations inserted\n');
    
    // Step 3: Get destinations
    const [allDests] = await pool.execute('SELECT dest_id, name FROM Destination');
    const destMap = {};
    allDests.forEach(d => { destMap[d.name] = d.dest_id; });
    
    // Step 4: Insert transport options
    console.log('3. Inserting transport options...');
    const routes = [
      { source: 'Mumbai Airport', dest: 'Mumbai Central', options: [
        { mode: 'Cab', base_cost: 500.00, duration: 45, comfort: 8 },
        { mode: 'Auto', base_cost: 200.00, duration: 60, comfort: 4 },
        { mode: 'Bus', base_cost: 150.00, duration: 75, comfort: 5 }
      ]},
      { source: 'Delhi Airport', dest: 'Delhi Railway Station', options: [
        { mode: 'Cab', base_cost: 450.00, duration: 40, comfort: 8 },
        { mode: 'Auto', base_cost: 180.00, duration: 55, comfort: 4 },
        { mode: 'Bus', base_cost: 130.00, duration: 70, comfort: 5 }
      ]},
      { source: 'Bangalore Airport', dest: 'Bangalore City', options: [
        { mode: 'Cab', base_cost: 600.00, duration: 50, comfort: 8 },
        { mode: 'Auto', base_cost: 250.00, duration: 65, comfort: 4 },
        { mode: 'Bus', base_cost: 180.00, duration: 80, comfort: 5 }
      ]},
      { source: 'Pune Airport', dest: 'Pune Station', options: [
        { mode: 'Cab', base_cost: 480.00, duration: 42, comfort: 8 },
        { mode: 'Auto', base_cost: 190.00, duration: 58, comfort: 4 },
        { mode: 'Bus', base_cost: 140.00, duration: 72, comfort: 5 }
      ]},
      { source: 'Mumbai Central', dest: 'Delhi Airport', options: [
        { mode: 'Train', base_cost: 1800.00, duration: 960, comfort: 7 },
        { mode: 'Flight', base_cost: 4500.00, duration: 120, comfort: 9 },
        { mode: 'Bus', base_cost: 1200.00, duration: 1200, comfort: 5 }
      ]},
      { source: 'Mumbai Airport', dest: 'Delhi Railway Station', options: [
        { mode: 'Flight', base_cost: 4200.00, duration: 150, comfort: 9 },
        { mode: 'Train', base_cost: 1600.00, duration: 1020, comfort: 7 },
        { mode: 'Bus', base_cost: 1100.00, duration: 1260, comfort: 5 }
      ]},
      { source: 'Bangalore Airport', dest: 'Pune Airport', options: [
        { mode: 'Flight', base_cost: 3800.00, duration: 90, comfort: 9 },
        { mode: 'Train', base_cost: 1500.00, duration: 840, comfort: 7 },
        { mode: 'Bus', base_cost: 900.00, duration: 960, comfort: 5 }
      ]}
    ];
    
    let routeCount = 0;
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
        routeCount++;
      }
    }
    console.log(`✅ ${routeCount} routes with ${routes.reduce((sum, r) => sum + r.options.length, 0)} transport options inserted\n`);
    
    // Step 5: Insert ride fares for Cab routes
    console.log('4. Inserting ride fares...');
    const [cabTransports] = await pool.execute(`
      SELECT t.trans_id, t.source_id, t.dest_id 
      FROM TransportOption t 
      WHERE t.mode = "Cab"
    `);
    
    for (const trans of cabTransports) {
      const [sourceData] = await pool.execute('SELECT name FROM Destination WHERE dest_id = ?', [trans.source_id]);
      const [destData] = await pool.execute('SELECT name FROM Destination WHERE dest_id = ?', [trans.dest_id]);
      const source = sourceData[0].name;
      const dest = destData[0].name;
      
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
    console.log(`✅ Ride fares inserted for ${cabTransports.length} Cab routes\n`);
    
    // Step 6: Verify
    console.log('=== Verification ===');
    const [destCount] = await pool.execute('SELECT COUNT(*) as count FROM Destination');
    const [transCount] = await pool.execute('SELECT COUNT(*) as count FROM TransportOption');
    const [fareCount] = await pool.execute('SELECT COUNT(*) as count FROM RideFare');
    
    console.log(`Destinations: ${destCount[0].count}`);
    console.log(`Transport Options: ${transCount[0].count}`);
    console.log(`Ride Fares: ${fareCount[0].count}`);
    
    console.log('\n✅ Database reseeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

resetAndReseed();

