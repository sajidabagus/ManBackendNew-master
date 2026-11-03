<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('banners');
    }

    public function down(): void
    {
        // Table dropped permanently; recreate via original migration if needed.
    }
};
