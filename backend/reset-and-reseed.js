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
    
    // Step 2: Insert destinations for each city (5 each)
    console.log('2. Inserting destinations...');
    const cityToPlaces = {
      Mumbai: [
        { name: 'Mumbai Airport', pincode: '400099' },
        { name: 'Mumbai Central', pincode: '400008' },
        { name: 'Bandra Kurla Complex', pincode: '400051' },
        { name: 'Andheri Station', pincode: '400058' },
        { name: 'Colaba', pincode: '400005' }
      ],
      Bangalore: [
        { name: 'Bangalore Airport', pincode: '560300' },
        { name: 'Bangalore City', pincode: '560001' },
        { name: 'Electronic City', pincode: '560100' },
        { name: 'Whitefield', pincode: '560066' },
        { name: 'Indiranagar', pincode: '560038' }
      ],
      Pune: [
        { name: 'Pune Airport', pincode: '411032' },
        { name: 'Pune Station', pincode: '411001' },
        { name: 'Hinjawadi', pincode: '411057' },
        { name: 'Kothrud', pincode: '411038' },
        { name: 'Kharadi', pincode: '411014' }
      ],
      Chennai: [
        { name: 'Chennai Airport', pincode: '600027' },
        { name: 'Central Railway Station', pincode: '600003' },
        { name: 'T Nagar', pincode: '600017' },
        { name: 'OMR Siruseri', pincode: '603103' },
        { name: 'Velachery', pincode: '600042' }
      ],
      Hyderabad: [
        { name: 'Hyderabad Airport', pincode: '500409' },
        { name: 'Secunderabad Station', pincode: '500003' },
        { name: 'Hitech City', pincode: '500081' },
        { name: 'Banjara Hills', pincode: '500034' },
        { name: 'Charminar', pincode: '500002' }
      ]
    };
    const stateMap = {
      Mumbai: 'Maharashtra',
      Pune: 'Maharashtra',
      Bangalore: 'Karnataka',
      Chennai: 'Tamil Nadu',
      Hyderabad: 'Telangana'
    };
    for (const [city, places] of Object.entries(cityToPlaces)) {
      for (const place of places) {
        await pool.execute(
          'INSERT INTO Destination (name, state, city, pincode) VALUES (?, ?, ?, ?)',
          [place.name, stateMap[city], city, place.pincode]
        );
      }
    }
    console.log('✅ 25 destinations inserted (5 per city)\n');

    // Step 3: Get destinations and build per-city lists
    const [allDests] = await pool.execute('SELECT dest_id, name, city FROM Destination');
    const cityToDestinations = {};
    for (const d of allDests) {
      if (!cityToDestinations[d.city]) cityToDestinations[d.city] = [];
      cityToDestinations[d.city].push(d);
    }

    // Step 4: Insert intra-city transport options for every pair (Cab/Auto/Bus)
    console.log('3. Inserting intra-city transport options (all pairs)...');
    let routeCount = 0;
    let optionCount = 0;
    function cityPricing(city) {
      // Base heuristics per city; Cab is reference, Auto ~40%, Bus ~30%
      const map = {
        Mumbai: { cab: 520, duration: 45 },
        Pune: { cab: 500, duration: 40 },
        Bangalore: { cab: 620, duration: 50 },
        Chennai: { cab: 480, duration: 42 },
        Hyderabad: { cab: 510, duration: 44 }
      };
      return map[city] || { cab: 520, duration: 45 };
    }
    for (const [city, list] of Object.entries(cityToDestinations)) {
      for (let i = 0; i < list.length; i++) {
        for (let j = 0; j < list.length; j++) {
          if (i === j) continue;
          const from = list[i];
          const to = list[j];
          const base = cityPricing(city);
          // Slightly vary by index distance to avoid identical values
          const factor = 1 + Math.abs(i - j) * 0.05;
          const cabCost = Math.round(base.cab * factor);
          const autoCost = Math.round(cabCost * 0.4);
          const busCost = Math.round(cabCost * 0.3);
          const duration = Math.round(base.duration * factor);
          const comfortCab = 8;
          const comfortAuto = 4;
          const comfortBus = 5;
          // Cab
          await pool.execute(
            'INSERT INTO TransportOption (source_id, dest_id, mode, base_cost, duration, comfort_level) VALUES (?, ?, ?, ?, ?, ?)',
            [from.dest_id, to.dest_id, 'Cab', cabCost, duration, comfortCab]
          );
          // Auto
          await pool.execute(
            'INSERT INTO TransportOption (source_id, dest_id, mode, base_cost, duration, comfort_level) VALUES (?, ?, ?, ?, ?, ?)',
            [from.dest_id, to.dest_id, 'Auto', autoCost, Math.round(duration * 1.15), comfortAuto]
          );
          // Bus
          await pool.execute(
            'INSERT INTO TransportOption (source_id, dest_id, mode, base_cost, duration, comfort_level) VALUES (?, ?, ?, ?, ?, ?)',
            [from.dest_id, to.dest_id, 'Bus', busCost, Math.round(duration * 1.35), comfortBus]
          );
          routeCount++;
          optionCount += 3;
        }
      }
    }
    console.log(`✅ ${routeCount} intra-city routes with ${optionCount} transport options inserted\n`);
    
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
        fares = { uber: 520, ola: 500, rapido: 470 };
      } else if (source.includes('Delhi') && dest.includes('Delhi')) {
        fares = { uber: 500, ola: 470, rapido: 440 };
      } else if (source.includes('Bangalore') && dest.includes('Bangalore')) {
        fares = { uber: 620, ola: 600, rapido: 570 };
      } else if (source.includes('Pune') && dest.includes('Pune')) {
        fares = { uber: 500, ola: 480, rapido: 450 };
      } else if (source.includes('Chennai') && dest.includes('Chennai')) {
        fares = { uber: 480, ola: 460, rapido: 430 };
      } else if (source.includes('Hyderabad') && dest.includes('Hyderabad')) {
        fares = { uber: 510, ola: 490, rapido: 460 };
      } else {
        fares = { uber: 540, ola: 510, rapido: 480 };
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

