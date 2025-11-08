const API_BASE_URL = 'http://localhost:5000/api';

let currentTimetableId = null;
let allCourses = [];
let allFaculty = [];
let allRooms = [];
let allStudents = [];

document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    loadDashboardStats();
    loadAllData();
    setupFormHandlers();
});

function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');

            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');

            if (targetTab === 'view') {
                loadTimetables();
            }
        });
    });
}

async function loadDashboardStats() {
    try {
        const [coursesRes, facultyRes, roomsRes, studentsRes] = await Promise.all([
            fetch(`${API_BASE_URL}/courses`),
            fetch(`${API_BASE_URL}/faculty`),
            fetch(`${API_BASE_URL}/rooms`),
            fetch(`${API_BASE_URL}/students`)
        ]);

        const coursesData = await coursesRes.json();
        const facultyData = await facultyRes.json();
        const roomsData = await roomsRes.json();
        const studentsData = await studentsRes.json();

        document.getElementById('total-courses').textContent = coursesData.data?.length || 0;
        document.getElementById('total-faculty').textContent = facultyData.data?.length || 0;
        document.getElementById('total-rooms').textContent = roomsData.data?.length || 0;
        document.getElementById('total-students').textContent = studentsData.data?.length || 0;
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

async function loadAllData() {
    await Promise.all([
        loadCourses(),
        loadFaculty(),
        loadRooms(),
        loadStudents()
    ]);
}

async function loadCourses() {
    try {
        const response = await fetch(`${API_BASE_URL}/courses`);
        const data = await response.json();

        if (data.success) {
            allCourses = data.data;
            renderCoursesTable(data.data);
        }
    } catch (error) {
        console.error('Error loading courses:', error);
        showToast('Failed to load courses', 'error');
    }
}

function renderCoursesTable(courses) {
    const tbody = document.getElementById('courses-tbody');

    if (courses.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="loading">No courses found. Add your first course!</td></tr>';
        return;
    }

    tbody.innerHTML = courses.map(course => {
        const faculty = allFaculty.find(f => f.id === course.faculty_id);
        return `
            <tr>
                <td>${course.code}</td>
                <td>${course.name}</td>
                <td>${course.credits}</td>
                <td><span class="type ${course.type}">${course.type}</span></td>
                <td>${course.program}</td>
                <td>${faculty ? faculty.name : 'Not Assigned'}</td>
            </tr>
        `;
    }).join('');
}

function showAddCourseForm() {
    document.getElementById('add-course-form').style.display = 'block';
    loadFacultySelect();
}

function hideAddCourseForm() {
    document.getElementById('add-course-form').style.display = 'none';
    document.getElementById('course-form').reset();
}

function loadFacultySelect() {
    const select = document.getElementById('course-faculty-select');
    select.innerHTML = '<option value="">Select Faculty</option>' +
        allFaculty.map(f => `<option value="${f.id}">${f.name}</option>`).join('');
}

async function loadFaculty() {
    try {
        const response = await fetch(`${API_BASE_URL}/faculty`);
        const data = await response.json();

        if (data.success) {
            allFaculty = data.data;
            renderFacultyTable(data.data);
        }
    } catch (error) {
        console.error('Error loading faculty:', error);
        showToast('Failed to load faculty', 'error');
    }
}

function renderFacultyTable(faculty) {
    const tbody = document.getElementById('faculty-tbody');

    if (faculty.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="loading">No faculty found. Add your first faculty member!</td></tr>';
        return;
    }

    tbody.innerHTML = faculty.map(f => `
        <tr>
            <td>${f.name}</td>
            <td>${f.email}</td>
            <td>${f.department || 'N/A'}</td>
            <td>${f.expertise || 'N/A'}</td>
        </tr>
    `).join('');
}

function showAddFacultyForm() {
    document.getElementById('add-faculty-form').style.display = 'block';
}

function hideAddFacultyForm() {
    document.getElementById('add-faculty-form').style.display = 'none';
    document.getElementById('faculty-form').reset();
}

async function loadRooms() {
    try {
        const response = await fetch(`${API_BASE_URL}/rooms`);
        const data = await response.json();

        if (data.success) {
            allRooms = data.data;
            renderRoomsTable(data.data);
        }
    } catch (error) {
        console.error('Error loading rooms:', error);
        showToast('Failed to load rooms', 'error');
    }
}

function renderRoomsTable(rooms) {
    const tbody = document.getElementById('rooms-tbody');

    if (rooms.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="loading">No rooms found. Add your first room!</td></tr>';
        return;
    }

    tbody.innerHTML = rooms.map(r => `
        <tr>
            <td>${r.number}</td>
            <td><span class="type ${r.type}">${r.type}</span></td>
            <td>${r.capacity}</td>
            <td>${r.building || 'N/A'}</td>
        </tr>
    `).join('');
}

function showAddRoomForm() {
    document.getElementById('add-room-form').style.display = 'block';
}

function hideAddRoomForm() {
    document.getElementById('add-room-form').style.display = 'none';
    document.getElementById('room-form').reset();
}

async function loadStudents() {
    try {
        const response = await fetch(`${API_BASE_URL}/students`);
        const data = await response.json();

        if (data.success) {
            allStudents = data.data;
            renderStudentsTable(data.data);
        }
    } catch (error) {
        console.error('Error loading students:', error);
        showToast('Failed to load students', 'error');
    }
}

function renderStudentsTable(students) {
    const tbody = document.getElementById('students-tbody');

    if (students.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="loading">No students found. Add your first student!</td></tr>';
        return;
    }

    tbody.innerHTML = students.map(s => `
        <tr>
            <td>${s.student_id}</td>
            <td>${s.name}</td>
            <td>${s.program}</td>
            <td>${s.semester || 'N/A'}</td>
        </tr>
    `).join('');
}

function showAddStudentForm() {
    document.getElementById('add-student-form').style.display = 'block';
}

function hideAddStudentForm() {
    document.getElementById('add-student-form').style.display = 'none';
    document.getElementById('student-form').reset();
}

function setupFormHandlers() {
    document.getElementById('course-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        try {
            showLoading();
            const response = await fetch(`${API_BASE_URL}/courses`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            hideLoading();

            if (result.success) {
                showToast('Course added successfully!', 'success');
                hideAddCourseForm();
                loadCourses();
                loadDashboardStats();
            } else {
                showToast('Failed to add course', 'error');
            }
        } catch (error) {
            hideLoading();
            showToast('Error adding course', 'error');
        }
    });

    document.getElementById('faculty-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        try {
            showLoading();
            const response = await fetch(`${API_BASE_URL}/faculty`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            hideLoading();

            if (result.success) {
                showToast('Faculty added successfully!', 'success');
                hideAddFacultyForm();
                loadFaculty();
                loadDashboardStats();
            } else {
                showToast('Failed to add faculty', 'error');
            }
        } catch (error) {
            hideLoading();
            showToast('Error adding faculty', 'error');
        }
    });

    document.getElementById('room-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        try {
            showLoading();
            const response = await fetch(`${API_BASE_URL}/rooms`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            hideLoading();

            if (result.success) {
                showToast('Room added successfully!', 'success');
                hideAddRoomForm();
                loadRooms();
                loadDashboardStats();
            } else {
                showToast('Failed to add room', 'error');
            }
        } catch (error) {
            hideLoading();
            showToast('Error adding room', 'error');
        }
    });

    document.getElementById('student-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        try {
            showLoading();
            const response = await fetch(`${API_BASE_URL}/students`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            hideLoading();

            if (result.success) {
                showToast('Student added successfully!', 'success');
                hideAddStudentForm();
                loadStudents();
                loadDashboardStats();
            } else {
                showToast('Failed to add student', 'error');
            }
        } catch (error) {
            hideLoading();
            showToast('Error adding student', 'error');
        }
    });
}

