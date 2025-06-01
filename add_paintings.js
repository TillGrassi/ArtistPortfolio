import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from './shared/schema.js';
import ws from 'ws';
import { fileURLToPath } from 'url';
import path from 'path';

// Set up neon config
const neonConfig = { webSocketConstructor: ws };

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool, schema });

const paintings = [
  {
    title: "Cliffside with Building in Lemvig",
    year: 2023,
    medium: "Oil on canvas",
    size: "40 × 50 cm",
    description: "A serene coastal landscape featuring dramatic cliffs and traditional Danish architecture overlooking the sea.",
    imageUrl: "/assets/Cliffside with building in Lemvig.jpg",
    availability: "available",
    tags: ["landscape", "coastal", "denmark", "cliffs"],
    featured: true
  },
  {
    title: "Full Moon in Lemvig",
    year: 2023,
    medium: "Oil on canvas",
    size: "35 × 45 cm",
    description: "A moody nocturnal scene capturing the ethereal beauty of moonlight reflecting on water.",
    imageUrl: "/assets/Full moon in Lemvig.JPG",
    availability: "available",
    tags: ["landscape", "night", "moon", "water", "atmospheric"],
    featured: false
  },
  {
    title: "Möns Klint from Above",
    year: 2023,
    medium: "Oil on canvas",
    size: "50 × 60 cm",
    description: "The famous white chalk cliffs of Denmark painted from an elevated perspective, showcasing the dramatic meeting of land and sea.",
    imageUrl: "/assets/Möns Klint from above.JPG",
    availability: "available",
    tags: ["landscape", "cliffs", "denmark", "aerial view"],
    featured: true
  },
  {
    title: "Snowy Forest",
    year: 2024,
    medium: "Oil on canvas", 
    size: "45 × 55 cm",
    description: "A neo-impressionist interpretation of a winter forest scene with distinctive pointillist technique and vibrant blue tones.",
    imageUrl: "/assets/Snowy forest.JPG",
    availability: "available",
    tags: ["landscape", "winter", "forest", "snow", "neo-impressionist"],
    featured: false
  },
  {
    title: "Beitstadfjord from Follafoss",
    year: 2024,
    medium: "Oil on canvas",
    size: "60 × 80 cm",
    description: "A dramatic Norwegian fjord landscape captured during golden hour with rich oranges and deep blues.",
    imageUrl: "/assets/Beitstadfjord from Follafoss.JPG",
    availability: "available",
    tags: ["landscape", "norway", "fjord", "sunset", "mountains"],
    featured: true
  },
  {
    title: "Beitstadfjord from Follaheia Peak After Sunset",
    year: 2024,
    medium: "Oil on canvas",
    size: "55 × 70 cm", 
    description: "The serene beauty of the Norwegian fjord captured in the blue hour after sunset from a mountain peak.",
    imageUrl: "/assets/Beitstadfjord from Follaheia peak after sunset.JPG",
    availability: "available",
    tags: ["landscape", "norway", "fjord", "blue hour", "mountains"],
    featured: false
  },
  {
    title: "Bridge in the Salt Marshes",
    year: 2023,
    medium: "Oil on canvas",
    size: "40 × 50 cm",
    description: "A peaceful winter scene of a wooden bridge crossing through snow-covered salt marshes under a vast sky.",
    imageUrl: "/assets/Bridge in the salt marshes.jpg",
    availability: "available", 
    tags: ["landscape", "winter", "bridge", "marshes", "snow"],
    featured: false
  }
];

async function addPaintings() {
  try {
    console.log('Adding paintings to the database...');
    
    for (const painting of paintings) {
      const [result] = await db
        .insert(schema.paintings)
        .values(painting)
        .returning();
      
      console.log(`Added: ${result.title}`);
    }
    
    console.log('All paintings added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error adding paintings:', error);
    process.exit(1);
  }
}

addPaintings();