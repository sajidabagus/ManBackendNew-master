<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ComplaintReporterIdentity extends Model
{
    protected $fillable = [
        'complaint_id',
        'name',
        'email',
        'phone',
        'contact_preference',
    ];

    public function complaint(): BelongsTo
    {
        return $this->belongsTo(Complaint::class);
    }
}