async function validateData() {
    try {
        showLoading();
        const response = await fetch(`${API_BASE_URL}/validate-data`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });

        const result = await response.json();
        hideLoading();

        const validationDiv = document.getElementById('validation-result');
        validationDiv.style.display = 'block';

        if (result.success) {
            validationDiv.className = 'validation-result success';
            validationDiv.innerHTML = `
                <h4>✅ Validation Successful</h4>
                <p>All required data is present. You can proceed with timetable generation.</p>
                ${result.warnings && result.warnings.length > 0 ? `
                    <h4 style="margin-top: 15px;">⚠️ Warnings:</h4>
                    <ul>${result.warnings.map(w => `<li>${w}</li>`).join('')}</ul>
                ` : ''}
            `;
        } else {
            validationDiv.className = 'validation-result error';
            validationDiv.innerHTML = `
                <h4>❌ Validation Failed</h4>
                <ul>${result.errors.map(e => `<li>${e}</li>`).join('')}</ul>
            `;
        }
    } catch (error) {
        hideLoading();
        showToast('Error validating data', 'error');
    }
}

async function generateTimetable() {
    const program = document.getElementById('gen-program').value;
    const semester = document.getElementById('gen-semester').value;
    const algorithm = document.getElementById('gen-algorithm').value;

    try {
        document.getElementById('generation-progress').style.display = 'block';
        document.getElementById('generation-result').style.display = 'none';

        const response = await fetch(`${API_BASE_URL}/generate-timetable`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ program, semester, algorithm}) 
        });

        const result = await response.json();
        document.getElementById('generation-progress').style.display = 'none';

        const resultDiv = document.getElementById('generation-result');
        resultDiv.style.display = 'block';

        if (result.success) {
            resultDiv.className = 'result-container success';
            currentTimetableId = result.timetable_id;

            const validation = result.validation;
            const validationStatus = validation.is_valid
                ? '<span style="color: var(--success-color);">✅ No conflicts detected</span>'
                : `<span style="color: var(--error-color);">⚠️ ${validation.conflicts.length} conflicts found</span>`;

            resultDiv.innerHTML = `
                <h3>✅ Timetable Generated Successfully!</h3>
                <p><strong>Timetable ID:</strong> ${result.timetable_id}</p>
                <p><strong>Program:</strong> ${result.metadata.program}</p>
                <p><strong>Semester:</strong> ${result.metadata.semester}</p>
                <p><strong>Total Sessions:</strong> ${result.metadata.total_sessions}</p>
                <p><strong>Validation Status:</strong> ${validationStatus}</p>
                <div style="margin-top: 20px; display: flex; gap: 15px;">
                    <button class="btn btn-primary" onclick="viewGeneratedTimetable()">View Timetable</button>
                    <button class="btn btn-secondary" onclick="exportTimetablePDF()">📄 Export PDF</button>
                    <button class="btn btn-secondary" onclick="exportTimetableExcel()">📊 Export Excel</button>
                </div>
            `;

            showToast('Timetable generated successfully!', 'success');
        } else {
            resultDiv.className = 'result-container error';
            resultDiv.innerHTML = `
                <h3>❌ Timetable Generation Failed</h3>
                <p>${result.message}</p>
                <p>Please check your data and try again, or use a different algorithm.</p>
            `;
            showToast('Failed to generate timetable', 'error');
        }
    } catch (error) {
        document.getElementById('generation-progress').style.display = 'none';
        showToast('Error generating timetable', 'error');
        console.error(error);
    }
}

