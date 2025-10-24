# Meeting Notes App

A simple, elegant web application for taking notes during meetings. Built with vanilla JavaScript, HTML, and CSS - no dependencies required.

## Features

- **Create Meetings**: Quickly start a new meeting with title, date, and attendees
- **Timestamped Notes**: All notes automatically get timestamped
- **Action Items**: Mark important notes as action items for easy tracking
- **Auto-Save**: All changes are automatically saved to browser local storage
- **Export**: Export your meeting notes as a formatted text file
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Clean UI**: Beautiful gradient design with smooth animations

## Getting Started

### Installation

1. Clone or download this repository
2. Open `index.html` in your web browser
3. That's it! No build process or installation required.

### Usage

#### Creating a New Meeting

1. Click the "+ New Meeting" button in the header
2. Enter the meeting title (or leave it as "Untitled Meeting")
3. Set the date and time (defaults to current time)
4. Add attendees (comma-separated names, optional)

#### Taking Notes

1. Type your note in the text area
2. Optionally check "Mark as Action Item" for important tasks
3. Click "Add Note" or press `Ctrl/Cmd + Enter`
4. Notes appear below with timestamps

#### Managing Meetings

- **View All Meetings**: Click "← Back to List" to see all your meetings
- **Edit Meeting**: Click on any meeting card to open and edit it
- **Delete Note**: Click the × button on any note to remove it
- **Delete Meeting**: Click "Delete Meeting" to remove the entire meeting
- **Export**: Click "Export" to download meeting notes as a text file

## Features in Detail

### Auto-Save
All changes to meeting titles, dates, attendees, and notes are automatically saved to your browser's local storage. You never have to worry about losing your notes.

### Action Items
Mark important notes as action items to make them stand out. They appear with:
- Orange left border
- Yellow background highlight
- "ACTION ITEM" badge

### Export Format
Exported notes include:
- Meeting title
- Date and time
- Attendees list
- All notes with timestamps
- Action items marked with ⚡ symbol

### Keyboard Shortcuts
- `Ctrl/Cmd + Enter`: Add note (while focused in note input area)

## Data Storage

All data is stored locally in your browser using `localStorage`. This means:
- ✅ Your notes are private and never sent to any server
- ✅ Notes persist even after closing the browser
- ⚠️ Notes are specific to the browser and device you're using
- ⚠️ Clearing browser data will delete your notes (use Export to back up important meetings)

## Browser Compatibility

Works on all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## Privacy

This app runs entirely in your browser. No data is ever transmitted to any server. All your meeting notes stay on your device.

## Tips

1. **Regular Exports**: Export important meetings to text files for backup
2. **Action Items**: Use action items to track follow-up tasks
3. **Attendees**: List attendees to remember who was present
4. **Timestamps**: Notes are automatically timestamped, perfect for tracking when topics were discussed

## Technical Details

- **Framework**: Vanilla JavaScript (ES6+)
- **Storage**: Browser LocalStorage API
- **Styling**: CSS3 with Flexbox and Grid
- **Size**: ~15KB total (uncompressed)
- **Dependencies**: None

## Future Enhancements

Potential features for future versions:
- Search functionality
- Categories/tags for meetings
- Markdown support in notes
- Cloud sync options
- PDF export
- Dark mode
- Meeting templates

## License

Free to use and modify for personal or commercial projects.

## Support

If you encounter any issues or have suggestions, please open an issue on the repository.

---

**Enjoy taking better meeting notes!**
