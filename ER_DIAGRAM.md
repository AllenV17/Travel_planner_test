# Entity Relationship Diagram (ERD)

## Overview

Travel Mitr uses a normalized relational database design following 3NF (Third Normal Form) principles.

## Entities and Attributes

### 1. User
- **Primary Key:** user_id (INT, AUTO_INCREMENT)
- **Attributes:**
  - name (VARCHAR(100))
  - email (VARCHAR(100), UNIQUE)
  - password (VARCHAR(255))
  - phone (VARCHAR(20))
  - created_at (TIMESTAMP)

### 2. Destination
- **Primary Key:** dest_id (INT, AUTO_INCREMENT)
- **Attributes:**
  - name (VARCHAR(100))
  - state (VARCHAR(50))
  - city (VARCHAR(50))
  - pincode (VARCHAR(10))

### 3. TransportOption
- **Primary Key:** trans_id (INT, AUTO_INCREMENT)
- **Foreign Keys:**
  - source_id → Destination(dest_id)
  - dest_id → Destination(dest_id)
- **Attributes:**
  - mode (VARCHAR(50))
  - base_cost (DECIMAL(10,2))
  - duration (INT)
  - comfort_level (INT)

### 4. RideFare
- **Primary Key:** ride_id (INT, AUTO_INCREMENT)
- **Foreign Keys:**
  - trans_id → TransportOption(trans_id)
- **Attributes:**
  - app_name (VARCHAR(50))
  - fare (DECIMAL(10,2))
  - estimated_time (INT)

### 5. Trip
- **Primary Key:** trip_id (INT, AUTO_INCREMENT)
- **Foreign Keys:**
  - user_id → User(user_id)
  - source_id → Destination(dest_id)
  - dest_id → Destination(dest_id)
- **Attributes:**
  - selected_mode (VARCHAR(50))
  - total_cost (DECIMAL(10,2))
  - total_duration (INT)
  - comfort_score (INT)
  - created_at (TIMESTAMP)

## Relationships

### One-to-Many (1:N)

1. **User → Trip**
   - One user can have multiple trips
   - Relationship: User (1) owns multiple (n) Trips
   - Foreign Key: trip.user_id references user.user_id

2. **Destination → TransportOption (Source)**
   - One destination can be a source for multiple transport options
   - Relationship: Destination (1) can be source for (n) TransportOptions
   - Foreign Key: transportoption.source_id references destination.dest_id

3. **Destination → TransportOption (Destination)**
   - One destination can be a destination for multiple transport options
   - Relationship: Destination (1) can be destination for (n) TransportOptions
   - Foreign Key: transportoption.dest_id references destination.dest_id

4. **TransportOption → RideFare**
   - One transport option can have multiple ride fare entries (from different apps)
   - Relationship: TransportOption (1) has (n) RideFare entries
   - Foreign Key: ridefare.trans_id references transportoption.trans_id

### One-to-One (1:1) - via Trip

5. **Trip → Source Destination**
   - Each trip has exactly one source destination
   - Relationship: Trip (1) has (1) Source Destination
   - Foreign Key: trip.source_id references destination.dest_id

6. **Trip → Destination**
   - Each trip has exactly one destination
   - Relationship: Trip (1) has (1) Destination
   - Foreign Key: trip.dest_id references destination.dest_id

## Text Representation

```
User (1) ──< owns >── (n) Trip

Trip (1) ──< has_source >── (1) Destination
Trip (1) ──< has_destination >── (1) Destination

Destination (1) ──< has_source_options >── (n) TransportOption
Destination (1) ──< has_dest_options >── (n) TransportOption

TransportOption (1) ──< has >── (n) RideFare
```

## Functional Dependencies

### User
- user_id → name, email, password, phone, created_at

### Destination
- dest_id → name, state, city, pincode

### TransportOption
- trans_id → source_id, dest_id, mode, base_cost, duration, comfort_level

### RideFare
- ride_id → trans_id, app_name, fare, estimated_time
- {trans_id, app_name} → fare, estimated_time (composite key dependency)

### Trip
- trip_id → user_id, source_id, dest_id, selected_mode, total_cost, total_duration, comfort_score, created_at

## Normalization

All tables are in **3NF (Third Normal Form)**:

1. **1NF**: All tables have atomic attributes and a primary key
2. **2NF**: No partial dependencies; all non-key attributes fully depend on the primary key
3. **3NF**: No transitive dependencies; all attributes depend only on the primary key

## Sample Data Flow

1. User creates account → stored in **User** table
2. System has predefined destinations → stored in **Destination** table
3. Transport options defined → stored in **TransportOption** table
4. Fare comparisons added → stored in **RideFare** table
5. User searches route → system queries TransportOption and RideFare tables
6. Optimization algorithm calculates best route
7. User saves trip → stored in **Trip** table
8. Trip history queries → joins Trip with Destination and User tables

## Cardinality Summary

| Relationship | Type | Cardinality |
|--------------|------|-------------|
| User → Trip | 1:N | One-to-Many |
| Trip → Source Destination | N:1 | Many-to-One |
| Trip → Destination | N:1 | Many-to-One |
| Destination → TransportOption (source) | 1:N | One-to-Many |
| Destination → TransportOption (dest) | 1:N | One-to-Many |
| TransportOption → RideFare | 1:N | One-to-Many |

## Notes

- The database uses foreign key constraints to maintain referential integrity
- Cascade delete is not enabled to prevent accidental data loss
- Indexes are recommended on frequently queried foreign keys (user_id, source_id, dest_id, trans_id)
- The RideFare table allows multiple entries per transport option from different ride-hailing apps (Uber, Ola, Rapido)