async function viewGeneratedTimetable() {
    if (!currentTimetableId) return;

    try {
        showLoading();
        const response = await fetch(`${API_BASE_URL}/timetable/${currentTimetableId}`);
        const result = await response.json();
        hideLoading();

        if (result.success) {
            displayTimetable(result.data);
            document.querySelector('[data-tab="view"]').click();
        }
    } catch (error) {
        hideLoading();
        showToast('Error loading timetable', 'error');
    }
}

async function loadTimetables() {
    try {
        const response = await fetch(`${API_BASE_URL}/timetables`);
        const result = await response.json();

        const container = document.getElementById('timetables-list');

        if (result.success && result.data.length > 0) {
            container.innerHTML = result.data.map(tt => `
                <div class="timetable-card" onclick="loadTimetableById('${tt.id}')">
                    <h3>${tt.program} - ${tt.semester}</h3>
                    <p><strong>Generated:</strong> ${new Date(tt.created_at).toLocaleString()}</p>
                    <p><strong>Sessions:</strong> ${tt.timetable.length}</p>
                    <span class="badge">${tt.validation.is_valid ? 'Valid' : 'Has Conflicts'}</span>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<p class="loading">No timetables generated yet. Go to Generate Timetable tab to create one.</p>';
        }
    } catch (error) {
        console.error('Error loading timetables:', error);
        showToast('Failed to load timetables', 'error');
    }
}

async function loadTimetableById(id) {
    try {
        showLoading();
        const response = await fetch(`${API_BASE_URL}/timetable/${id}`);
        const result = await response.json();
        hideLoading();

        if (result.success) {
            currentTimetableId = id;
            displayTimetable(result.data);
        }
    } catch (error) {
        hideLoading();
        showToast('Error loading timetable', 'error');
    }
}

function displayTimetable(timetableData) {
    const viewer = document.getElementById('timetable-viewer');
    const title = document.getElementById('viewer-title');
    const content = document.getElementById('timetable-content');

    title.textContent = `${timetableData.program} - ${timetableData.semester}`;

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timetable = timetableData.timetable;

    content.innerHTML = days.map(day => {
        const dayEntries = timetable.filter(e => e.day === day);

        if (dayEntries.length === 0) return '';

        return `
            <div class="day-section">
                <div class="day-header">${day}</div>
                <div class="day-schedule">
                    ${dayEntries.sort((a, b) => a.time.localeCompare(b.time)).map(entry => `
                        <div class="schedule-item">
                            <div class="time">${entry.time}</div>
                            <div class="course-code">${entry.course_code}</div>
                            <div class="course-name">${entry.course_name}</div>
                            <div class="faculty">${entry.faculty_name}</div>
                            <div class="room">${entry.room_number}</div>
                            <div class="type ${entry.type}">${entry.type}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');

    viewer.style.display = 'block';
    viewer.scrollIntoView({ behavior: 'smooth' });
}

function closeTimetableViewer() {
    document.getElementById('timetable-viewer').style.display = 'none';
}

function exportTimetablePDF() {
    if (!currentTimetableId) {
        showToast('No timetable selected', 'warning');
        return;
    }

    window.open(`${API_BASE_URL}/export/pdf/${currentTimetableId}`, '_blank');
    showToast('Downloading PDF...', 'success');
}

function exportTimetableExcel() {
    if (!currentTimetableId) {
        showToast('No timetable selected', 'warning');
        return;
    }

    window.open(`${API_BASE_URL}/export/excel/${currentTimetableId}`, '_blank');
    showToast('Downloading Excel...', 'success');
}

function showLoading() {
    document.getElementById('loading-overlay').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loading-overlay').style.display = 'none';
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}