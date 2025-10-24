# Meeting Notes App - Enhanced Version

A powerful, feature-rich web application for taking professional notes during meetings. Built with vanilla JavaScript, HTML, and CSS - no dependencies required.

## Features

### Core Functionality
- **Create & Manage Meetings**: Full meeting details including title, dates, attendees, location, and tags
- **Timestamped Notes**: All notes automatically get timestamped for easy reference
- **Action Items**: Mark important notes as action items with special highlighting
- **Auto-Save**: All changes are automatically saved to browser local storage
- **Edit Notes**: Click the edit button on any note to modify it
- **Note Editing**: Full support for editing existing notes with visual feedback

### Advanced Features
- **Dark Mode**: Beautiful dark theme with smooth transitions
- **Search**: Search across meeting titles, attendees, tags, and note content
- **Advanced Filtering**: Filter meetings by date (today, this week, this month) or action items
- **Flexible Sorting**: Sort by date (recent/oldest), title, or number of notes
- **Statistics Dashboard**: View comprehensive stats about your meetings and notes
- **Tags System**: Organize meetings with customizable tags
- **Meeting Duration**: Track meeting start and end times
- **Location/Link**: Add meeting location or video call links

### Calendar Integration
- **Export to .ICS**: Export any meeting as an iCalendar file
- **Import from .ICS**: Import calendar events and convert them to meeting notes
- **Text Export**: Export meeting notes as formatted text files

### UI/UX Enhancements
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Smooth Animations**: Beautiful fade-in, slide-up, and hover effects
- **Custom Scrollbars**: Styled scrollbars that match the theme
- **Modal Dialogs**: Modern modal windows for statistics
- **Visual Feedback**: Hover effects and transitions throughout

## Getting Started

### Installation

1. Clone or download this repository
2. Open `index.html` in your web browser
3. That's it! No build process or installation required.

### Quick Start Guide

#### Creating a New Meeting

1. Click the "+ New Meeting" button in the header
2. Enter the meeting title
3. Set the start and end date/time (defaults to current time + 1 hour)
4. Add attendees (comma-separated names)
5. Add tags for organization (e.g., "sprint-planning, review")
6. Add the meeting location or video call link

#### Taking Notes

1. Type your note in the text area
2. Optionally check "Mark as Action Item" for important tasks
3. Click "Add Note" or press `Ctrl/Cmd + Enter`
4. Notes appear below with timestamps
5. Click the edit (✏️) button to modify any note
6. Click the delete (✕) button to remove a note

#### Managing Meetings

- **View All Meetings**: Click "← Back to List" to see all your meetings
- **Search**: Use the search bar to find meetings and notes
- **Filter**: Use dropdown filters to narrow down meetings
- **Sort**: Change sort order using the sort dropdown
- **Edit Meeting**: Click on any meeting card to open and edit it
- **Delete Meeting**: Click "Delete Meeting" to remove the entire meeting
- **Export TXT**: Download meeting notes as a text file
- **Export .ICS**: Export meeting to calendar format
- **Import .ICS**: Import calendar events as meetings

#### Using Dark Mode

Click the moon/sun icon (🌙/☀️) in the header to toggle between light and dark modes. Your preference is saved automatically.

#### Viewing Statistics

Click the statistics icon (📊) to view:
- Total meetings
- Total notes
- Total action items
- Meetings this week/month
- Average notes per meeting

## Features in Detail

### Auto-Save
All changes to meeting titles, dates, attendees, tags, locations, and notes are automatically saved to your browser's local storage. You never have to worry about losing your notes.

### Action Items
Mark important notes as action items to make them stand out. They appear with:
- Orange/amber left border (5px thick)
- Yellow/amber background highlight
- "ACTION ITEM" badge
- Special styling in exports

### Search Functionality
The search feature searches across:
- Meeting titles
- Attendees
- Tags
- Note content

### Filter Options
- **All Meetings**: Show everything
- **Today**: Meetings scheduled for today
- **This Week**: Meetings in the last 7 days
- **This Month**: Meetings in the last 30 days
- **Has Action Items**: Only meetings with action items

### Sort Options
- **Most Recent**: Newest meetings first (default)
- **Oldest First**: Oldest meetings first
- **Title (A-Z)**: Alphabetical by title
- **Most Notes**: Meetings with most notes first

### Calendar Synchronization

#### Exporting to Calendar (.ICS)
1. Open any meeting
2. Click "Export .ICS"
3. A calendar file will download
4. Open the .ics file to add to your calendar app (Google Calendar, Outlook, Apple Calendar, etc.)

The exported .ICS file includes:
- Meeting title
- Start and end times
- Location/link
- Attendees list
- All notes in the description
- Action items marked with [ACTION] prefix

