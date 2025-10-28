// Meeting Notes App - Enhanced Version with Voice Recognition
class MeetingNotesApp {
    constructor() {
        this.meetings = this.loadMeetings();
        this.users = this.loadUsers();
        this.loginData = this.loadLoginData();
        this.currentMeetingId = null;
        this.currentEditingNoteIndex = null;
        this.searchQuery = '';
        this.sortBy = 'recent';
        this.filterBy = 'all';
        this.recognition = null;
        this.isRecording = false;
        this.finalTranscript = '';
        this.interimTranscript = '';
        this.initializeElements();
        this.attachEventListeners();
        this.loadTheme();
        this.initializeVoiceRecognition();
        this.initializeEmailJS();
        this.updateLoginDisplay();
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
        this.voiceBtn = document.getElementById('voiceBtn');
        this.manageUsersBtn = document.getElementById('manageUsersBtn');
        this.emailSummaryBtn = document.getElementById('emailSummaryBtn');
        this.loginBtn = document.getElementById('loginBtn');
        this.logoutBtn = document.getElementById('logoutBtn');

        // Views
        this.meetingList = document.getElementById('meetingList');
        this.meetingEditor = document.getElementById('meetingEditor');
        this.meetingsContainer = document.getElementById('meetingsContainer');
        this.notesContainer = document.getElementById('notesContainer');
        this.statsModal = document.getElementById('statsModal');
        this.voiceStatus = document.getElementById('voiceStatus');
        this.voiceStatusText = document.getElementById('voiceStatusText');
        this.userModal = document.getElementById('userModal');
        this.loginModal = document.getElementById('loginModal');
        this.loggedInUser = document.getElementById('loggedInUser');
        this.userEmailDisplay = document.getElementById('userEmailDisplay');

        // Inputs
        this.meetingTitle = document.getElementById('meetingTitle');
        this.meetingType = document.getElementById('meetingType');
        this.meetingDate = document.getElementById('meetingDate');
        this.meetingEndDate = document.getElementById('meetingEndDate');
        this.meetingTags = document.getElementById('meetingTags');
        this.meetingLocation = document.getElementById('meetingLocation');
        this.noteInput = document.getElementById('noteInput');
        this.isActionItem = document.getElementById('isActionItem');
        this.autoSaveNotes = document.getElementById('autoSaveNotes');
        this.searchInput = document.getElementById('searchInput');
        this.sortBySelect = document.getElementById('sortBy');
        this.filterBySelect = document.getElementById('filterBy');
        this.icsFileInput = document.getElementById('icsFileInput');

        // User management elements
        this.closeUserModalBtn = document.getElementById('closeUserModalBtn');
        this.userName = document.getElementById('userName');
        this.userEmail = document.getElementById('userEmail');
        this.userRole = document.getElementById('userRole');
        this.addUserBtn = document.getElementById('addUserBtn');
        this.usersContainer = document.getElementById('usersContainer');

        // Attendee selection elements
        this.selectedAttendees = document.getElementById('selectedAttendees');
        this.selectAttendeesBtn = document.getElementById('selectAttendeesBtn');
        this.attendeesDropdown = document.getElementById('attendeesDropdown');
        this.attendeeSearch = document.getElementById('attendeeSearch');
        this.attendeesList = document.getElementById('attendeesList');

        // Login form elements
        this.closeLoginModalBtn = document.getElementById('closeLoginModalBtn');
        this.loginEmail = document.getElementById('loginEmail');
        this.loginName = document.getElementById('loginName');
        this.emailjsServiceId = document.getElementById('emailjsServiceId');
        this.emailjsTemplateId = document.getElementById('emailjsTemplateId');
        this.emailjsPublicKey = document.getElementById('emailjsPublicKey');
        this.loginSubmitBtn = document.getElementById('loginSubmitBtn');

        // Template buttons
        this.templateButtons = document.querySelectorAll('.btn-template');
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
        this.voiceBtn.addEventListener('click', () => this.toggleVoiceRecognition());
        this.manageUsersBtn.addEventListener('click', () => this.showUserModal());
        this.emailSummaryBtn.addEventListener('click', () => this.generateEmailSummary());
        this.loginBtn.addEventListener('click', () => this.showLoginModal());
        this.logoutBtn.addEventListener('click', () => this.logout());

        // Login modal listeners
        this.closeLoginModalBtn.addEventListener('click', () => this.hideLoginModal());
        this.loginSubmitBtn.addEventListener('click', () => this.login());
        this.loginModal.addEventListener('click', (e) => {
            if (e.target === this.loginModal) {
                this.hideLoginModal();
            }
        });

        // User management listeners
        this.closeUserModalBtn.addEventListener('click', () => this.hideUserModal());
        this.addUserBtn.addEventListener('click', () => this.addUser());
        this.userModal.addEventListener('click', (e) => {
            if (e.target === this.userModal) {
                this.hideUserModal();
            }
        });

        // Attendee selection listeners
        this.selectAttendeesBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleAttendeeDropdown();
        });
        this.attendeeSearch.addEventListener('input', (e) => this.filterAttendees(e.target.value));

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.attendeesDropdown.contains(e.target) && e.target !== this.selectAttendeesBtn) {
                this.attendeesDropdown.classList.add('hidden');
            }
        });

        // Auto-save on input changes
        this.meetingTitle.addEventListener('input', () => this.saveMeetingInfo());
        this.meetingType.addEventListener('change', () => this.saveMeetingInfo());
        this.meetingDate.addEventListener('change', () => this.saveMeetingInfo());
        this.meetingEndDate.addEventListener('change', () => this.saveMeetingInfo());
        this.meetingTags.addEventListener('input', () => this.saveMeetingInfo());
        this.meetingLocation.addEventListener('input', () => this.saveMeetingInfo());

        // Template buttons
        this.templateButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.applyTemplate(btn.dataset.template);
            });
        });

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

    loadUsers() {
        const stored = localStorage.getItem('staffMembers');
        return stored ? JSON.parse(stored) : [];
    }

    saveUsers() {
        localStorage.setItem('staffMembers', JSON.stringify(this.users));
    }

    loadLoginData() {
        const stored = localStorage.getItem('loginData');
        return stored ? JSON.parse(stored) : null;
    }

    saveLoginData(data) {
        localStorage.setItem('loginData', JSON.stringify(data));
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
            title: 'New Session',
            meetingType: '',
            date: now.toISOString().slice(0, 16),
            endDate: endTime.toISOString().slice(0, 16),
            attendeeIds: [],
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

                // Handle both old attendees string and new attendeeIds array
                let attendeesMatch = false;
                if (meeting.attendees) {
                    attendeesMatch = meeting.attendees.toLowerCase().includes(this.searchQuery);
                } else if (meeting.attendeeIds && meeting.attendeeIds.length > 0) {
                    const attendeeNames = meeting.attendeeIds
                        .map(id => this.users.find(u => u.id === id))
                        .filter(u => u)
                        .map(u => u.name.toLowerCase());
                    attendeesMatch = attendeeNames.some(name => name.includes(this.searchQuery));
                }

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
        } else if (this.filterBy.startsWith('type-')) {
            // Filter by meeting type
            const meetingType = this.filterBy.replace('type-', '');
            filtered = filtered.filter(m => m.meetingType === meetingType);
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

            // Format meeting type for display
            const meetingTypeDisplay = meeting.meetingType ?
                meeting.meetingType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : '';

            // Get attendee names from IDs
            let attendeesDisplay = '';
            if (meeting.attendeeIds && meeting.attendeeIds.length > 0) {
                const attendeeNames = meeting.attendeeIds
                    .map(id => this.users.find(u => u.id === id))
                    .filter(u => u)
                    .map(u => u.name);
                if (attendeeNames.length > 0) {
                    attendeesDisplay = attendeeNames.join(', ');
                }
            } else if (meeting.attendees) {
                // Fallback for old format
                attendeesDisplay = meeting.attendees;
            }

            return `
                <div class="meeting-card" onclick="app.showMeetingEditor('${meeting.id}')">
                    <h3>${this.escapeHtml(meeting.title)}</h3>
                    ${meetingTypeDisplay ? `<div class="meeting-type-badge">📋 ${meetingTypeDisplay}</div>` : ''}
                    <div class="meeting-card-meta">
                        <span>📅 ${formattedDate}</span>
                        ${attendeesDisplay ? `<span>👥 ${this.escapeHtml(attendeesDisplay)}</span>` : ''}
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
        this.meetingType.value = meeting.meetingType || '';
        this.meetingDate.value = meeting.date;
        this.meetingEndDate.value = meeting.endDate || meeting.date;
        this.meetingTags.value = meeting.tags || '';
        this.meetingLocation.value = meeting.location || '';

        // Render selected attendees
        this.renderSelectedAttendees();

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

        meeting.title = this.meetingTitle.value || 'New Session';
        meeting.meetingType = this.meetingType.value;
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

        // Handle both new and old attendee format
        if (meeting.attendeeIds && meeting.attendeeIds.length > 0) {
            const attendees = meeting.attendeeIds
                .map(id => this.users.find(u => u.id === id))
                .filter(u => u);
            if (attendees.length > 0) {
                const attendeeNames = attendees.map(u => `${u.name} (${u.email})`).join(', ');
                text += `Attendees: ${attendeeNames}\n`;
            }
        } else if (meeting.attendees) {
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

        // Add attendees - handle both new and old format
        if (meeting.attendeeIds && meeting.attendeeIds.length > 0) {
            const attendees = meeting.attendeeIds
                .map(id => this.users.find(u => u.id === id))
                .filter(u => u);
            attendees.forEach(attendee => {
                ics += `ATTENDEE;CN=${this.escapeIcs(attendee.name)}:mailto:${attendee.email}\r\n`;
            });
        } else if (meeting.attendees) {
            // Fallback for old format
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
            meetingType: '',
            date: new Date().toISOString().slice(0, 16),
            endDate: new Date().toISOString().slice(0, 16),
            attendeeIds: [],
            location: '',
            tags: 'imported',
            notes: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        let inEvent = false;
        let description = '';
        let attendeeNames = []; // Store names temporarily for old format

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
                        attendeeNames.push(match[1]);
                    }
                }
            }
        }

        // Try to match imported attendees with existing users
        if (attendeeNames.length > 0) {
            attendeeNames.forEach(name => {
                const user = this.users.find(u => u.name.toLowerCase() === name.toLowerCase());
                if (user && !meeting.attendeeIds.includes(user.id)) {
                    meeting.attendeeIds.push(user.id);
                }
            });
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

    // Voice Recognition Methods
    initializeVoiceRecognition() {
        // Check if browser supports Speech Recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            console.warn('Speech Recognition not supported in this browser');
            if (this.voiceBtn) {
                this.voiceBtn.disabled = true;
                this.voiceBtn.title = 'Voice input not supported in this browser';
                this.voiceBtn.style.opacity = '0.5';
            }
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';

        this.recognition.onstart = () => {
            this.isRecording = true;
            this.finalTranscript = '';
            this.interimTranscript = '';
            this.voiceBtn.classList.add('recording');
            this.voiceBtn.innerHTML = '<span class="icon">⏹️</span> Stop Recording';
            this.voiceStatus.classList.remove('hidden');
            this.voiceStatusText.textContent = 'Listening...';
        };

        this.recognition.onresult = (event) => {
            let interim = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;

                if (event.results[i].isFinal) {
                    this.finalTranscript += transcript + ' ';

                    // Auto-save if enabled
                    if (this.autoSaveNotes.checked) {
                        this.addVoiceNote(transcript);
                    }
                } else {
                    interim += transcript;
                }
            }

            this.interimTranscript = interim;
            this.updateNoteInput();
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.voiceStatusText.textContent = `Error: ${event.error}`;

            if (event.error === 'no-speech') {
                this.voiceStatusText.textContent = 'No speech detected. Please try again.';
            } else if (event.error === 'not-allowed') {
                this.voiceStatusText.textContent = 'Microphone access denied';
                setTimeout(() => this.stopVoiceRecognition(), 2000);
            }
        };

        this.recognition.onend = () => {
            if (this.isRecording) {
                // Restart if still recording (user didn't stop manually)
                try {
                    this.recognition.start();
                } catch (error) {
                    this.stopVoiceRecognition();
                }
            }
        };
    }

    toggleVoiceRecognition() {
        if (!this.recognition) {
            alert('Voice recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
            return;
        }

        if (this.isRecording) {
            this.stopVoiceRecognition();
        } else {
            this.startVoiceRecognition();
        }
    }

    startVoiceRecognition() {
        if (!this.recognition) return;

        try {
            this.recognition.start();
        } catch (error) {
            console.error('Failed to start voice recognition:', error);
            alert('Could not start voice recognition. Please check microphone permissions.');
        }
    }

    stopVoiceRecognition() {
        if (!this.recognition) return;

        this.isRecording = false;
        this.recognition.stop();

        this.voiceBtn.classList.remove('recording');
        this.voiceBtn.innerHTML = '<span class="icon">🎤</span> Voice Input';
        this.voiceStatus.classList.add('hidden');

        // Add final transcript to note input if auto-save is off
        if (!this.autoSaveNotes.checked && this.finalTranscript.trim()) {
            const currentText = this.noteInput.value.trim();
            this.noteInput.value = currentText ?
                currentText + ' ' + this.finalTranscript.trim() :
                this.finalTranscript.trim();
        }

        this.finalTranscript = '';
        this.interimTranscript = '';
    }

    updateNoteInput() {
        if (!this.autoSaveNotes.checked) {
            const currentText = this.noteInput.value.trim();
            const baseText = currentText || this.finalTranscript.trim();
            const displayText = baseText + (this.interimTranscript ? ' ' + this.interimTranscript : '');
            this.noteInput.value = displayText;
        } else {
            // Show only interim results when auto-saving
            this.noteInput.value = this.interimTranscript;
        }
    }

    addVoiceNote(transcript) {
        const content = transcript.trim();
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

        // Re-render notes
        this.renderNotes(meeting);

        // Clear the transcript for next phrase
        this.finalTranscript = '';
        this.voiceStatusText.textContent = 'Note saved! Listening...';

        setTimeout(() => {
            if (this.isRecording) {
                this.voiceStatusText.textContent = 'Listening...';
            }
        }, 1500);
    }

    // Quick Templates for Housekeeping
    applyTemplate(templateType) {
        let templateText = '';
        const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        switch(templateType) {
            case 'room-check':
                templateText = `Room Inspection Checklist (${now}):
- Bed made and linens fresh
- Bathroom cleaned and sanitized
- Trash emptied
- Floors vacuumed/mopped
- Surfaces dusted
- Amenities replenished
- AC/Heating functioning
- No maintenance issues observed`;
                break;

            case 'supply-list':
                templateText = `Supply Inventory Check (${now}):
- Cleaning solutions stock level:
- Towels available:
- Bed linens count:
- Toiletries inventory:
- Cleaning equipment status:
- Items needing reorder:`;
                break;

            case 'maintenance':
                templateText = `Maintenance Issues (${now}):
- Room/Area number:
- Issue description:
- Priority level (High/Medium/Low):
- Reported to maintenance: Yes/No
- Follow-up required:`;
                break;

            case 'staff-issues':
                templateText = `Staff Notes (${now}):
- Staff member(s):
- Topic/Issue:
- Action taken:
- Follow-up needed:
- Next steps:`;
                break;
        }

        // Add template to note input
        const currentText = this.noteInput.value.trim();
        this.noteInput.value = currentText ? currentText + '\n\n' + templateText : templateText;
        this.noteInput.focus();
        this.noteInput.scrollTop = this.noteInput.scrollHeight;
    }

    // User Management Methods
    showUserModal() {
        this.renderUsers();
        this.userModal.classList.remove('hidden');
    }

    hideUserModal() {
        this.userModal.classList.add('hidden');
        this.userName.value = '';
        this.userEmail.value = '';
        this.userRole.value = '';
    }

    addUser() {
        const name = this.userName.value.trim();
        const email = this.userEmail.value.trim();
        const role = this.userRole.value.trim();

        if (!name) {
            alert('Please enter a name');
            return;
        }

        if (!email) {
            alert('Please enter an email');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }

        const user = {
            id: Date.now().toString(),
            name: name,
            email: email,
            role: role || 'Staff'
        };

        this.users.push(user);
        this.saveUsers();
        this.renderUsers();

        // Clear form
        this.userName.value = '';
        this.userEmail.value = '';
        this.userRole.value = '';
        this.userName.focus();
    }

    deleteUser(userId) {
        if (!confirm('Delete this staff member? They will be removed from all meetings.')) return;

        this.users = this.users.filter(u => u.id !== userId);
        this.saveUsers();

        // Remove user from all meetings
        this.meetings.forEach(meeting => {
            if (meeting.attendeeIds && meeting.attendeeIds.includes(userId)) {
                meeting.attendeeIds = meeting.attendeeIds.filter(id => id !== userId);
            }
        });
        this.saveMeetings();

        this.renderUsers();

        // Update current meeting editor if open
        if (this.currentMeetingId) {
            this.renderSelectedAttendees();
        }
    }

    renderUsers() {
        if (this.users.length === 0) {
            this.usersContainer.innerHTML = '<p style="color: var(--text-tertiary); text-align: center; padding: 20px;">No staff members yet. Add your first staff member above.</p>';
            return;
        }

        this.usersContainer.innerHTML = this.users.map(user => `
            <div class="user-item">
                <div class="user-info">
                    <div class="user-name">${this.escapeHtml(user.name)}</div>
                    <div class="user-details">
                        <span>📧 ${this.escapeHtml(user.email)}</span>
                        ${user.role ? `<span>• ${this.escapeHtml(user.role)}</span>` : ''}
                    </div>
                </div>
                <button class="btn btn-danger btn-sm" onclick="app.deleteUser('${user.id}')">Delete</button>
            </div>
        `).join('');
    }

    // Attendee Selection Methods
    toggleAttendeeDropdown() {
        const isHidden = this.attendeesDropdown.classList.contains('hidden');
        if (isHidden) {
            this.renderAttendeesList();
            this.attendeesDropdown.classList.remove('hidden');
            this.attendeeSearch.focus();
        } else {
            this.attendeesDropdown.classList.add('hidden');
        }
    }

    renderAttendeesList(searchQuery = '') {
        if (this.users.length === 0) {
            this.attendeesList.innerHTML = '<p style="padding: 12px; color: var(--text-tertiary); text-align: center;">No staff members available. Add staff members first.</p>';
            return;
        }

        const meeting = this.meetings.find(m => m.id === this.currentMeetingId);
        if (!meeting) return;

        // Ensure attendeeIds exists
        if (!meeting.attendeeIds) {
            meeting.attendeeIds = [];
        }

        // Filter users by search query
        const filteredUsers = this.users.filter(user =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (user.role && user.role.toLowerCase().includes(searchQuery.toLowerCase()))
        );

        if (filteredUsers.length === 0) {
            this.attendeesList.innerHTML = '<p style="padding: 12px; color: var(--text-tertiary); text-align: center;">No matching staff members found.</p>';
            return;
        }

        this.attendeesList.innerHTML = filteredUsers.map(user => {
            const isSelected = meeting.attendeeIds.includes(user.id);
            return `
                <div class="attendee-option" onclick="app.toggleAttendee('${user.id}')">
                    <input type="checkbox" ${isSelected ? 'checked' : ''} onchange="event.stopPropagation(); app.toggleAttendee('${user.id}')">
                    <div class="attendee-info">
                        <div class="attendee-name">${this.escapeHtml(user.name)}</div>
                        <div class="attendee-email">${this.escapeHtml(user.email)}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    filterAttendees(searchQuery) {
        this.renderAttendeesList(searchQuery);
    }

    toggleAttendee(userId) {
        const meeting = this.meetings.find(m => m.id === this.currentMeetingId);
        if (!meeting) return;

        // Ensure attendeeIds exists
        if (!meeting.attendeeIds) {
            meeting.attendeeIds = [];
        }

        const index = meeting.attendeeIds.indexOf(userId);
        if (index > -1) {
            meeting.attendeeIds.splice(index, 1);
        } else {
            meeting.attendeeIds.push(userId);
        }

        meeting.updatedAt = new Date().toISOString();
        this.saveMeetings();

        this.renderSelectedAttendees();
        this.renderAttendeesList(this.attendeeSearch.value);
    }

    removeAttendee(userId) {
        const meeting = this.meetings.find(m => m.id === this.currentMeetingId);
        if (!meeting) return;

        meeting.attendeeIds = meeting.attendeeIds.filter(id => id !== userId);
        meeting.updatedAt = new Date().toISOString();
        this.saveMeetings();

        this.renderSelectedAttendees();
        if (!this.attendeesDropdown.classList.contains('hidden')) {
            this.renderAttendeesList(this.attendeeSearch.value);
        }
    }

    renderSelectedAttendees() {
        const meeting = this.meetings.find(m => m.id === this.currentMeetingId);
        if (!meeting || !meeting.attendeeIds || meeting.attendeeIds.length === 0) {
            this.selectedAttendees.innerHTML = '<p style="color: var(--text-tertiary); margin: 0; font-size: 14px;">No staff selected</p>';
            return;
        }

        const selectedUsers = meeting.attendeeIds
            .map(id => this.users.find(u => u.id === id))
            .filter(u => u); // Filter out undefined (deleted users)

        if (selectedUsers.length === 0) {
            this.selectedAttendees.innerHTML = '<p style="color: var(--text-tertiary); margin: 0; font-size: 14px;">No staff selected</p>';
            return;
        }

        this.selectedAttendees.innerHTML = selectedUsers.map(user => `
            <div class="attendee-chip">
                <span>${this.escapeHtml(user.name)}</span>
                <button class="chip-remove" onclick="app.removeAttendee('${user.id}')" title="Remove">✕</button>
            </div>
        `).join('');
    }

    // Email Summary Generation
    generateEmailSummary() {
        const meeting = this.meetings.find(m => m.id === this.currentMeetingId);
        if (!meeting) return;

        // Use EmailJS if logged in, otherwise use mailto
        if (this.loginData && this.loginData.email) {
            this.sendEmailWithEmailJS(meeting);
            return;
        }

        // Fallback to mailto if not logged in
        if (!meeting.attendeeIds || meeting.attendeeIds.length === 0) {
            alert('Please select at least one attendee to send the email summary.');
            return;
        }

        const selectedUsers = meeting.attendeeIds
            .map(id => this.users.find(u => u.id === id))
            .filter(u => u);

        if (selectedUsers.length === 0) {
            alert('No valid attendees found. Please check your staff list.');
            return;
        }

        // Show option to login or use mailto
        if (confirm('You are not logged in. Click OK to login and send emails directly from the app, or Cancel to use your email client (mailto).')) {
            this.showLoginModal();
            return;
        }

        // Get attendee emails
        const emails = selectedUsers.map(u => u.email).join(',');

        // Format meeting details
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
            hour: '2-digit',
            minute: '2-digit'
        });

        // Build email subject
        const subject = `Meeting Summary: ${meeting.title}`;

        // Build email body
        let body = `Meeting Summary\n\n`;
        body += `Title: ${meeting.title}\n`;
        if (meeting.meetingType) {
            const meetingTypeDisplay = meeting.meetingType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            body += `Type: ${meetingTypeDisplay}\n`;
        }
        body += `Date: ${formattedDate} - ${formattedEndDate}\n`;
        if (meeting.location) {
            body += `Location: ${meeting.location}\n`;
        }
        body += `Attendees: ${selectedUsers.map(u => u.name).join(', ')}\n`;
        if (meeting.tags) {
            body += `Tags: ${meeting.tags}\n`;
        }
        body += `\n`;

        if (meeting.notes.length > 0) {
            body += `Notes:\n${'─'.repeat(50)}\n\n`;

            meeting.notes.forEach(note => {
                const timestamp = new Date(note.timestamp);
                const time = timestamp.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                });

                if (note.isActionItem) {
                    body += `⚡ [ACTION ITEM] `;
                }
                body += `[${time}] ${note.content}\n\n`;
            });
        } else {
            body += `No notes recorded for this meeting.\n`;
        }

        body += `\n\n---\n`;
        body += `This summary was generated by the Housekeeping Manager Notes App`;

        // Create mailto link
        const mailtoLink = `mailto:${emails}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        // Open email client
        window.location.href = mailtoLink;
    }

    // Login/Logout Methods
    showLoginModal() {
        // Pre-fill if login data exists
        if (this.loginData) {
            this.loginEmail.value = this.loginData.email || '';
            this.loginName.value = this.loginData.name || '';
            this.emailjsServiceId.value = this.loginData.serviceId || '';
            this.emailjsTemplateId.value = this.loginData.templateId || '';
            this.emailjsPublicKey.value = this.loginData.publicKey || '';
        }
        this.loginModal.classList.remove('hidden');
    }

    hideLoginModal() {
        this.loginModal.classList.add('hidden');
    }

    login() {
        const email = this.loginEmail.value.trim();
        const name = this.loginName.value.trim();
        const serviceId = this.emailjsServiceId.value.trim();
        const templateId = this.emailjsTemplateId.value.trim();
        const publicKey = this.emailjsPublicKey.value.trim();

        if (!email) {
            alert('Please enter your email address');
            return;
        }

        if (!name) {
            alert('Please enter your name');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }

        if (!serviceId || !templateId || !publicKey) {
            alert('Please enter all EmailJS configuration details (Service ID, Template ID, and Public Key)');
            return;
        }

        // Save login data
        this.loginData = {
            email: email,
            name: name,
            serviceId: serviceId,
            templateId: templateId,
            publicKey: publicKey
        };

        this.saveLoginData(this.loginData);
        this.initializeEmailJS();
        this.updateLoginDisplay();
        this.hideLoginModal();

        alert('Login successful! You can now send emails directly from the app.');
    }

    logout() {
        if (!confirm('Logout? Your EmailJS configuration will be removed from this device.')) return;

        this.loginData = null;
        localStorage.removeItem('loginData');
        this.updateLoginDisplay();

        alert('Logged out successfully');
    }

    updateLoginDisplay() {
        if (this.loginData && this.loginData.email) {
            this.loginBtn.classList.add('hidden');
            this.loggedInUser.classList.remove('hidden');
            this.userEmailDisplay.textContent = this.loginData.email;
        } else {
            this.loginBtn.classList.remove('hidden');
            this.loggedInUser.classList.add('hidden');
            this.userEmailDisplay.textContent = '';
        }
    }

    // EmailJS Integration
    initializeEmailJS() {
        if (this.loginData && this.loginData.publicKey && typeof emailjs !== 'undefined') {
            try {
                emailjs.init(this.loginData.publicKey);
                console.log('EmailJS initialized successfully');
            } catch (error) {
                console.error('Failed to initialize EmailJS:', error);
            }
        }
    }

    // Updated Email Summary Generation (using EmailJS)
    async sendEmailWithEmailJS(meeting) {
        if (!this.loginData || !this.loginData.email) {
            alert('Please login first to send emails');
            this.showLoginModal();
            return;
        }

        if (!meeting.attendeeIds || meeting.attendeeIds.length === 0) {
            alert('Please select at least one attendee to send the email summary.');
            return;
        }

        const selectedUsers = meeting.attendeeIds
            .map(id => this.users.find(u => u.id === id))
            .filter(u => u);

        if (selectedUsers.length === 0) {
            alert('No valid attendees found. Please check your staff list.');
            return;
        }

        // Format meeting details
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
            hour: '2-digit',
            minute: '2-digit'
        });

        // Build email subject
        const subject = `Meeting Summary: ${meeting.title}`;

        // Build email body
        let body = `Meeting Summary\n\n`;
        body += `Title: ${meeting.title}\n`;
        if (meeting.meetingType) {
            const meetingTypeDisplay = meeting.meetingType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            body += `Type: ${meetingTypeDisplay}\n`;
        }
        body += `Date: ${formattedDate} - ${formattedEndDate}\n`;
        if (meeting.location) {
            body += `Location: ${meeting.location}\n`;
        }
        body += `Attendees: ${selectedUsers.map(u => u.name).join(', ')}\n`;
        if (meeting.tags) {
            body += `Tags: ${meeting.tags}\n`;
        }
        body += `\n`;

        if (meeting.notes.length > 0) {
            body += `Notes:\n${'─'.repeat(50)}\n\n`;

            meeting.notes.forEach(note => {
                const timestamp = new Date(note.timestamp);
                const time = timestamp.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                });

                if (note.isActionItem) {
                    body += `⚡ [ACTION ITEM] `;
                }
                body += `[${time}] ${note.content}\n\n`;
            });
        } else {
            body += `No notes recorded for this meeting.\n`;
        }

        body += `\n\n---\n`;
        body += `This summary was generated by the Housekeeping Manager Notes App\n`;
        body += `Sent by: ${this.loginData.name} (${this.loginData.email})`;

        // Send email to each attendee
        let successCount = 0;
        let failCount = 0;

        for (const user of selectedUsers) {
            try {
                const templateParams = {
                    to_email: user.email,
                    to_name: user.name,
                    from_name: this.loginData.name,
                    from_email: this.loginData.email,
                    subject: subject,
                    message: body
                };

                await emailjs.send(
                    this.loginData.serviceId,
                    this.loginData.templateId,
                    templateParams
                );

                successCount++;
            } catch (error) {
                console.error(`Failed to send email to ${user.email}:`, error);
                failCount++;
            }
        }

        if (successCount > 0) {
            alert(`Email summary sent successfully to ${successCount} recipient(s)${failCount > 0 ? `, ${failCount} failed` : ''}!`);
        } else {
            alert('Failed to send email summary. Please check your EmailJS configuration and try again.');
        }
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
