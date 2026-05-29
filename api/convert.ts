import { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import * as cheerio from 'cheerio';
import TurndownService from 'turndown';

const turndownService = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
});

// Add custom rules for better markdown conversion
turndownService.addRule('strikethrough', {
  filter: ['s', 'strike', 'del'],
  replacement: (content: string) => `~~${content}~~`,
});

turndownService.addRule('highlight', {
  filter: ['mark'],
  replacement: (content: string) => `==${content}==`,
});

interface ConversionResponse {
  success: boolean;
  markdown?: string;
  title?: string;
  url?: string;
  error?: string;
}

async function fetchAndConvertHTML(url: string): Promise<ConversionResponse> {
  try {
    // Validate URL
    new URL(url);
    
    // Fetch the HTML content
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 10000,
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // Extract title
    const title = $('title').text() || $('h1').first().text() || 'Untitled';

    // Remove script and style tags
    $('script').remove();
    $('style').remove();
    $('noscript').remove();

    // Convert main content
    const mainContent = $('main').html() || $('article').html() || $('body').html();

    if (!mainContent) {
      return {
        success: false,
        error: 'Could not extract content from the HTML',
      };
    }

    // Convert to markdown
    let markdown = turndownService.turndown(mainContent);

    // Clean up excessive whitespace and newlines
    markdown = markdown
      .replace(/\n\n\n+/g, '\n\n') // Remove excessive blank lines
      .replace(/^ +/gm, '') // Remove leading spaces
      .trim();

    // Add title as H1 if not already present
    if (!markdown.startsWith('#')) {
      markdown = `# ${title}\n\n${markdown}`;
    }

    return {
      success: true,
      markdown,
      title,
      url,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      error: `Failed to convert URL: ${errorMessage}`,
    };
  }
}

export default async (req: VercelRequest, res: VercelResponse): Promise<void> => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET and POST
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Extract URL from query or body
  const url = req.method === 'GET' 
    ? (req.query.url as string)
    : (req.body?.url as string);

  if (!url) {
    res.status(400).json({
      error: 'Missing URL parameter. Please provide a "url" query parameter or in the request body.',
      example: '/api/convert?url=https://example.com',
    });
    return;
  }

  try {
    const result = await fetchAndConvertHTML(url);
    
    if (!result.success) {
      res.status(400).json(result);
      return;
    }

    res.status(200).json(result);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({
      error: 'Internal server error',
      message: errorMessage,
    });
  }
};
