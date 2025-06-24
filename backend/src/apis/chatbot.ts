import { Request, Response, NextFunction } from 'express';
import { getApodData } from './apod';
import { getMarsRoverPhotos } from './mars_rover';
import { getEonetEvents } from './eonet';
import { getNeoFeed } from './neo';
import axios from 'axios';

// Helper for NASA Image and Video Library
async function getNasaMediaResults(query: string): Promise<any> {
  const url = `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}`;
  const response = await axios.get(url);
  return response.data;
}

// Simple intent detection based on keywords
function detectIntent(message: string) {
  const lower = message.toLowerCase();
  if (lower.match(/(image|video|audio)/) && lower.match(/nasa|space|planet|galaxy|telescope|moon|mars|earth|satellite|apollo|hubble|james webb|black hole|star|comet|asteroid|rover|launch|rocket|shuttle|station/)) return 'media';
  if (lower.includes('mars') || lower.includes('rover')) return 'mars';
  if (lower.includes('asteroid') || lower.includes('neo') || lower.includes('comet')) return 'neo';
  if (lower.includes('event') || lower.includes('wildfire') || lower.includes('storm') || lower.includes('volcano')) return 'eonet';
  if (lower.includes('picture') || lower.includes('apod') || lower.includes('photo') || lower.includes('image')) return 'apod';
  return 'apod'; // default to APOD
}

export const chatbot = async(req: Request, res: Response, next: NextFunction) : Promise<void> => {
  const { message } = req.body;
  if (!message) {
    res.status(400).json({ reply: 'Please provide a message.' });
  }

  const intent = detectIntent(message);
  let reply = '';

  try {
    if (intent === 'media') {
      // Improved topic extraction for media search
      const topicMatch = message.match(/(?:image|images|video|audio|photo|picture) (?:of|about)? ([\w\s]+)/i);
      let topic = topicMatch ? topicMatch[1].trim() : '';
      if (!topic) {
        // Fallback: use last 3 words of the message
        const words = message.trim().split(' ');
        topic = words.slice(-3).join(' ');
      }
      const data = await getNasaMediaResults(topic);
      if (data.collection && data.collection.items && data.collection.items.length > 0) {
        const first = data.collection.items[0];
        const title = first.data && first.data[0] && first.data[0].title ? first.data[0].title : 'NASA Media';
        const desc = first.data && first.data[0] && first.data[0].description ? first.data[0].description : '';
        const link = first.links && first.links[0] && first.links[0].href ? first.links[0].href : '';
        reply = `Here is a result for "${topic}": ${title}. ${desc} ${link}`;
      } else {
        reply = `Sorry, I couldn't find any NASA media results for "${topic}".`;
      }
    } else if (intent === 'mars') {
      const roverMatch = message.match(/(curiosity|opportunity|spirit)/i);
      const solMatch = message.match(/sol\s*(\d+)/i);
      const rover = roverMatch ? roverMatch[1].toLowerCase() : 'curiosity';
      const sol = solMatch ? solMatch[1] : '1000';
      const data = await getMarsRoverPhotos(rover, sol);
      if (data.photos && data.photos.length > 0) {
        reply = `Found ${data.photos.length} photos from ${rover.charAt(0).toUpperCase() + rover.slice(1)} on sol ${sol}. Here is one: ${data.photos[0].img_src}`;
      } else {
        reply = `No photos found for ${rover.charAt(0).toUpperCase() + rover.slice(1)} on sol ${sol}. Try another sol or rover!`;
      }
    } else if (intent === 'neo') {
      const data = await getNeoFeed();
      reply = `There are ${data.element_count} near-Earth objects in the current feed.`;
    } else if (intent === 'eonet') {
      const data = await getEonetEvents();
      reply = `There are currently ${data.events?.length || 0} natural events being tracked by NASA.`;
    } else {
      const data = await getApodData();
      reply = `Astronomy Picture of the Day: ${data.title}. ${data.explanation}`;
    }
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ reply: 'Sorry, there was an error processing your request.' });
  }
} 