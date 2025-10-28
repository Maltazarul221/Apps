// Meeting Notes App - Enhanced Version
class MeetingNotesApp {
    constructor() {
        this.meetings = this.loadMeetings();
        this.currentMeetingId = null;
        this.currentEditingNoteIndex = null;
        this.searchQuery = '';
        this.sortBy = 'recent';
        this.filterBy = 'all';
        this.initializeElements();
        this.attachEventListeners();
        this.loadTheme();
        this.render();
    }

    initializeElements() {
        // Buttons
        this.newMeetingBtn = document.getElementById('newMeetingBtn');
        this.backBtn = document.getElementById('backBtn');
        this.exportTxtBtn = document.getElementById('exportTxtBtn');
        this.exportIcsBtn = document.getElementById('exportIcsBtn');
        this.importIcsBtn = document.getElementById('importIcsBtn');
        this.deleteMeetingBtn = document.getElementById('deleteMeetingBtn');
        this.addNoteBtn = document.getElementById('addNoteBtn');
        this.themeToggle = document.getElementById('themeToggle');
        this.statsBtn = document.getElementById('statsBtn');
        this.closeStatsBtn = document.getElementById('closeStatsBtn');

        // Views
        this.meetingList = document.getElementById('meetingList');
        this.meetingEditor = document.getElementById('meetingEditor');
        this.meetingsContainer = document.getElementById('meetingsContainer');
        this.notesContainer = document.getElementById('notesContainer');
        this.statsModal = document.getElementById('statsModal');

        // Inputs
        this.meetingTitle = document.getElementById('meetingTitle');
        this.meetingDate = document.getElementById('meetingDate');
        this.meetingEndDate = document.getElementById('meetingEndDate');
        this.meetingAttendees = document.getElementById('meetingAttendees');
        this.meetingTags = document.getElementById('meetingTags');
        this.meetingLocation = document.getElementById('meetingLocation');
        this.noteInput = document.getElementById('noteInput');
        this.isActionItem = document.getElementById('isActionItem');
        this.searchInput = document.getElementById('searchInput');
        this.sortBySelect = document.getElementById('sortBy');
        this.filterBySelect = document.getElementById('filterBy');
        this.icsFileInput = document.getElementById('icsFileInput');
    }

