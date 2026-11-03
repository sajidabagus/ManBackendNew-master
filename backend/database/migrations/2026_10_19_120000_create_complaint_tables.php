<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('complaint_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('is_sensitive')->default(false);
            $table->string('default_priority', 20)->default('normal');
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['is_active', 'sort_order']);
        });

        Schema::create('complaints', function (Blueprint $table) {
            $table->id();
            $table->string('ticket_number', 32)->unique();
            $table->foreignId('category_id')->constrained('complaint_categories')->restrictOnDelete();
            $table->string('reporter_type', 30);
            $table->string('identity_mode', 20);
            $table->string('title');
            $table->text('description');
            $table->timestamp('incident_at')->nullable();
            $table->string('location')->nullable();
            $table->string('status', 30)->default('submitted');
            $table->string('priority', 20)->default('normal');
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();

            $table->index(['status', 'created_at']);
            $table->index(['category_id', 'status']);
            $table->index(['assigned_to', 'status']);
            $table->index('priority');
        });

        Schema::create('complaint_reporter_identities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('complaint_id')->unique()->constrained('complaints')->cascadeOnDelete();
            $table->string('name')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('contact_preference', 20)->nullable();
            $table->timestamps();
        });

        Schema::create('complaint_attachments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('complaint_id')->constrained('complaints')->cascadeOnDelete();
            $table->foreignId('uploaded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('original_name');
            $table->string('storage_path');
            $table->string('mime_type', 100);
            $table->unsignedBigInteger('file_size');
            $table->string('visibility', 20)->default('public');
            $table->timestamps();

            $table->index(['complaint_id', 'visibility']);
        });

        Schema::create('complaint_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('complaint_id')->constrained('complaints')->cascadeOnDelete();
            $table->foreignId('sender_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('sender_type', 20);
            $table->text('message');
            $table->string('visibility', 20)->default('public');
            $table->timestamps();

            $table->index(['complaint_id', 'visibility', 'created_at']);
        });

        Schema::create('complaint_status_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('complaint_id')->constrained('complaints')->cascadeOnDelete();
            $table->string('old_status', 30)->nullable();
            $table->string('new_status', 30);
            $table->foreignId('changed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->text('note')->nullable();
            $table->string('visibility', 20)->default('internal');
            $table->timestamps();

            $table->index(['complaint_id', 'created_at']);
        });

        Schema::create('complaint_tracking_tokens', function (Blueprint $table) {
            $table->id();
            $table->foreignId('complaint_id')->constrained('complaints')->cascadeOnDelete();
            $table->string('type', 20);
            $table->string('token_hash');
            $table->timestamp('expires_at')->nullable();
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('revoked_at')->nullable();
            $table->timestamps();

            $table->unique('token_hash');
            $table->index(['complaint_id', 'type']);
        });

        Schema::create('complaint_audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('actor_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('complaint_id')->nullable()->constrained('complaints')->nullOnDelete();
            $table->string('action', 80);
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['complaint_id', 'created_at']);
            $table->index(['actor_id', 'action']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('complaint_audit_logs');
        Schema::dropIfExists('complaint_tracking_tokens');
        Schema::dropIfExists('complaint_status_histories');
        Schema::dropIfExists('complaint_messages');
        Schema::dropIfExists('complaint_attachments');
        Schema::dropIfExists('complaint_reporter_identities');
        Schema::dropIfExists('complaints');
        Schema::dropIfExists('complaint_categories');
    }
};
