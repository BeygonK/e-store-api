# E-Store API

A RESTful API for an e-commerce platform built with Node.js, Express, and MongoDB.

## Features

- User authentication and authorization
- Product management
- Order processing
- MongoDB database integration
- JWT-based authentication
- Role-based access control

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
```

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd e-store
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

## API Documentation

### Authentication Endpoints

- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

### Product Endpoints

- GET `/api/products` - Get all products
- GET `/api/products/:id` - Get single product
- POST `/api/products` - Create product (admin only)
- PUT `/api/products/:id` - Update product (admin only)
- DELETE `/api/products/:id` - Delete product (admin only)

## Deployment

### Deploying to Render.com

1. Create a Render account at https://render.com

2. Create a new Web Service:

   - Connect your GitHub repository
   - Select "Node" as the runtime
   - Set the build command: `npm install`
   - Set the start command: `node src/index.js`

3. Add environment variables in Render dashboard:

   - `NODE_ENV=production`
   - `PORT=10000`
   - `MONGO_URI=your_mongodb_uri`
   - `JWT_SECRET=your_jwt_secret`
   - `JWT_EXPIRE=30d`

4. Deploy!

## Testing

Run the test suite:

```bash
npm test
```

## License

MIT
