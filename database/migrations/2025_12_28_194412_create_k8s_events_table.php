<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('k8s_events', function (Blueprint $table) {
            $table->id();

            $table->string('uid')->unique();

            $table->string('namespace')->index();
            $table->string('type', 50)->index();
            $table->string('reason', 100);
            $table->text('message');

            $table->string('object_kind', 50)->index();
            $table->string('object_name')->index();
            $table->string('object_uid')->nullable();

            $table->string('source_component')->nullable();
            $table->string('source_host')->nullable();

            $table->integer('count')->default(1);
            $table->timestamp('first_seen_at')->index();
            $table->timestamp('last_seen_at')->index();

            $table->timestamps();

            $table->index(['namespace', 'object_kind', 'object_name']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('k8s_events');
    }
};
