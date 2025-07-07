<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Software
        Schema::create('software', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('version')->nullable();
            $table->foreignId('manufacturer_id')->nullable()->constrained()->onDelete('set null');
            $table->text('description')->nullable();
            $table->string('category')->nullable();
            $table->timestamps();
        });

        // Licenças
        Schema::create('software_licenses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('software_id')->constrained()->onDelete('cascade');
            $table->string('license_key');
            $table->string('license_type'); // perpetual, subscription, etc
            $table->integer('seats_total')->default(1);
            $table->integer('seats_used')->default(0);
            $table->date('purchase_date')->nullable();
            $table->date('expiration_date')->nullable();
            $table->decimal('purchase_cost', 10, 2)->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // Relação Software-Asset
        Schema::create('asset_software', function (Blueprint $table) {
            $table->id();
            $table->foreignId('asset_id')->constrained()->onDelete('cascade');
            $table->foreignId('software_id')->constrained()->onDelete('cascade');
            $table->foreignId('license_id')->nullable()->constrained('software_licenses')->onDelete('set null');
            $table->date('installation_date')->nullable();
            $table->timestamps();
        });

        // Base de Conhecimento
        Schema::create('knowledge_base', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('content');
            $table->string('category')->nullable();
            $table->boolean('is_published')->default(false);
            $table->foreignId('author_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });

        // Tags para Base de Conhecimento
        Schema::create('knowledge_tags', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->timestamps();
        });

        Schema::create('knowledge_base_tag', function (Blueprint $table) {
            $table->foreignId('knowledge_base_id')->constrained('knowledge_base')->onDelete('cascade');
            $table->foreignId('knowledge_tag_id')->constrained('knowledge_tags')->onDelete('cascade');
            $table->primary(['knowledge_base_id', 'knowledge_tag_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('knowledge_base_tag');
        Schema::dropIfExists('knowledge_tags');
        Schema::dropIfExists('knowledge_base');
        Schema::dropIfExists('asset_software');
        Schema::dropIfExists('software_licenses');
        Schema::dropIfExists('software');
    }
};
