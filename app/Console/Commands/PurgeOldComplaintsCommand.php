<?php

namespace App\Console\Commands;

use App\Enums\ComplaintStatus;
use App\Models\Complaint;
use App\Models\ComplaintAttachment;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class PurgeOldComplaintsCommand extends Command
{
    protected $signature = 'complaints:purge-expired {--days=}';

    protected $description = 'Hapus pengaduan yang sudah ditutup melewati masa retensi.';

    public function handle(): int
    {
        $days = (int) ($this->option('days') ?: config('complaints.retention_days', 730));
        $cutoff = now()->subDays($days);
        $disk = Storage::disk((string) config('complaints.storage_disk', 'local'));

        $query = Complaint::query()
            ->whereIn('status', [ComplaintStatus::Closed->value, ComplaintStatus::Rejected->value])
            ->where('updated_at', '<', $cutoff);

        $count = 0;
        $query->chunkById(50, function ($complaints) use ($disk, &$count) {
            foreach ($complaints as $complaint) {
                foreach ($complaint->attachments as $attachment) {
                    /** @var ComplaintAttachment $attachment */
                    $disk->delete($attachment->storage_path);
                }
                $complaint->delete();
                $count++;
            }
        });

        $this->info("Menghapus {$count} pengaduan yang melewati masa retensi {$days} hari.");

        return self::SUCCESS;
    }
}
