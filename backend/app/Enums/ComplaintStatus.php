<?php

namespace App\Enums;

enum ComplaintStatus: string
{
    case Submitted = 'submitted';
    case UnderReview = 'under_review';
    case Assigned = 'assigned';
    case InProgress = 'in_progress';
    case WaitingReporter = 'waiting_reporter';
    case Resolved = 'resolved';
    case Closed = 'closed';
    case Rejected = 'rejected';

    /**
     * @return list<self>
     */
    public function allowedTransitions(): array
    {
        return match ($this) {
            self::Submitted => [self::UnderReview, self::Rejected, self::Closed],
            self::UnderReview => [self::Assigned, self::InProgress, self::WaitingReporter, self::Rejected, self::Closed],
            self::Assigned => [self::InProgress, self::WaitingReporter, self::Rejected, self::Closed],
            self::InProgress => [self::WaitingReporter, self::Resolved, self::Closed, self::Assigned],
            self::WaitingReporter => [self::InProgress, self::Assigned, self::Resolved, self::Closed],
            self::Resolved => [self::Closed, self::InProgress],
            self::Rejected => [self::Closed, self::UnderReview],
            self::Closed => [],
        };
    }

    public function canTransitionTo(self $target): bool
    {
        return in_array($target, $this->allowedTransitions(), true);
    }

    public function label(): string
    {
        return match ($this) {
            self::Submitted => 'Baru masuk',
            self::UnderReview => 'Sedang ditinjau',
            self::Assigned => 'Ditugaskan',
            self::InProgress => 'Sedang ditindaklanjuti',
            self::WaitingReporter => 'Menunggu informasi pelapor',
            self::Resolved => 'Selesai',
            self::Closed => 'Ditutup',
            self::Rejected => 'Tidak dapat ditindaklanjuti',
        };
    }
}
