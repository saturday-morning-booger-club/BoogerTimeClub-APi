# BoogerTimeClub API - HTML to Markdown Converter

An API that converts HTML URLs into properly formatted markdown documents. Perfect for content scraping, documentation generation, and content repurposing.

## Features

- 🌐 Fetch HTML from any URL
- 📝 Convert HTML to clean, formatted Markdown
- 🎯 Extracts page titles automatically
- ✨ Handles common HTML elements (headings, lists, links, tables, etc.)
- 🚀 Deployed on Vercel (serverless)
- 🔒 CORS enabled for easy integration

## API Endpoints

### `GET /api/convert?url=<url>`

Convert an HTML page to Markdown.

**Query Parameters:**
- `url` (required): The full URL of the HTML page to convert

**Example Request:**
```bash
curl "https://your-deployment.vercel.app/api/convert?url=https://example.com/article"
```

### `POST /api/convert`

Convert an HTML page to Markdown (alternative method).

**Request Body:**
```json
{
  "url": "https://example.com/article"
}
```

**Example Request:**
```bash
curl -X POST "https://your-deployment.vercel.app/api/convert" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com/article"}'
```

## Response Format

**Success Response (200):**
```json
{
  "success": true,
  "markdown": "# Page Title\n\nConverted markdown content...",
  "title": "Page Title",
  "url": "https://example.com/article"
}
```

**Error Response (400/500):**
```json
{
  "success": false,
  "error": "Error description"
}
```

## Installation & Local Development

1. **Clone the repository:**
```bash
git clone https://github.com/saturday-morning-booger-club/BoogerTimeClub-APi.git
cd BoogerTimeClub-APi
```

2. **Install dependencies:**
```bash
npm install
```

3. **Run locally with Vercel CLI:**
```bash
npm install -g vercel
vercel dev
```

The API will be available at `http://localhost:3000/api/convert`

## Deployment to Vercel

1. **Connect your GitHub repository to Vercel** (automatic deployments on push)

2. **Or deploy manually:**
```bash
vercel deploy
```

## Technologies Used

- **Express.js** - API framework
- **Axios** - HTTP client
- **Cheerio** - HTML parsing
- **Turndown** - HTML to Markdown conversion
- **TypeScript** - Type safety
- **Vercel** - Serverless hosting

## Example Usage

### JavaScript/Node.js
```javascript
const url = 'https://example.com/article';
const response = await fetch(`/api/convert?url=${encodeURIComponent(url)}`);
const data = await response.json();
console.log(data.markdown);
```

### Python
```python
import requests

url = 'https://example.com/article'
response = requests.get('https://your-deployment.vercel.app/api/convert', 
                       params={'url': url})
print(response.json()['markdown'])
```

### cURL
```bash
curl "https://your-deployment.vercel.app/api/convert?url=https://example.com/article"
```

## Supported HTML Elements

- Headings (h1-h6)
- Paragraphs
- Lists (ordered & unordered)
- Links
- Images
- Code blocks
- Tables
- Bold & italic text
- Strikethrough
- Blockquotes

## Limitations

- Timeout: 10 seconds per request
- Large pages may take longer to process
- Some advanced CSS styling may not convert to Markdown
- JavaScript-rendered content will not be captured (static HTML only)

## Error Handling

- **400 Bad Request**: Missing or invalid URL parameter
- **400 Bad Request**: Failed to extract content from HTML
- **500 Internal Server Error**: Server-side processing error
- **405 Method Not Allowed**: Only GET and POST methods are supported

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT

## Author

BoogerTimeClub
