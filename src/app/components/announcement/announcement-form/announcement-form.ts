import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AnnouncementService } from '../../../services/announcement';

@Component({
  selector: 'app-announcement-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './announcement-form.html',
  styleUrls: ['./announcement-form.css']
})
export class AnnouncementFormComponent implements OnInit {
  announcementForm!: FormGroup;
  submitting = false;

  constructor(
    private formBuilder: FormBuilder,
    private announcementService: AnnouncementService,
    private router: Router
  ) {}

  ngOnInit() {
    this.announcementForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      content: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.announcementForm.invalid) return;

    this.submitting = true;
    this.announcementService.create(this.announcementForm.value).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/dashboard/announcements']);
      },
      error: (err) => {
        alert('Failed to post announcement: ' + (err.error?.message || 'Unknown error'));
        this.submitting = false;
      }
    });
  }
}
