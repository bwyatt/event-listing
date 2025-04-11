# Event Listing

This repository will generate a static website populated with events from a specified Google Calendar. The website will use HTML, CSS, and JavaScript without any frameworks. A key design objective is to keep the site as small as possible to minimize page load times.

## Features

- **Upcoming Events Page**: Displays a list of upcoming events, ordered by date (soonest first). Each event will show:
  - Date
  - Time
  - Title
  - Location

- **Past Events Page**: Displays a list of past events in the same format as the upcoming events page.

- **Event Detail Page**: Provides detailed information about a selected event, including:
  - A link to the location on Google Maps.
  - The full event description from the calendar, with any CSS stripped to ensure the page uses only the site's CSS.

## Technical Details

- **Data Source**: Events will be fetched using the Google Calendar API.
- **Automation**: GitHub Actions will be used to execute the code that fetches events and generates the website.
- **Hosting**: The website will be published using GitHub Pages.
- **Responsive Design**: The website layout will be responsive, ensuring it looks good on both desktop and mobile devices.
