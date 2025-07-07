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
        Schema::create('assets', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('asset_tag')->unique(); // Tag patrimonial
            $table->string('serial_number')->nullable();
            $table->string('model')->nullable();
            $table->foreignId('asset_type_id')->constrained()->onDelete('cascade');
            $table->foreignId('manufacturer_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('location_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('assigned_to')->nullable()->constrained('users')->onDelete('set null'); // Usuário responsável
            $table->enum('status', ['active', 'inactive', 'maintenance', 'retired', 'lost', 'stolen'])->default('active');
            $table->date('purchase_date')->nullable();
            $table->decimal('purchase_cost', 10, 2)->nullable();
            $table->date('warranty_end')->nullable();
            $table->string('supplier')->nullable();
            $table->text('notes')->nullable();
            $table->json('custom_data')->nullable(); // Dados customizados baseados no tipo
            $table->json('network_info')->nullable(); // IP, MAC, etc.
            $table->json('specifications')->nullable(); // CPU, RAM, HD, etc.
            $table->boolean('is_requestable')->default(false); // Pode ser solicitado
            $table->timestamps();
            $table->softDeletes();
            
            // Índices
            $table->index(['status', 'asset_type_id']);
            $table->index(['assigned_to', 'status']);
            $table->index('asset_tag');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('assets');
    }
};
