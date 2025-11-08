# NEP 2020 Timetable Generator

An AI-powered intelligent timetable generation system for higher education institutions compliant with National Education Policy (NEP) 2020 guidelines.

## 🎯 Project Overview

This system automates the complex task of creating conflict-free, optimized academic timetables for institutions offering Four-Year Undergraduate Programmes (FYUP), B.Ed., M.Ed., and ITEP programs under NEP 2020's flexible, credit-based, multidisciplinary framework.

## ✨ Key Features

- **AI-Powered Scheduling**: Uses greedy algorithim solver for intelligent timetable generation
- **NEP 2020 Compliant**: Supports flexible credit-based multidisciplinary programs
- **Multi-Program Support**: Handles B.Ed., M.Ed., FYUP, and ITEP programs
- **Conflict Detection**: Automatically detects and resolves scheduling conflicts
- **Faculty Optimization**: Balances faculty workload and respects availability
- **Export Capabilities**: Generate PDF and Excel reports
- **Real-time Validation**: Validates data before timetable generation
- **Scalable Architecture**: Firebase backend for easy scaling

## 🏗️ Architecture

### Technology Stack

**Frontend:**
- HTML5, CSS3, JavaScript (Vanilla JS)
- Responsive design with modern UI/UX
- Real-time data visualization

**Backend:**
- Python 3.8+
- Flask (REST API)
- Firebase Firestore (Database)
- Constraint Programming (python-constraint library)

**AI/ML:**
- Greedy algorithm fallback
- Heuristic optimization

**Export:**
- ReportLab (PDF generation)
- openpyxl (Excel export)

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (HTML/CSS/JS)                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │Dashboard │  │Data Mgmt │  │Generator │  │ Viewer  │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
└────────────────────┬────────────────────────────────────┘
                     │ REST API
┌────────────────────▼────────────────────────────────────┐
│                 Backend (Python Flask)                  │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Timetable Generator                 │   │
│  │  • Constraint Definition                         │   │
│  │  • Variable Assignment                           │   │
│  │  • Conflict Resolution                           │   │
│  │  • Optimization                                  │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│  │ Firebase │  │  Export  │  │Validation│               │
│  │  Admin   │  │ PDF/Excel│  │  Engine  │               │
│  └──────────┘  └──────────┘  └──────────┘               │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│              Firebase Firestore Database                │
│  ┌─────────┐ ┌─────────┐ ┌──────┐ ┌─────────────────┐   │
│  │ Courses │ │ Faculty │ │Rooms │ │ Students/Tables │   │
│  └─────────┘ └─────────┘ └──────┘ └─────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## 📋 Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- Firebase account (free tier works)
- Modern web browser

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd nep2020-timetable-generator
```

### 2. Set Up Python Environment

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Configure Firebase

#### Option A: Using Firebase Console (Recommended for Production)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable Firestore Database:
   - Go to Firestore Database
   - Click "Create database"
   - Start in test mode (for development)
4. Get Web Configuration:
   - Go to Project Settings > General
   - Scroll to "Your apps" section
   - Click web icon (</>) to add a web app
   - Copy the configuration object
5. Update `firebase-config.js` with your configuration:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

6. Get Service Account Key:
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Save the JSON file as `serviceAccountKey.json` in project root
   - Update `firebase_config.py` to use this file

### 4. Environment Variables (Optional)

Create a `.env` file in the project root:

```env
FIREBASE_SERVICE_ACCOUNT=<path-to-service-account-json>
FLASK_ENV=development
FLASK_DEBUG=True
```

### 5. Run the Backend Server

```bash
python app.py
```

The Flask server will start on `http://localhost:5000`

### 6. Open the Frontend

Open `index.html` in your web browser, or use a local server:

## 📖 Usage Guide

### Step 1: Add Courses

1. Navigate to the "Courses" tab
2. Click "+ Add Course"
3. Fill in course details:
   - Course Code (e.g., EDU101)
   - Course Name
   - Credits (1-6)
   - Type (Theory/Practical/Lab)
   - Program (B.Ed./M.Ed./FYUP/ITEP)
   - Assign Faculty

### Step 2: Add Faculty

1. Go to "Faculty" tab
2. Click "+ Add Faculty"
3. Enter faculty information:
   - Name
   - Email
   - Department
   - Expertise areas

### Step 3: Add Rooms

1. Navigate to "Rooms" tab
2. Click "+ Add Room"
3. Configure room details:
   - Room Number
   - Type (Classroom/Lab/Auditorium)
   - Capacity
   - Building

### Step 4: Add Students (Optional)

