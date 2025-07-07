<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tickets', function (Blueprint $table) {
            $table->foreignId('asset_id')->nullable()->constrained()->onDelete('set null');
            $table->enum('type', ['incident', 'request', 'change', 'problem'])->default('incident');
            $table->enum('impact', ['low', 'medium', 'high'])->default('medium');
            $table->enum('urgency', ['low', 'medium', 'high'])->default('medium');
            $table->integer('satisfaction_rating')->nullable()->comment('1-5 rating');
            $table->text('satisfaction_comment')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('tickets', function (Blueprint $table) {
            $table->dropForeign(['asset_id']);
            $table->dropColumn(['asset_id', 'type', 'impact', 'urgency', 'satisfaction_rating', 'satisfaction_comment']);
        });
    }
};
