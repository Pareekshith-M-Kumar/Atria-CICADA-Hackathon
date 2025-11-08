from constraint import Problem, AllDifferentConstraint
import random
from datetime import datetime
import json

class TimetableGenerator:

    def __init__(self, courses, faculty, rooms, students, program_config):
        self.courses = courses or []
        self.faculty = faculty or []
        self.rooms = rooms or []
        self.students = students or []
        self.program_config = program_config or {}

        self.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        self.time_slots = [
            '09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00',
            '13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00'
        ]

        self.timetable = []
        self.conflicts = []

    def to_int(self, v, default=0):
        """Safe int conversion"""
        try:
            return int(v)
        except Exception:
            return default

    def generate_time_slot_combinations(self):
        """Generate all possible day-time combinations"""
        slots = []
        for day in self.days:
            for time in self.time_slots:
                slots.append(f"{day}_{time}")
        return slots

    def check_faculty_availability(self, faculty_id, day, time):
        """Check if faculty is available at given day and time"""
        faculty = next((f for f in self.faculty if str(f.get('id')) == str(faculty_id)), None)
        if not faculty:
            return False

        avail = faculty.get('availability')
        if not avail:
            return True  

        
        if isinstance(avail, dict):
            day_availability = avail.get(day, [])
            return time in day_availability

        
        if isinstance(avail, str):
            tokens = [t.strip() for t in avail.split(',') if t.strip()]
            key = f"{day}_{time}"
            return key in tokens
        return True

    def check_room_capacity(self, room_id, required_capacity):
        """Check if room has sufficient capacity"""
        room = next((r for r in self.rooms if str(r.get('id')) == str(room_id)), None)
        if not room:
            return False
        cap = self.to_int(room.get('capacity', 0), 0)
        return cap >= self.to_int(required_capacity, 0)

    def check_room_type(self, room_id, required_type):
        """Check if room type matches requirement (lab/classroom)"""
        room = next((r for r in self.rooms if str(r.get('id')) == str(room_id)), None)
        if not room:
            return False
        return str(room.get('type', 'classroom')).lower() == str(required_type or 'classroom').lower()

    def calculate_enrolled_students(self, course_id):
        """Calculate number of students enrolled in a course"""
        count = 0
        for student in self.students:
            enrolled = student.get('enrolled_courses', [])

            if isinstance(enrolled, str):
                try:
                    enrolled_list = [s.strip() for s in enrolled.split(',') if s.strip()]
                except Exception:
                    enrolled_list = []
            else:
                enrolled_list = enrolled or []

            if course_id in enrolled_list:
                count += 1

        return max(count, 1)

    # ---------- Greedy fallback ----------
    def generate_simple_timetable(self):
        """
        Fallback: Simple greedy algorithm for timetable generation
        """
        timetable_entries = []
        used_slots = set()
        faculty_schedule = {}

        all_slots = self.generate_time_slot_combinations()
        random.shuffle(all_slots)

        for course in self.courses:
            credits = self.to_int(course.get('credits', 3), 3)
            sessions_needed = max(1, credits)
            faculty_id = course.get('faculty_id')
            course_type = course.get('type', 'theory')
            enrolled_count = self.calculate_enrolled_students(course.get('id'))

            suitable_rooms = [r for r in self.rooms
                              if self.check_room_type(r.get('id'), course_type)
                              and self.check_room_capacity(r.get('id'), enrolled_count)]
            if not suitable_rooms:
                suitable_rooms = self.rooms[:]  

            sessions_scheduled = 0
            for slot in all_slots:
                if sessions_scheduled >= sessions_needed:
                    break
                day, time = slot.split('_', 1)

                if not self.check_faculty_availability(faculty_id, day, time):
                    continue

                if faculty_id:
                    if slot in faculty_schedule.get(str(faculty_id), []):
                        continue

                room_found = None
                for room in suitable_rooms:
                    key = f"{slot}_{room.get('id')}"
                    if key not in used_slots:
                        room_found = room
                        used_slots.add(key)
                        break

                if room_found:
                    faculty = next((f for f in self.faculty if str(f.get('id')) == str(faculty_id)), {})
                    entry = {
                        'course_id': course.get('id'),
                        'course_name': course.get('name'),
                        'course_code': course.get('code'),
                        'faculty_name': faculty.get('name', 'TBA'),
                        'faculty_id': faculty_id,
                        'room_number': room_found.get('number', room_found.get('id')),
                        'room_type': room_found.get('type', 'classroom'),
                        'day': day,
                        'time': time,
                        'type': course_type,
                        'credits': credits
                    }
                    timetable_entries.append(entry)
                    faculty_schedule.setdefault(str(faculty_id), []).append(slot)
                    sessions_scheduled += 1

        day_order = {day: i for i, day in enumerate(self.days)}
        timetable_entries.sort(key=lambda x: (day_order.get(x['day'], 999), x['time']))

        return {
            'success': True,
            'timetable': timetable_entries,
            'metadata': {
                'total_courses': len(self.courses),
                'generated_at': datetime.now().isoformat(),
                'algorithm': 'greedy',
                'program': self.program_config.get('name', 'General'),
                'semester': self.program_config.get('semester', 'Current')
            }
        }

    def validate_timetable(self, timetable_entries):
        conflicts = []

        faculty_slots = {}
        for entry in timetable_entries:
            key = f"{entry.get('faculty_id')}_{entry.get('day')}_{entry.get('time')}"
            if key in faculty_slots:
                conflicts.append({
                    'type': 'faculty_conflict',
                    'faculty': entry.get('faculty_name'),
                    'day': entry.get('day'),
                    'time': entry.get('time'),
                    'courses': [faculty_slots[key], entry.get('course_name')]
                })
            faculty_slots[key] = entry.get('course_name')

        room_slots = {}
        for entry in timetable_entries:
            key = f"{entry.get('room_number')}_{entry.get('day')}_{entry.get('time')}"
            if key in room_slots:
                conflicts.append({
                    'type': 'room_conflict',
                    'room': entry.get('room_number'),
                    'day': entry.get('day'),
                    'time': entry.get('time'),
                    'courses': [room_slots[key], entry.get('course_name')]
                })
            room_slots[key] = entry.get('course_name')

        return {
            'is_valid': len(conflicts) == 0,
            'conflicts': conflicts
        }
