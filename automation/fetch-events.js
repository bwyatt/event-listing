const fs = require('fs');
const axios = require('axios');

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const CALENDAR_ID = process.env.CALENDAR_ID;
const EVENTS_FILE = './automation/data/events.json';

if (!GOOGLE_API_KEY || !CALENDAR_ID) {
    console.error('Missing GOOGLE_API_KEY or CALENDAR_ID environment variables.');
    process.exit(1);
}

async function fetchEvents() {
    try {
        const response = await axios.get(
            `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events`,
            {
                params: {
                    key: GOOGLE_API_KEY,
                    timeMin: new Date().toISOString(),
                    singleEvents: true,
                    orderBy: 'startTime',
                },
            }
        );

        const events = response.data.items.map(event => ({
            id: event.id,
            summary: event.summary,
            description: event.description,
            location: event.location,
            start: event.start.dateTime || event.start.date,
            end: event.end.dateTime || event.end.date,
        }));

        // Update the path where events are saved
        fs.writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 2));
        console.log(`Fetched and saved ${events.length} events to ${EVENTS_FILE}.`);
    } catch (error) {
        console.error('Error fetching events:', error);
        process.exit(1);
    }
}

fetchEvents();
