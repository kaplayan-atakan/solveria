// MongoDB initialization script
db = db.getSiblingDB('solveria');

// Create collections
db.createCollection('users');
db.createCollection('problems');
db.createCollection('solutions');

// Create indexes
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "createdAt": 1 });
db.problems.createIndex({ "userId": 1 });
db.problems.createIndex({ "createdAt": -1 });
db.solutions.createIndex({ "problemId": 1 });
db.solutions.createIndex({ "createdAt": -1 });

// Insert sample data (optional)
db.users.insertOne({
    name: "Test User",
    email: "test@solveria.com",
    password: "hashedpassword",
    plan: "free",
    questionsRemaining: 3,
    createdAt: new Date()
});

print("Database initialization completed successfully!");
