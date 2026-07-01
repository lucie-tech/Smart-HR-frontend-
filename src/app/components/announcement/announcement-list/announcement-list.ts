import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AnnouncementService, AnnouncementPage } from '../../../services/announcement';
import { AuthService } from '../../../services/auth';
import { Announcement } from '../../../models/announcement.model';

@Component({
  selector: 'app-announcement-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
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

  // Edit Modal State
  editingAnnouncement: Announcement | null = null;
  editForm!: FormGroup;
  saving = false;

  replyContents: { [key: number]: string } = {};
  submittingReply: { [key: number]: boolean } = {};

  constructor(
    private announcementService: AnnouncementService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.canCreate = this.authService.isManager();
    this.loadAnnouncements();
    this.editForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });
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
    if (!this.isFirst) this.loadAnnouncements(this.currentPage - 1);
  }

  nextPage() {
    if (!this.isLast) this.loadAnnouncements(this.currentPage + 1);
  }

  goToPage(page: number) {
    this.loadAnnouncements(page);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  // Edit/Delete functionality
  deleteAnnouncement(id?: number) {
    if (!id || !confirm('Are you sure you want to delete this announcement?')) return;
    this.announcementService.delete(id).subscribe({
      next: () => {
        this.loadAnnouncements(this.currentPage);
      },
      error: (err) => alert('Failed to delete announcement: ' + (err.error?.message || 'Unknown error'))
    });
  }

  openEdit(ann: Announcement) {
    this.editingAnnouncement = ann;
    this.editForm.patchValue({
      title: ann.title,
      content: ann.content
    });
  }

  closeEdit() {
    this.editingAnnouncement = null;
    this.editForm.reset();
  }

  saveEdit() {
    if (this.editForm.invalid || !this.editingAnnouncement?.id) return;
    this.saving = true;
    this.announcementService.update(this.editingAnnouncement.id, this.editForm.value).subscribe({
      next: () => {
        this.saving = false;
        this.closeEdit();
        this.loadAnnouncements(this.currentPage);
      },
      error: (err) => {
        this.saving = false;
        alert('Failed to update announcement: ' + (err.error?.message || 'Unknown error'));
      }
    });
  }

  submitReply(announcementId?: number) {
    if (!announcementId) return;
    const content = this.replyContents[announcementId]?.trim();
    if (!content) return;

    this.submittingReply[announcementId] = true;
    this.announcementService.addReply(announcementId, content).subscribe({
      next: (updatedAnn) => {
        this.submittingReply[announcementId] = false;
        this.replyContents[announcementId] = '';
        // Update the announcement in the array
        const idx = this.announcements.findIndex(a => a.id === announcementId);
        if (idx !== -1) {
          this.announcements[idx] = updatedAnn;
        }
      },
      error: (err) => {
        this.submittingReply[announcementId] = false;
        alert('Failed to submit reply: ' + (err.error?.message || 'Unknown error'));
      }
    });
  }
}
