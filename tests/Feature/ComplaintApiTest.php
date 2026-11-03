<?php

namespace Tests\Feature;

use App\Enums\ComplaintStatus;
use App\Enums\ComplaintVisibility;
use App\Models\Complaint;
use App\Models\ComplaintCategory;
use App\Models\User;
use Database\Seeders\ComplaintCategorySeeder;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ComplaintApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
        $this->seed(ComplaintCategorySeeder::class);
        Storage::fake('local');
    }

    public function test_identified_complaint_can_be_submitted(): void
    {
        $category = ComplaintCategory::query()->where('slug', 'pelayanan-sekolah')->first();

        $response = $this->postJson('/api/public/complaints', [
            'category_id' => $category->id,
            'reporter_type' => 'siswa',
            'identity_mode' => 'identified',
            'name' => 'Siswa Contoh',
            'email' => 'siswa@example.com',
            'phone' => '081234567890',
            'title' => 'Laporan pelayanan administrasi',
            'description' => 'Kronologi lengkap mengenai pelayanan administrasi yang perlu ditindaklanjuti oleh madrasah.',
            'privacy_accepted' => true,
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.ticket_number', fn ($value) => str_starts_with($value, 'ADU-'))
            ->assertJsonStructure(['data' => ['ticket_number', 'access_code']]);

        $this->assertDatabaseHas('complaint_reporter_identities', [
            'name' => 'Siswa Contoh',
            'email' => 'siswa@example.com',
        ]);
    }

    public function test_anonymous_complaint_does_not_require_identity(): void
    {
        $category = ComplaintCategory::query()->where('slug', 'kritik-dan-saran')->first();

        $response = $this->postJson('/api/public/complaints', [
            'category_id' => $category->id,
            'reporter_type' => 'masyarakat',
            'identity_mode' => 'anonymous',
            'title' => 'Saran peningkatan kebersihan',
            'description' => 'Mohon peningkatan kebersihan area kantin dan toilet siswa secara berkala setiap hari.',
            'privacy_accepted' => true,
        ]);

        $response->assertCreated();
        $this->assertDatabaseCount('complaint_reporter_identities', 0);
    }

    public function test_inactive_category_and_invalid_attachment_are_rejected(): void
    {
        $category = ComplaintCategory::factory()->create(['is_active' => false]);

        $this->postJson('/api/public/complaints', [
            'category_id' => $category->id,
            'reporter_type' => 'masyarakat',
            'identity_mode' => 'anonymous',
            'title' => 'Laporan tidak valid',
            'description' => 'Deskripsi yang cukup panjang untuk melewati validasi minimum karakter.',
            'privacy_accepted' => true,
        ])->assertUnprocessable();

        $active = ComplaintCategory::query()->where('is_active', true)->first();
        $this->post('/api/public/complaints', [
            'category_id' => $active->id,
            'reporter_type' => 'masyarakat',
            'identity_mode' => 'anonymous',
            'title' => 'Lampiran tidak valid',
            'description' => 'Deskripsi yang cukup panjang untuk melewati validasi minimum karakter.',
            'privacy_accepted' => 1,
            'attachments' => [UploadedFile::fake()->create('malware.exe', 20, 'application/octet-stream')],
        ])->assertUnprocessable();
    }

    public function test_ticket_numbers_are_unique(): void
    {
        $category = ComplaintCategory::query()->where('is_active', true)->first();
        $payload = [
            'category_id' => $category->id,
            'reporter_type' => 'masyarakat',
            'identity_mode' => 'anonymous',
            'title' => 'Laporan unik',
            'description' => 'Deskripsi yang cukup panjang untuk melewati validasi minimum karakter.',
            'privacy_accepted' => true,
        ];

        $first = $this->postJson('/api/public/complaints', $payload)->json('data.ticket_number');
        $second = $this->postJson('/api/public/complaints', $payload)->json('data.ticket_number');

        $this->assertNotSame($first, $second);
        $this->assertEquals(2, Complaint::query()->count());
    }

    public function test_tracking_requires_valid_access_code_and_hides_internal_notes(): void
    {
        $created = $this->createAnonymousComplaint();
        $ticket = $created['ticket_number'];
        $code = $created['access_code'];

        $this->postJson('/api/public/complaints/track', [
            'ticket_number' => $ticket,
        ])->assertUnprocessable();

        $this->postJson('/api/public/complaints/track', [
            'ticket_number' => $ticket,
            'access_code' => 'SALAH-SALAH-SALAH',
        ])->assertUnprocessable()
            ->assertJsonPath('message', fn ($msg) => is_string($msg));

        $this->getJson('/api/public/complaints/'.$ticket.'/status')->assertUnauthorized();

        $track = $this->postJson('/api/public/complaints/track', [
            'ticket_number' => $ticket,
            'access_code' => $code,
        ])->assertOk();

        $session = $track->json('data.tracking_token');
        $this->assertNotEmpty($session);
        $this->assertNull($track->json('data.complaint.identity'));

        $admin = $this->makeUser('superadmin');
        Sanctum::actingAs($admin);
        $complaint = Complaint::query()->where('ticket_number', $ticket)->first();
        $this->patchJson('/api/complaints/'.$complaint->id.'/status', [
            'status' => ComplaintStatus::UnderReview->value,
            'public_note' => 'Laporan sedang ditinjau petugas.',
            'internal_note' => 'Catatan rahasia internal.',
        ])->assertOk();

        $this->postJson('/api/complaints/'.$complaint->id.'/messages', [
            'message' => 'Catatan internal petugas tidak untuk pelapor.',
            'visibility' => ComplaintVisibility::Internal->value,
        ])->assertOk();

        $status = $this->withHeader('X-Complaint-Session', $session)
            ->getJson('/api/public/complaints/'.$ticket.'/status')
            ->assertOk();

        $messages = collect($status->json('data.messages'))->pluck('message');
        $timelineNotes = collect($status->json('data.timeline'))->pluck('note');

        $this->assertFalse($messages->contains('Catatan internal petugas tidak untuk pelapor.'));
        $this->assertFalse($timelineNotes->contains('Catatan rahasia internal.'));
        $this->assertTrue($timelineNotes->contains('Laporan sedang ditinjau petugas.'));
    }

    public function test_session_cannot_access_another_ticket(): void
    {
        $first = $this->createAnonymousComplaint();
        $second = $this->createAnonymousComplaint();

        $session = $this->postJson('/api/public/complaints/track', [
            'ticket_number' => $first['ticket_number'],
            'access_code' => $first['access_code'],
        ])->json('data.tracking_token');

        $this->withHeader('X-Complaint-Session', $session)
            ->getJson('/api/public/complaints/'.$second['ticket_number'].'/status')
            ->assertUnauthorized();
    }

    public function test_invalid_status_transition_is_rejected(): void
    {
        $created = $this->createAnonymousComplaint();
        $complaint = Complaint::query()->where('ticket_number', $created['ticket_number'])->first();
        Sanctum::actingAs($this->makeUser('superadmin'));

        $this->patchJson('/api/complaints/'.$complaint->id.'/status', [
            'status' => ComplaintStatus::Resolved->value,
        ])->assertUnprocessable();
    }

    public function test_operator_cannot_see_identity_and_sensitive_identity_is_restricted(): void
    {
        $category = ComplaintCategory::query()->where('slug', 'perundungan-atau-bullying')->first();
        $created = $this->postJson('/api/public/complaints', [
            'category_id' => $category->id,
            'reporter_type' => 'siswa',
            'identity_mode' => 'identified',
            'name' => 'Nama Rahasia',
            'email' => 'rahasia@example.com',
            'title' => 'Laporan perundungan di sekolah',
            'description' => 'Kronologi lengkap terkait perundungan yang dialami siswa di lingkungan madrasah.',
            'privacy_accepted' => true,
        ])->json('data');

        $complaint = Complaint::query()->where('ticket_number', $created['ticket_number'])->first();

        Sanctum::actingAs($this->makeUser('operator'));
        $this->getJson('/api/complaints/'.$complaint->id)
            ->assertOk()
            ->assertJsonMissing(['email' => 'rahasia@example.com'])
            ->assertJsonPath('data.identity_restricted', true);

        Sanctum::actingAs($this->makeUser('admin'));
        $this->getJson('/api/complaints/'.$complaint->id)
            ->assertOk()
            ->assertJsonMissing(['email' => 'rahasia@example.com']);

        Sanctum::actingAs($this->makeUser('superadmin'));
        $this->getJson('/api/complaints/'.$complaint->id)
            ->assertOk()
            ->assertJsonPath('data.identity.email', 'rahasia@example.com');
    }

    public function test_attachment_requires_authorization(): void
    {
        $category = ComplaintCategory::query()->where('is_active', true)->first();
        $file = UploadedFile::fake()->image('bukti.jpg');

        $created = $this->post('/api/public/complaints', [
            'category_id' => $category->id,
            'reporter_type' => 'masyarakat',
            'identity_mode' => 'anonymous',
            'title' => 'Laporan dengan lampiran',
            'description' => 'Deskripsi yang cukup panjang untuk melewati validasi minimum karakter.',
            'privacy_accepted' => 1,
            'attachments' => [$file],
        ])->json('data');

        $complaint = Complaint::query()->where('ticket_number', $created['ticket_number'])->first();
        $attachment = $complaint->attachments()->first();

        $this->getJson('/api/public/complaints/'.$created['ticket_number'].'/attachments/'.$attachment->id)
            ->assertUnauthorized();

        $this->getJson('/api/complaints/'.$complaint->id.'/attachments/'.$attachment->id)
            ->assertUnauthorized();

        Sanctum::actingAs($this->makeUser('guru'));
        $this->getJson('/api/complaints/'.$complaint->id.'/attachments/'.$attachment->id)
            ->assertForbidden();

        Sanctum::actingAs($this->makeUser('superadmin'));
        $this->get('/api/complaints/'.$complaint->id.'/attachments/'.$attachment->id)
            ->assertOk();
    }

    public function test_admin_endpoints_require_auth_and_dashboard_uses_database(): void
    {
        $this->getJson('/api/complaints')->assertUnauthorized();
        $this->getJson('/api/complaints/dashboard')->assertUnauthorized();

        $this->createAnonymousComplaint();
        Sanctum::actingAs($this->makeUser('superadmin'));

        $this->getJson('/api/complaints/dashboard')
            ->assertOk()
            ->assertJsonPath('data.total', 1)
            ->assertJsonPath('data.new', 1);

        Sanctum::actingAs($this->makeUser('guru'));
        $complaint = Complaint::query()->first();
        $this->patchJson('/api/complaints/'.$complaint->id.'/status', [
            'status' => ComplaintStatus::UnderReview->value,
        ])->assertForbidden();
    }

    public function test_tracking_rate_limit(): void
    {
        $created = $this->createAnonymousComplaint();

        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/public/complaints/track', [
                'ticket_number' => $created['ticket_number'],
                'access_code' => 'SALAHKODE',
            ])->assertUnprocessable();
        }

        $this->postJson('/api/public/complaints/track', [
            'ticket_number' => $created['ticket_number'],
            'access_code' => 'SALAHKODE',
        ])->assertStatus(429);
    }

    public function test_access_code_is_stored_hashed(): void
    {
        $created = $this->createAnonymousComplaint();
        $complaint = Complaint::query()->where('ticket_number', $created['ticket_number'])->first();
        $hash = $complaint->trackingTokens()->where('type', 'access')->value('token_hash');

        $this->assertNotSame($created['access_code'], $hash);
        $this->assertTrue(Hash::check($created['access_code'], $hash));
    }

    /**
     * @return array{ticket_number: string, access_code: string}
     */
    private function createAnonymousComplaint(): array
    {
        $category = ComplaintCategory::query()->where('is_active', true)->where('is_sensitive', false)->first();

        return $this->postJson('/api/public/complaints', [
            'category_id' => $category->id,
            'reporter_type' => 'masyarakat',
            'identity_mode' => 'anonymous',
            'title' => 'Laporan uji coba pelacakan',
            'description' => 'Deskripsi yang cukup panjang untuk melewati validasi minimum karakter.',
            'privacy_accepted' => true,
        ])->json('data');
    }

    private function makeUser(string $role): User
    {
        $user = User::factory()->create(['is_active' => true]);
        $user->assignRole($role);

        return $user;
    }
}
