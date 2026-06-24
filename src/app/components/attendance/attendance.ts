import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceService } from '../../services/attendance';
import { AttendanceSummary } from '../../models/attendance.model';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './attendance.html',
  styleUrls: ['./attendance.css']
})
export class AttendanceComponent implements OnInit {
  summary: AttendanceSummary | null = null;
  loading = false;
  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth() + 1; // 1-12
  
  monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
  ];

  constructor(private attendanceService: AttendanceService) {}

  ngOnInit() {
    this.loadSummary();
  }

  loadSummary() {
    this.loading = true;
    this.attendanceService.getMySummary(this.currentYear, this.currentMonth).subscribe({
      next: (data) => {
        this.summary = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  markAttendance(status: 'PRESENT' | 'ABSENT' | 'ON_LEAVE') {
    this.attendanceService.markAttendance(status).subscribe({
      next: () => {
        alert('Attendance marked as ' + status);
        this.loadSummary();
      },
      error: (err) => {
        alert('Failed to mark attendance');
      }
    });
  }

  prevMonth() {
    if (this.currentMonth === 1) {
      this.currentMonth = 12;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.loadSummary();
  }

  nextMonth() {
    if (this.currentMonth === 12) {
      this.currentMonth = 1;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.loadSummary();
  }
}
