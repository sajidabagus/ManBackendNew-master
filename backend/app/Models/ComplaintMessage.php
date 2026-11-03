<?php

namespace App\Models;

use App\Enums\ComplaintMessageSender;
use App\Enums\ComplaintVisibility;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ComplaintMessage extends Model
{
    protected $fillable = [
        'complaint_id',
        'sender_id',
        'sender_type',
        'message',
        'visibility',
    ];

    protected function casts(): array
    {
        return [
            'sender_type' => ComplaintMessageSender::class,
            'visibility' => ComplaintVisibility::class,
        ];
    }

    public function complaint(): BelongsTo
    {
        return $this->belongsTo(Complaint::class);
    }

    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
}
