# NASA Data Explorer - Backend

A Node.js/Express.js backend server that provides a unified API for NASA data exploration.

## 🚀 Features

- **EONET API**: Earth Observatory Natural Event Tracker
- **NEO API**: Near Earth Object tracking
- **Mars Rover API**: Mars rover photos and manifests
- **APOD API**: Astronomy Picture of the Day
- **CORS Enabled**: Frontend can communicate seamlessly
- **Error Handling**: Comprehensive error responses
- **TypeScript Support**: Full type safety

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js 5
- **Language**: JavaScript/TypeScript
- **HTTP Client**: Axios
- **Environment**: dotenv

## 📦 Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

## 🔧 Configuration

The backend is configured with your NASA API key: `8j7gw73snXCD8lpaEe5nSBZSeFTUV8Qn6umZuod1`

## 📡 API Endpoints

### APOD (Astronomy Picture of the Day)
- `GET /` - Get today's APOD

### EONET (Earth Observatory Natural Event Tracker)
- `GET /eonet/events` - Get natural events
  - Query params: `limit`, `days`, `category`, `source`, `status`
- `GET /eonet/categories` - Get event categories
- `GET /eonet/sources` - Get event sources

### NEO (Near Earth Object)
- `GET /neo/feed` - Get NEO feed for date range
  - Query params: `start_date`, `end_date` (YYYY-MM-DD format)
- `GET /neo/browse` - Browse NEO data
  - Query params: `page`, `size`, `sort`
- `GET /neo/:id` - Get specific NEO by ID

### Mars Rover
- `GET /mars/rovers` - Get list of available rovers
- `GET /mars/manifest/:rover` - Get rover manifest
- `GET /mars/photos` - Get rover photos
  - Query params: `rover`, `earth_date`, `camera`, `page`

## 🔄 API Response Format

All endpoints return JSON responses with the following structure:

### Success Response
```json
{
  "data": "...",
  "status": "success"
}
```

### Error Response
```json
{
  "error": "Error message",
  "details": "Detailed error information"
}
```

## 🚀 Development

### Available Scripts
- `npm run dev` - Start development server with nodemon
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run watch` - Watch TypeScript files for changes

### File Structure
```
src/
├── index.js          # Main server file
├── route.js          # Route definitions
└── apis/
    ├── apod.js       # APOD API endpoints
    ├── eonet.js      # EONET API endpoints
    ├── neo.js        # NEO API endpoints
    └── mars_rover.js # Mars Rover API endpoints
```

## 🔒 Security

- CORS is enabled for frontend communication
- API key is securely stored
- Input validation on all endpoints
- Error handling prevents information leakage

## 🌐 Frontend Integration

The frontend is configured to communicate with this backend at `http://localhost:3000`. Make sure both frontend and backend are running for full functionality.

## 📝 Notes

- The backend uses your NASA API key: `8j7gw73snXCD8lpaEe5nSBZSeFTUV8Qn6umZuod1`
- All NASA API calls are proxied through this backend
- Rate limiting and caching can be added for production use 