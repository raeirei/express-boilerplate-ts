# Express TypeScript MongoDB Boilerplate

minimal express with ts and mongodb as the db

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Request handlers
├── middleware/     # Custom middleware
├── models/         # MongoDB schemas
├── routes/         # API routes
├── types/         # TypeScript type definitions
└── app.ts         # Main application file
```

## API Endpoints

### Base URL: `http://localhost:3000`

- `GET /` - Health check
- `POST /api/users` - Create user
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