1. Go to "Students" tab
2. Add student records with:
   - Student ID
   - Name
   - Program
   - Semester

### Step 5: Generate Timetable

1. Navigate to "Generate Timetable" tab
2. Select:
   - Program (B.Ed./M.Ed./FYUP/ITEP/All)
   - Semester
3. Click "Validate Data" to check for issues
4. Click "Generate Timetable"
5. Wait for AI to generate optimal schedule

### Step 6: View and Export

1. Go to "View Timetables" tab
2. Click on any generated timetable
3. Review the schedule by day
4. Export as PDF or Excel for distribution

## 🧠 Algorithm Details

### Greedy Algorithm (Fallback)

For quick generation:
1. Sort courses by constraints (most constrained first)
2. Assign time slots sequentially
3. Check conflicts at each step
4. Backtrack if necessary

## 📊 Firebase Database Schema

```
/courses/{courseId}
  - id: string
  - code: string
  - name: string
  - credits: number
  - type: "theory" | "practical" | "lab"
  - program: "B.Ed." | "M.Ed." | "FYUP" | "ITEP"
  - faculty_id: string

/faculty/{facultyId}
  - id: string
  - name: string
  - email: string
  - department: string
  - expertise: string
  - availability: object

/rooms/{roomId}
  - id: string
  - number: string
  - type: "classroom" | "lab" | "auditorium"
  - capacity: number
  - building: string

/students/{studentId}
  - id: string
  - student_id: string
  - name: string
  - program: string
  - semester: number
  - enrolled_courses: array

/timetables/{timetableId}
  - id: string
  - program: string
  - semester: string
  - timetable: array
  - metadata: object
  - validation: object
  - created_at: timestamp
```

## 🔧 API Endpoints

### Data Management

- `GET /api/courses` - Get all courses
- `POST /api/courses` - Add new course
- `GET /api/faculty` - Get all faculty
- `POST /api/faculty` - Add new faculty
- `GET /api/rooms` - Get all rooms
- `POST /api/rooms` - Add new room
- `GET /api/students` - Get all students
- `POST /api/students` - Add new student

### Timetable Operations

- `POST /api/generate-timetable` - Generate new timetable
- `GET /api/timetable/{id}` - Get specific timetable
- `GET /api/timetables` - Get all timetables
- `GET /api/export/pdf/{id}` - Export timetable as PDF
- `GET /api/export/excel/{id}` - Export timetable as Excel

### Validation

- `POST /api/validate-data` - Validate data before generation

## 🎨 Customization

### Modifying Time Slots

Edit `timetable_generator.py`:

```python
self.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
self.time_slots = [
    '09:00-10:00', '10:00-11:00', # ... add more slots
]
```

### Adding New Constraints

In `timetable_generator.py`, add to `generate_timetable_csp()`:

```python
# Example: No classes on Friday afternoon
def no_friday_afternoon(time_slot):
    return not (time_slot.startswith('Friday') and 
                int(time_slot.split('_')[1].split(':')[0]) >= 14)

problem.addConstraint(no_friday_afternoon, [f"{session}_time"])
```

### Styling

Modify `styles.css` to change colors, fonts, or layout:

```css
:root {
    --primary-color: #your-color;
    /* ... other variables */
}
```

## 🐛 Troubleshooting

### Firebase Connection Issues

1. Verify Firebase configuration in `firebase-config.js`
2. Check service account key path in `firebase_config.py`
3. Ensure Firestore is enabled in Firebase Console
4. Check Firebase security rules (use test mode for development)

### Timetable Generation Fails

1. Run "Validate Data" to check for missing information
2. Ensure sufficient rooms for all courses
3. Verify faculty assignments
4. Check console for detailed error messages

### Export Not Working

1. Verify `reportlab` and `openpyxl` are installed
2. Check file permissions
3. Ensure timetable ID is valid

## 📝 Future Enhancements

- [ ] Multi-semester planning
- [ ] Teaching practice schedule integration
- [ ] Field work and internship management
- [ ] Mobile app version
- [ ] Advanced analytics dashboard
- [ ] Integration with existing Academic Management Systems
- [ ] Machine learning for preference learning
- [ ] Automated email notifications
- [ ] Calendar integration (Google Calendar, Outlook)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team ConflagrationX

Developed for NEP 2020 Hackathon

## 📧 Contact

For questions or support, please contact: pareekshithnvn@gmail.com

## 🙏 Acknowledgments

- NEP 2020 Guidelines
- Python Constraint Library
- Firebase Team
- All contributors and testers

---

**Note**: This is a hackathon project.
