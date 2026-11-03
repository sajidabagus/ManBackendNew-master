<?php

namespace App\Models;

use App\Enums\ComplaintVisibility;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ComplaintAttachment extends Model
{
    protected $fillable = [
        'complaint_id',
        'uploaded_by',
        'original_name',
        'storage_path',
        'mime_type',
        'file_size',
        'visibility',
    ];

    protected function casts(): array
    {
        return [
            'file_size' => 'integer',
            'visibility' => ComplaintVisibility::class,
        ];
    }

    public function complaint(): BelongsTo
    {
        return $this->belongsTo(Complaint::class);
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
