import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AnnouncementService, AnnouncementPage } from '../../../services/announcement';
import { AuthService } from '../../../services/auth';
import { Announcement } from '../../../models/announcement.model';

@Component({
  selector: 'app-announcement-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './announcement-list.html',
  styleUrls: ['./announcement-list.css']
})
export class AnnouncementListComponent implements OnInit {
  announcements: Announcement[] = [];
  loading = true;

  // Pagination state
  currentPage = 0;
  pageSize = 6;
  totalPages = 0;
  totalElements = 0;
  isFirst = true;
  isLast = true;

  // Role-based
  canCreate = false;

  constructor(
    private announcementService: AnnouncementService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.canCreate = this.authService.isManager();
    this.loadAnnouncements();
  }

  loadAnnouncements(page = 0) {
    this.loading = true;
    this.announcementService.getAll(page, this.pageSize).subscribe({
      next: (data: AnnouncementPage) => {
        this.announcements = data.content;
        this.currentPage = data.number;
        this.totalPages = data.totalPages;
        this.totalElements = data.totalElements;
        this.isFirst = data.first;
        this.isLast = data.last;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching announcements', err);
        this.loading = false;
      }
    });
  }

  prevPage() {
    if (!this.isFirst) {
      this.loadAnnouncements(this.currentPage - 1);
    }
  }

  nextPage() {
    if (!this.isLast) {
      this.loadAnnouncements(this.currentPage + 1);
    }
  }

  goToPage(page: number) {
    this.loadAnnouncements(page);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }
}
