// Meeting Notes App
class MeetingNotesApp {
    constructor() {
        this.meetings = this.loadMeetings();
        this.currentMeetingId = null;
        this.initializeElements();
        this.attachEventListeners();
        this.render();
    }

    initializeElements() {
        // Buttons
        this.newMeetingBtn = document.getElementById('newMeetingBtn');
        this.backBtn = document.getElementById('backBtn');
        this.exportBtn = document.getElementById('exportBtn');
        this.deleteMeetingBtn = document.getElementById('deleteMeetingBtn');
        this.addNoteBtn = document.getElementById('addNoteBtn');

        // Views
        this.meetingList = document.getElementById('meetingList');
        this.meetingEditor = document.getElementById('meetingEditor');
        this.meetingsContainer = document.getElementById('meetingsContainer');
        this.notesContainer = document.getElementById('notesContainer');

        // Inputs
        this.meetingTitle = document.getElementById('meetingTitle');
        this.meetingDate = document.getElementById('meetingDate');
        this.meetingAttendees = document.getElementById('meetingAttendees');
        this.noteInput = document.getElementById('noteInput');
        this.isActionItem = document.getElementById('isActionItem');
    }

    attachEventListeners() {
        this.newMeetingBtn.addEventListener('click', () => this.createNewMeeting());
        this.backBtn.addEventListener('click', () => this.showMeetingList());
        this.exportBtn.addEventListener('click', () => this.exportMeeting());
        this.deleteMeetingBtn.addEventListener('click', () => this.deleteMeeting());
        this.addNoteBtn.addEventListener('click', () => this.addNote());

        // Auto-save on input changes
        this.meetingTitle.addEventListener('input', () => this.saveMeetingInfo());
        this.meetingDate.addEventListener('change', () => this.saveMeetingInfo());
        this.meetingAttendees.addEventListener('input', () => this.saveMeetingInfo());

        // Add note on Enter (Ctrl/Cmd + Enter)
        this.noteInput.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                this.addNote();
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

    createNewMeeting() {
        const now = new Date();
        const meeting = {
            id: Date.now().toString(),
            title: 'Untitled Meeting',
            date: now.toISOString().slice(0, 16),
            attendees: '',
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
        this.meetingList.classList.remove('hidden');
        this.meetingEditor.classList.add('hidden');
        this.renderMeetingList();
    }

    showMeetingEditor(meetingId) {
        this.currentMeetingId = meetingId;
        this.meetingList.classList.add('hidden');
        this.meetingEditor.classList.remove('hidden');
        this.renderMeetingEditor();
    }

    renderMeetingList() {
        if (this.meetings.length === 0) {
            this.meetingsContainer.innerHTML = `
                <div class="empty-state">
                    <p>No meetings yet</p>
                    <button class="btn btn-primary" onclick="app.createNewMeeting()">Create Your First Meeting</button>
                </div>
            `;
            return;
        }

        this.meetingsContainer.innerHTML = this.meetings.map(meeting => {
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

            return `
                <div class="meeting-card" onclick="app.showMeetingEditor('${meeting.id}')">
                    <h3>${this.escapeHtml(meeting.title)}</h3>
                    <div class="meeting-card-meta">
                        <span>📅 ${formattedDate}</span>
                        ${meeting.attendees ? `<span>👥 ${this.escapeHtml(meeting.attendees)}</span>` : ''}
                    </div>
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
        this.meetingAttendees.value = meeting.attendees;

        // Render notes
        this.renderNotes(meeting);
    }

    renderNotes(meeting) {
        if (meeting.notes.length === 0) {
            this.notesContainer.innerHTML = '<p style="color: #999; text-align: center; padding: 40px 0;">No notes yet. Add your first note above.</p>';
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
                        <div>
                            <span class="note-timestamp">${formattedTime}</span>
                            ${note.isActionItem ? '<span class="note-badge">Action Item</span>' : ''}
                        </div>
                        <button class="note-delete" onclick="app.deleteNote(${index})" title="Delete note">✕</button>
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
        meeting.attendees = this.meetingAttendees.value;
        meeting.updatedAt = new Date().toISOString();

        this.saveMeetings();
    }

    addNote() {
        const content = this.noteInput.value.trim();
        if (!content) return;

        const meeting = this.meetings.find(m => m.id === this.currentMeetingId);
        if (!meeting) return;

        const note = {
            content: content,
            timestamp: new Date().toISOString(),
            isActionItem: this.isActionItem.checked
        };

        meeting.notes.push(note);
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

    deleteNote(index) {
        if (!confirm('Delete this note?')) return;

        const meeting = this.meetings.find(m => m.id === this.currentMeetingId);
        if (!meeting) return;

        meeting.notes.splice(index, 1);
        meeting.updatedAt = new Date().toISOString();
        this.saveMeetings();

        this.renderNotes(meeting);
    }

    deleteMeeting() {
        if (!confirm('Delete this meeting? This cannot be undone.')) return;

        this.meetings = this.meetings.filter(m => m.id !== this.currentMeetingId);
        this.saveMeetings();
        this.showMeetingList();
    }

    exportMeeting() {
        const meeting = this.meetings.find(m => m.id === this.currentMeetingId);
        if (!meeting) return;

        const date = new Date(meeting.date);
        const formattedDate = date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        let text = `${meeting.title}\n`;
        text += `${'='.repeat(meeting.title.length)}\n\n`;
        text += `Date: ${formattedDate}\n`;
        if (meeting.attendees) {
            text += `Attendees: ${meeting.attendees}\n`;
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
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${meeting.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
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
