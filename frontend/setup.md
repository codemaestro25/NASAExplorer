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
VITE_NASA_API_KEY=your_actual_api_key_here
```

3. Restart the development server:
```bash
npm run dev
```

## API Limits

- **Demo Key**: 30 requests per hour, 50 requests per day
- **Free API Key**: 1000 requests per hour, unlimited per day

## Testing Your Setup

Once configured, you should see real-time Earth events data in the application. If you're still seeing demo data, check that:

1. Your `.env` file is in the project root
2. The API key is correctly formatted
3. You've restarted the development server
4. There are no console errors

## Troubleshooting

If you encounter issues:

1. Check the browser console for errors
2. Verify your API key is valid at [https://api.nasa.gov/](https://api.nasa.gov/)
3. Ensure the `.env` file is not being ignored by git
4. Try using the demo key temporarily to test the application 