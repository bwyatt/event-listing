const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const EVENTS_FILE = './src/events.json';
const OUTPUT_DIR = './src';
const HASHES_FILE = path.join('./automation/data', 'hashes.json');

if (!fs.existsSync(EVENTS_FILE)) {
    console.error('Events file not found. Please run fetch-events.js first.');
    process.exit(1);
}

const events = JSON.parse(fs.readFileSync(EVENTS_FILE));

function generateHash(content) {
    return crypto.createHash('md5').update(content).digest('hex');
}

function generateEventListPage(events, title, filename) {
    const eventItems = events.map(event => `
        <li>
            <a href="event-detail.html?id=${event.id}">
                <strong>${event.summary}</strong><br>
                ${event.start} - ${event.location || 'No location provided'}
            </a>
        </li>
    `).join('');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link rel="stylesheet" href="styles/main.css">
</head>
<body>
    <header>
        <h1>${title}</h1>
        <nav>
            <ul>
                <li><a href="index.html">Upcoming Events</a></li>
                <li><a href="past-events.html">Past Events</a></li>
            </ul>
        </nav>
    </header>
    <main>
        <ul>
            ${eventItems}
        </ul>
    </main>
    <footer>
        <p>&copy; 2025 Event Listing</p>
    </footer>
</body>
</html>`;

    fs.writeFileSync(path.join(OUTPUT_DIR, filename), html);
    console.log(`${filename} generated.`);
}

function generateEventDetailPage(event, existingHashes) {
    const sanitizedTitle = event.summary.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
    const filename = `${event.start.split('T')[0]}-${sanitizedTitle}.html`;
    const filePath = path.join(OUTPUT_DIR, 'event', filename);

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${event.summary}</title>
    <link rel="stylesheet" href="../styles/main.css">
</head>
<body>
    <header>
        <h1>${event.summary}</h1>
        <nav>
            <ul>
                <li><a href="../index.html">Upcoming Events</a></li>
                <li><a href="../past-events.html">Past Events</a></li>
            </ul>
        </nav>
    </header>
    <main>
        <p><strong>Date:</strong> ${event.start}</p>
        <p><strong>Time:</strong> ${event.end ? `${event.start} - ${event.end}` : 'N/A'}</p>
        <p><strong>Location:</strong> <a href="https://maps.google.com/?q=${encodeURIComponent(event.location || '')}" target="_blank">${event.location || 'No location provided'}</a></p>
        <h3>Description</h3>
        <p>${event.description || 'No description available.'}</p>
    </main>
    <footer>
        <p>&copy; 2025 Event Listing</p>
    </footer>
</body>
</html>`;

    const newHash = generateHash(html);

    if (existingHashes[event.id] === newHash) {
        console.log(`No changes detected for event: ${event.summary}. Skipping update.`);
        return;
    }

    fs.writeFileSync(filePath, html);
    existingHashes[event.id] = newHash;
    console.log(`Event detail page for ${event.summary} generated at src/event/${filename}.`);
}

const now = new Date();
const upcomingEvents = events.filter(event => new Date(event.start) >= now);
const pastEvents = events.filter(event => new Date(event.start) < now);

generateEventListPage(upcomingEvents, 'Upcoming Events', 'index.html');
generateEventListPage(pastEvents, 'Past Events', 'past-events.html');

// Load existing hashes if available
let existingHashes = {};
if (fs.existsSync(HASHES_FILE)) {
    existingHashes = JSON.parse(fs.readFileSync(HASHES_FILE));
}

// Ensure the data directory exists
if (!fs.existsSync('./automation/data')) {
    fs.mkdirSync('./automation/data', { recursive: true });
}

// Save updated hashes
fs.writeFileSync(HASHES_FILE, JSON.stringify(existingHashes, null, 2));
