<?php

namespace App\Models;

use App\Enums\ComplaintPriority;
use App\Enums\ComplaintStatus;
use App\Enums\IdentityMode;
use App\Enums\ReporterType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Complaint extends Model
{
    use HasFactory;

    protected $fillable = [
        'ticket_number',
        'category_id',
        'reporter_type',
        'identity_mode',
        'title',
        'description',
        'incident_at',
        'location',
        'status',
        'priority',
        'assigned_to',
        'resolved_at',
    ];

    protected function casts(): array
    {
        return [
            'reporter_type' => ReporterType::class,
            'identity_mode' => IdentityMode::class,
            'status' => ComplaintStatus::class,
            'priority' => ComplaintPriority::class,
            'incident_at' => 'datetime',
            'resolved_at' => 'datetime',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(ComplaintCategory::class, 'category_id');
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function identity(): HasOne
    {
        return $this->hasOne(ComplaintReporterIdentity::class);
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(ComplaintAttachment::class);
    }

    public function messages(): HasMany
    {
        return $this->hasMany(ComplaintMessage::class);
    }

    public function statusHistories(): HasMany
    {
        return $this->hasMany(ComplaintStatusHistory::class);
    }

    public function trackingTokens(): HasMany
    {
        return $this->hasMany(ComplaintTrackingToken::class);
    }

    public function auditLogs(): HasMany
    {
        return $this->hasMany(ComplaintAuditLog::class);
    }

    public function isSensitive(): bool
    {
        return (bool) $this->category?->is_sensitive;
    }
}