#### Importing from Calendar
1. Export an event from your calendar app as .ics
2. Open a meeting or create a new one
3. Click "Import .ICS"
4. Select the .ics file
5. The meeting details will be populated automatically

### Text Export Format
Exported text files include:
- Meeting title with underline
- Start and end times
- Location (if provided)
- Attendees list
- Tags
- All notes with timestamps
- Action items marked with ⚡ symbol

### Tags System
Add multiple tags separated by commas (e.g., "sprint-planning, review, team-sync"). Tags appear as colored badges on meeting cards and help with organization and searching.

### Keyboard Shortcuts
- `Ctrl/Cmd + Enter`: Add or update note (while focused in note input area)

## Data Storage

All data is stored locally in your browser using `localStorage`. This means:
- ✅ Your notes are private and never sent to any server
- ✅ Notes persist even after closing the browser
- ✅ Dark mode preference is saved
- ⚠️ Notes are specific to the browser and device you're using
- ⚠️ Clearing browser data will delete your notes (use Export to back up important meetings)

## Browser Compatibility

Works on all modern browsers:
- Chrome/Edge 90+ (recommended)
- Firefox 88+
- Safari 14+
- Opera 76+

## Privacy

This app runs entirely in your browser. No data is ever transmitted to any server. All your meeting notes stay on your device. The app does not use any tracking, analytics, or third-party services.

## Tips & Best Practices

1. **Regular Exports**: Export important meetings to .txt or .ics files for backup
2. **Use Action Items**: Mark follow-up tasks as action items for easy tracking
3. **Tag Everything**: Use tags to organize meetings by project, team, or topic
4. **Search Often**: Use the search to quickly find past discussions
5. **Filter by Action Items**: Use the "Has Action Items" filter to review pending tasks
6. **Dark Mode**: Enable dark mode for comfortable evening work
7. **Calendar Sync**: Export meetings to your calendar for scheduling
8. **Edit Notes**: Don't hesitate to edit notes if you need to clarify or add details

## Technical Details

- **Framework**: Vanilla JavaScript (ES6+)
- **Storage**: Browser LocalStorage API
- **Styling**: CSS3 with CSS Variables (custom properties)
- **Layout**: Flexbox and CSS Grid
- **Animations**: CSS transitions and keyframe animations
- **Size**: ~30KB total (uncompressed)
- **Dependencies**: None

### CSS Features
- CSS Variables for theming
- Dark mode support
- Responsive breakpoints at 768px and 480px
- Custom scrollbar styling
- Smooth animations and transitions

### JavaScript Features
- ES6 Classes
- LocalStorage API
- FileReader API (for .ics import)
- Blob API (for file downloads)
- Date manipulation
- Regular expressions for parsing

## New in Enhanced Version

### Version 2.0 Enhancements
- ✨ Dark mode with persistent preference
- 🔍 Full-text search across all meetings and notes
- 🏷️ Tags system for better organization
- 📅 Calendar synchronization (.ICS import/export)
- 📊 Statistics dashboard
- ✏️ Note editing capability
- 📍 Location/meeting link field
- ⏰ Meeting end time tracking
- 🎨 Enhanced UI with better animations
- 🎯 Advanced filtering (today, week, month, action items)
- 🔄 Multiple sorting options
- 📱 Improved mobile responsiveness
- 🎭 Better visual feedback and hover effects
- 🌈 Tag badges on meeting cards
- 📈 Meeting duration calculation

## Future Enhancements

Potential features for future versions:
- Markdown support in notes
- Rich text formatting
- File attachments
- Meeting templates
- Recurring meetings
- Note categories
- Bulk export
- Print functionality
- Collaborative features (with backend)
- Cloud sync options
- Meeting reminders
- Voice-to-text notes
- PDF export
- Meeting analytics
- Integration with other calendar services

## Troubleshooting

### Notes Not Saving
- Check if you have sufficient localStorage space
- Some browsers in private/incognito mode may not persist data
- Check browser console for errors

### Dark Mode Not Persisting
- Ensure cookies/localStorage are not being cleared on browser close
- Check browser settings

### .ICS Import Not Working
- Ensure the .ics file is valid (exported from a calendar app)
- Check browser console for parsing errors
- Some complex calendar formats may not be fully supported

### Search Not Working
- Search is case-insensitive
- Ensure you're searching for text that exists in meetings
- Clear filters if no results appear

## Support

If you encounter any issues or have suggestions for new features, please:
1. Check the troubleshooting section above
2. Review the browser console for errors
3. Report issues on the repository

## License

Free to use and modify for personal or commercial projects.

---

**Enjoy taking better meeting notes with enhanced productivity!** 🚀
