# E-Store Backend API

A scalable and robust backend API for an e-commerce platform built with Node.js, Express, and MongoDB.

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── middleware/     # Custom middleware
├── models/         # Database models
├── routes/         # Route definitions
├── services/       # Business logic
├── utils/          # Utility functions
└── index.js        # Application entry point
```

## Features

- User authentication and authorization
- Product management
- Order processing
- User management
- Secure API endpoints
- Input validation
- Error handling
- Logging
- Database integration

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository

```bash
git clone <repository-url>
cd e-store-backend
```

2. Install dependencies

```bash
npm install
```

3. Create a .env file in the root directory and add the following variables:

```
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

4. Start the development server

```bash
npm run dev
```

## API Documentation

The API documentation will be available at `/api-docs` when the server is running.

## Testing

Run the test suite:

```bash
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.
