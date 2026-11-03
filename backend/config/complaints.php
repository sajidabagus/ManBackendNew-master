<?php

return [
    'ticket_prefix' => 'ADU',
    'access_code_bytes' => 16,
    'session_ttl_minutes' => 120,
    'max_attachments' => 3,
    'max_attachment_kb' => 5120,
    'allowed_mimes' => [
        'image/jpeg',
        'image/png',
        'image/webp',
        'application/pdf',
    ],
    'allowed_extensions' => ['jpg', 'jpeg', 'png', 'webp', 'pdf'],
    'storage_disk' => 'local',
    'storage_directory' => 'complaints',
    'retention_days' => (int) env('COMPLAINT_RETENTION_DAYS', 730),
    'dummy_password_hash' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
];
