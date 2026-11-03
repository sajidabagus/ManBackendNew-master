<?php

namespace App\Models;

use App\Enums\ComplaintStatus;
use App\Enums\ComplaintVisibility;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ComplaintStatusHistory extends Model
{
    protected $fillable = [
        'complaint_id',
        'old_status',
        'new_status',
        'changed_by',
        'note',
        'visibility',
    ];

    protected function casts(): array
    {
        return [
            'old_status' => ComplaintStatus::class,
            'new_status' => ComplaintStatus::class,
            'visibility' => ComplaintVisibility::class,
        ];
    }

    public function complaint(): BelongsTo
    {
        return $this->belongsTo(Complaint::class);
    }

    public function changer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}