    attachEventListeners() {
        this.newMeetingBtn.addEventListener('click', () => this.createNewMeeting());
        this.backBtn.addEventListener('click', () => this.showMeetingList());
        this.exportTxtBtn.addEventListener('click', () => this.exportMeetingTxt());
        this.exportIcsBtn.addEventListener('click', () => this.exportMeetingIcs());
        this.importIcsBtn.addEventListener('click', () => this.icsFileInput.click());
        this.icsFileInput.addEventListener('change', (e) => this.importIcs(e));
        this.deleteMeetingBtn.addEventListener('click', () => this.deleteMeeting());
        this.addNoteBtn.addEventListener('click', () => this.addOrUpdateNote());
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        this.statsBtn.addEventListener('click', () => this.showStats());
        this.closeStatsBtn.addEventListener('click', () => this.hideStats());

        // Auto-save on input changes
        this.meetingTitle.addEventListener('input', () => this.saveMeetingInfo());
        this.meetingDate.addEventListener('change', () => this.saveMeetingInfo());
        this.meetingEndDate.addEventListener('change', () => this.saveMeetingInfo());
        this.meetingAttendees.addEventListener('input', () => this.saveMeetingInfo());
        this.meetingTags.addEventListener('input', () => this.saveMeetingInfo());
        this.meetingLocation.addEventListener('input', () => this.saveMeetingInfo());

        // Search and filter
        this.searchInput.addEventListener('input', (e) => {
            this.searchQuery = e.target.value.toLowerCase();
            this.renderMeetingList();
        });

        this.sortBySelect.addEventListener('change', (e) => {
            this.sortBy = e.target.value;
            this.renderMeetingList();
        });

        this.filterBySelect.addEventListener('change', (e) => {
            this.filterBy = e.target.value;
            this.renderMeetingList();
        });

        // Add note on Enter (Ctrl/Cmd + Enter)
        this.noteInput.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                this.addOrUpdateNote();
            }
        });

        // Close modal on background click
        this.statsModal.addEventListener('click', (e) => {
            if (e.target === this.statsModal) {
                this.hideStats();
            }
        });
    }

    loadMeetings() {
        const stored = localStorage.getItem('meetingNotes');
        return stored ? JSON.parse(stored) : [];
    }

    saveMeetings() {
        localStorage.setItem('meetingNotes', JSON.stringify(this.meetings));
    }

    loadTheme() {
        const theme = localStorage.getItem('theme') || 'light';
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            this.themeToggle.querySelector('.icon').textContent = '☀️';
        }
    }

    toggleTheme() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        this.themeToggle.querySelector('.icon').textContent = isDark ? '☀️' : '🌙';
    }

    createNewMeeting() {
        const now = new Date();
        const endTime = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour later

        const meeting = {
            id: Date.now().toString(),
            title: 'Untitled Meeting',
            date: now.toISOString().slice(0, 16),
            endDate: endTime.toISOString().slice(0, 16),
            attendees: '',
            location: '',
            tags: '',
            notes: [],
            createdAt: now.toISOString(),
            updatedAt: now.toISOString()
        };

        this.meetings.unshift(meeting);
        this.saveMeetings();
        this.showMeetingEditor(meeting.id);
    }

    showMeetingList() {
        this.currentMeetingId = null;
        this.currentEditingNoteIndex = null;
        this.meetingList.classList.remove('hidden');
        this.meetingEditor.classList.add('hidden');
        this.renderMeetingList();
    }

    showMeetingEditor(meetingId) {
        this.currentMeetingId = meetingId;
        this.currentEditingNoteIndex = null;
        this.noteInput.value = '';
        this.isActionItem.checked = false;
        this.addNoteBtn.textContent = 'Add Note';
        this.meetingList.classList.add('hidden');
        this.meetingEditor.classList.remove('hidden');
        this.renderMeetingEditor();
    }

    filterMeetings(meetings) {
        let filtered = [...meetings];

        // Apply search filter
        if (this.searchQuery) {
            filtered = filtered.filter(meeting => {
                const titleMatch = meeting.title.toLowerCase().includes(this.searchQuery);
                const attendeesMatch = meeting.attendees.toLowerCase().includes(this.searchQuery);
                const tagsMatch = meeting.tags.toLowerCase().includes(this.searchQuery);
                const notesMatch = meeting.notes.some(note =>
                    note.content.toLowerCase().includes(this.searchQuery)
                );
                return titleMatch || attendeesMatch || tagsMatch || notesMatch;
            });
        }

        // Apply date filter
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

        if (this.filterBy === 'today') {
            filtered = filtered.filter(m => new Date(m.date) >= today);
        } else if (this.filterBy === 'week') {
            filtered = filtered.filter(m => new Date(m.date) >= weekAgo);
        } else if (this.filterBy === 'month') {
            filtered = filtered.filter(m => new Date(m.date) >= monthAgo);
        } else if (this.filterBy === 'actions') {
            filtered = filtered.filter(m => m.notes.some(n => n.isActionItem));
        }

        return filtered;
    }

    sortMeetings(meetings) {
        const sorted = [...meetings];

        if (this.sortBy === 'recent') {
            sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (this.sortBy === 'oldest') {
            sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
        } else if (this.sortBy === 'title') {
            sorted.sort((a, b) => a.title.localeCompare(b.title));
        } else if (this.sortBy === 'notes') {
            sorted.sort((a, b) => b.notes.length - a.notes.length);
        }

        return sorted;
    }

    renderMeetingList() {
        let displayMeetings = this.filterMeetings(this.meetings);
        displayMeetings = this.sortMeetings(displayMeetings);

        if (displayMeetings.length === 0) {
            if (this.meetings.length === 0) {
                this.meetingsContainer.innerHTML = `
                    <div class="empty-state">
                        <p>No meetings yet</p>
                        <button class="btn btn-primary" onclick="app.createNewMeeting()">Create Your First Meeting</button>
                    </div>
                `;
            } else {
                this.meetingsContainer.innerHTML = `
                    <div class="empty-state">
                        <p>No meetings match your search or filters</p>
                    </div>
                `;
            }
            return;
        }

        this.meetingsContainer.innerHTML = displayMeetings.map(meeting => {
            const date = new Date(meeting.date);
            const formattedDate = date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            const notesCount = meeting.notes.length;
            const actionItemsCount = meeting.notes.filter(n => n.isActionItem).length;
            const tags = meeting.tags ? meeting.tags.split(',').map(t => t.trim()).filter(t => t) : [];

            return `
                <div class="meeting-card" onclick="app.showMeetingEditor('${meeting.id}')">
                    <h3>${this.escapeHtml(meeting.title)}</h3>
                    <div class="meeting-card-meta">
                        <span>📅 ${formattedDate}</span>
                        ${meeting.attendees ? `<span>👥 ${this.escapeHtml(meeting.attendees)}</span>` : ''}
                        ${meeting.location ? `<span>📍 ${this.escapeHtml(meeting.location)}</span>` : ''}
                    </div>
                    ${tags.length > 0 ? `
                        <div class="meeting-card-meta">
                            ${tags.map(tag => `<span class="tag-badge">${this.escapeHtml(tag)}</span>`).join('')}
                        </div>
                    ` : ''}
                    <div class="meeting-card-stats">
                        <span>📝 ${notesCount} note${notesCount !== 1 ? 's' : ''}</span>
                        ${actionItemsCount > 0 ? `<span>⚡ ${actionItemsCount} action item${actionItemsCount !== 1 ? 's' : ''}</span>` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    renderMeetingEditor() {
        const meeting = this.meetings.find(m => m.id === this.currentMeetingId);
        if (!meeting) {
            this.showMeetingList();
            return;
        }

        // Populate meeting info
        this.meetingTitle.value = meeting.title;
        this.meetingDate.value = meeting.date;
        this.meetingEndDate.value = meeting.endDate || meeting.date;
        this.meetingAttendees.value = meeting.attendees || '';
        this.meetingTags.value = meeting.tags || '';
        this.meetingLocation.value = meeting.location || '';

        // Render notes
        this.renderNotes(meeting);
    }

    renderNotes(meeting) {
        if (meeting.notes.length === 0) {
            this.notesContainer.innerHTML = '<p style="color: var(--text-tertiary); text-align: center; padding: 40px 0;">No notes yet. Add your first note above.</p>';
            return;
        }

        this.notesContainer.innerHTML = meeting.notes.map((note, index) => {
            const timestamp = new Date(note.timestamp);
            const formattedTime = timestamp.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            });

            return `
                <div class="note-item ${note.isActionItem ? 'action-item' : ''}">
                    <div class="note-header">
                        <div class="note-header-left">
                            <span class="note-timestamp">${formattedTime}</span>
                            ${note.isActionItem ? '<span class="note-badge">Action Item</span>' : ''}
                        </div>
                        <div class="note-actions-right">
                            <button class="note-edit" onclick="app.editNote(${index})" title="Edit note">✏️</button>
                            <button class="note-delete" onclick="app.deleteNote(${index})" title="Delete note">✕</button>
                        </div>
                    </div>
                    <div class="note-content">${this.escapeHtml(note.content)}</div>
                </div>
            `;
        }).join('');
    }

    saveMeetingInfo() {
        const meeting = this.meetings.find(m => m.id === this.currentMeetingId);
        if (!meeting) return;

        meeting.title = this.meetingTitle.value || 'Untitled Meeting';
        meeting.date = this.meetingDate.value;
        meeting.endDate = this.meetingEndDate.value;
        meeting.attendees = this.meetingAttendees.value;
        meeting.tags = this.meetingTags.value;
        meeting.location = this.meetingLocation.value;
        meeting.updatedAt = new Date().toISOString();

        this.saveMeetings();
    }

    addOrUpdateNote() {
        const content = this.noteInput.value.trim();
        if (!content) return;

        const meeting = this.meetings.find(m => m.id === this.currentMeetingId);
        if (!meeting) return;

        if (this.currentEditingNoteIndex !== null) {
            // Update existing note
            meeting.notes[this.currentEditingNoteIndex].content = content;
            meeting.notes[this.currentEditingNoteIndex].isActionItem = this.isActionItem.checked;
            this.currentEditingNoteIndex = null;
            this.addNoteBtn.textContent = 'Add Note';
        } else {
            // Add new note
            const note = {
                content: content,
                timestamp: new Date().toISOString(),
                isActionItem: this.isActionItem.checked
            };
            meeting.notes.push(note);
        }

        meeting.updatedAt = new Date().toISOString();
        this.saveMeetings();

        // Clear inputs
        this.noteInput.value = '';
        this.isActionItem.checked = false;

        // Re-render notes
        this.renderNotes(meeting);

        // Focus back on note input
        this.noteInput.focus();
    }

    editNote(index) {
        const meeting = this.meetings.find(m => m.id === this.currentMeetingId);
        if (!meeting) return;

        const note = meeting.notes[index];
        this.noteInput.value = note.content;
        this.isActionItem.checked = note.isActionItem;
        this.currentEditingNoteIndex = index;
        this.addNoteBtn.textContent = 'Update Note';
        this.noteInput.focus();
        this.noteInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    deleteNote(index) {
        if (!confirm('Delete this note?')) return;

        const meeting = this.meetings.find(m => m.id === this.currentMeetingId);
        if (!meeting) return;

        meeting.notes.splice(index, 1);
        meeting.updatedAt = new Date().toISOString();
        this.saveMeetings();

        // Clear editing state if deleting the note being edited
        if (this.currentEditingNoteIndex === index) {
            this.currentEditingNoteIndex = null;
            this.noteInput.value = '';
            this.isActionItem.checked = false;
            this.addNoteBtn.textContent = 'Add Note';
        }

        this.renderNotes(meeting);
    }

    deleteMeeting() {
        if (!confirm('Delete this meeting? This cannot be undone.')) return;

        this.meetings = this.meetings.filter(m => m.id !== this.currentMeetingId);
        this.saveMeetings();
        this.showMeetingList();
    }

    exportMeetingTxt() {
        const meeting = this.meetings.find(m => m.id === this.currentMeetingId);
        if (!meeting) return;

        const date = new Date(meeting.date);
        const endDate = new Date(meeting.endDate);
        const formattedDate = date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        const formattedEndDate = endDate.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        let text = `${meeting.title}\n`;
        text += `${'='.repeat(meeting.title.length)}\n\n`;
        text += `Start: ${formattedDate}\n`;
        text += `End: ${formattedEndDate}\n`;
        if (meeting.location) {
            text += `Location: ${meeting.location}\n`;
        }
        if (meeting.attendees) {
            text += `Attendees: ${meeting.attendees}\n`;
        }
        if (meeting.tags) {
            text += `Tags: ${meeting.tags}\n`;
        }
        text += `\n`;

        if (meeting.notes.length > 0) {
            text += `Notes:\n${'─'.repeat(50)}\n\n`;

            meeting.notes.forEach(note => {
                const timestamp = new Date(note.timestamp);
                const time = timestamp.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                });

                if (note.isActionItem) {
                    text += `⚡ [ACTION ITEM] `;
                }
                text += `[${time}] ${note.content}\n\n`;
            });
        }

        // Create download
        this.downloadFile(text, `${this.sanitizeFilename(meeting.title)}_${Date.now()}.txt`, 'text/plain');
    }

    exportMeetingIcs() {
        const meeting = this.meetings.find(m => m.id === this.currentMeetingId);
        if (!meeting) return;

        const startDate = new Date(meeting.date);
        const endDate = new Date(meeting.endDate);

        // Format dates for ICS (YYYYMMDDTHHMMSSZ)
        const formatIcsDate = (date) => {
            return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        };

        // Combine notes into description
        let description = '';
        if (meeting.notes.length > 0) {
            description = meeting.notes.map(note => {
                const prefix = note.isActionItem ? '[ACTION] ' : '';
                return prefix + note.content;
            }).join('\\n\\n');
        }

        // Build ICS content
        let ics = 'BEGIN:VCALENDAR\r\n';
        ics += 'VERSION:2.0\r\n';
        ics += 'PRODID:-//Meeting Notes App//EN\r\n';
        ics += 'CALSCALE:GREGORIAN\r\n';
        ics += 'METHOD:PUBLISH\r\n';
        ics += 'BEGIN:VEVENT\r\n';
        ics += `UID:${meeting.id}@meetingnotes\r\n`;
        ics += `DTSTAMP:${formatIcsDate(new Date())}\r\n`;
        ics += `DTSTART:${formatIcsDate(startDate)}\r\n`;
        ics += `DTEND:${formatIcsDate(endDate)}\r\n`;
        ics += `SUMMARY:${this.escapeIcs(meeting.title)}\r\n`;

        if (description) {
            ics += `DESCRIPTION:${this.escapeIcs(description)}\r\n`;
        }

        if (meeting.location) {
            ics += `LOCATION:${this.escapeIcs(meeting.location)}\r\n`;
        }

        if (meeting.attendees) {
            const attendeeList = meeting.attendees.split(',').map(a => a.trim());
            attendeeList.forEach(attendee => {
                ics += `ATTENDEE:CN=${this.escapeIcs(attendee)}\r\n`;
            });
        }

        ics += 'END:VEVENT\r\n';
        ics += 'END:VCALENDAR\r\n';

        this.downloadFile(ics, `${this.sanitizeFilename(meeting.title)}_${Date.now()}.ics`, 'text/calendar');
    }

    importIcs(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const icsContent = e.target.result;
                const meeting = this.parseIcs(icsContent);

                if (meeting) {
                    this.meetings.unshift(meeting);
                    this.saveMeetings();
                    alert('Meeting imported successfully!');
                    this.showMeetingEditor(meeting.id);
                } else {
                    alert('Failed to parse ICS file.');
                }
            } catch (error) {
                console.error('ICS import error:', error);
                alert('Error importing ICS file.');
            }

            // Reset file input
            this.icsFileInput.value = '';
        };
        reader.readAsText(file);
    }

    parseIcs(icsContent) {
        const lines = icsContent.split(/\r?\n/);
        const meeting = {
            id: Date.now().toString(),
            title: 'Imported Meeting',
            date: new Date().toISOString().slice(0, 16),
            endDate: new Date().toISOString().slice(0, 16),
            attendees: '',
            location: '',
            tags: 'imported',
            notes: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        let inEvent = false;
        let description = '';

        for (let line of lines) {
            line = line.trim();

            if (line === 'BEGIN:VEVENT') {
                inEvent = true;
            } else if (line === 'END:VEVENT') {
                break;
            } else if (inEvent) {
                if (line.startsWith('SUMMARY:')) {
                    meeting.title = this.unescapeIcs(line.substring(8));
                } else if (line.startsWith('DTSTART:')) {
                    const dateStr = line.substring(8);
                    meeting.date = this.parseIcsDate(dateStr);
                } else if (line.startsWith('DTEND:')) {
                    const dateStr = line.substring(6);
                    meeting.endDate = this.parseIcsDate(dateStr);
                } else if (line.startsWith('LOCATION:')) {
                    meeting.location = this.unescapeIcs(line.substring(9));
                } else if (line.startsWith('DESCRIPTION:')) {
                    description = this.unescapeIcs(line.substring(12));
                } else if (line.startsWith('ATTENDEE')) {
                    const match = line.match(/CN=([^:;]+)/);
                    if (match) {
                        meeting.attendees += (meeting.attendees ? ', ' : '') + match[1];
                    }
                }
            }
        }

        // Convert description to notes if present
        if (description) {
            const noteLines = description.split('\\n\\n');
            noteLines.forEach(noteLine => {
                if (noteLine.trim()) {
                    const isAction = noteLine.startsWith('[ACTION]');
                    const content = isAction ? noteLine.substring(8).trim() : noteLine.trim();
                    meeting.notes.push({
                        content: content,
                        timestamp: new Date().toISOString(),
                        isActionItem: isAction
                    });
                }
            });
        }

        return meeting;
    }

    parseIcsDate(dateStr) {
        // Parse YYYYMMDDTHHMMSSZ format
        const year = dateStr.substring(0, 4);
        const month = dateStr.substring(4, 6);
        const day = dateStr.substring(6, 8);
        const hour = dateStr.substring(9, 11);
        const minute = dateStr.substring(11, 13);

        return `${year}-${month}-${day}T${hour}:${minute}`;
    }

    showStats() {
        const stats = this.calculateStats();
        const statsContent = document.getElementById('statsContent');

        statsContent.innerHTML = `
            <div class="stat-card">
                <div class="stat-value">${stats.totalMeetings}</div>
                <div class="stat-label">Total Meetings</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${stats.totalNotes}</div>
                <div class="stat-label">Total Notes</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${stats.totalActionItems}</div>
                <div class="stat-label">Action Items</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${stats.meetingsThisWeek}</div>
                <div class="stat-label">This Week</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${stats.meetingsThisMonth}</div>
                <div class="stat-label">This Month</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${stats.avgNotesPerMeeting}</div>
                <div class="stat-label">Avg Notes/Meeting</div>
            </div>
        `;

        this.statsModal.classList.remove('hidden');
    }

    hideStats() {
        this.statsModal.classList.add('hidden');
    }

    calculateStats() {
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const stats = {
            totalMeetings: this.meetings.length,
            totalNotes: 0,
            totalActionItems: 0,
            meetingsThisWeek: 0,
            meetingsThisMonth: 0,
            avgNotesPerMeeting: 0
        };

        this.meetings.forEach(meeting => {
            const meetingDate = new Date(meeting.date);
            stats.totalNotes += meeting.notes.length;
            stats.totalActionItems += meeting.notes.filter(n => n.isActionItem).length;

            if (meetingDate >= weekAgo) {
                stats.meetingsThisWeek++;
            }
            if (meetingDate >= monthAgo) {
                stats.meetingsThisMonth++;
            }
        });

        stats.avgNotesPerMeeting = stats.totalMeetings > 0
            ? Math.round(stats.totalNotes / stats.totalMeetings * 10) / 10
            : 0;

        return stats;
    }

    downloadFile(content, filename, type) {
        const blob = new Blob([content], { type: type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    sanitizeFilename(filename) {
        return filename.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    escapeIcs(text) {
        return text.replace(/\\/g, '\\\\')
                  .replace(/;/g, '\\;')
                  .replace(/,/g, '\\,')
                  .replace(/\n/g, '\\n');
    }

    unescapeIcs(text) {
        return text.replace(/\\n/g, '\n')
                  .replace(/\\,/g, ',')
                  .replace(/\\;/g, ';')
                  .replace(/\\\\/g, '\\');
    }

    render() {
        this.showMeetingList();
    }
}

// Initialize app
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new MeetingNotesApp();
});
