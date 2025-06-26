# Setup Guide

## Getting Your NASA API Key

1. Visit [https://api.nasa.gov/](https://api.nasa.gov/)
2. Click "Generate API Key"
3. Fill out the form with your information
4. You'll receive a free API key instantly

## Configuration

1. Create a `.env` file in the project root:
```bash
# Copy the example file
cp .env.example .env
```

2. Edit the `.env` file and replace `DEMO_KEY` with your actual API key:
```env
NASA_API_KEY=your_actual_api_key_here
```

3. Restart the development server:
```bash
npm run dev
```

## API Limits

- **Demo Key**: 30 requests per hour, 50 requests per day
- **Free API Key**: 1000 requests per hour, unlimited per day
