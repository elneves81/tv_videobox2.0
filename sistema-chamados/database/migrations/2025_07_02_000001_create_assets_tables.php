<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Tabela de fabricantes
        Schema::create('manufacturers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // Tabela de modelos
        Schema::create('asset_models', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('manufacturer_id')->constrained()->onDelete('cascade');
            $table->text('specifications')->nullable();
            $table->timestamps();
        });

        // Tabela de localizações
        Schema::create('locations', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('postal_code')->nullable();
            $table->foreignId('parent_id')->nullable()->constrained('locations')->onDelete('set null');
            $table->timestamps();
        });

        // Tabela de departamentos
        Schema::create('departments', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('location_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('manager_id')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });

        // Tabela de status de assets
        Schema::create('asset_statuses', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('color', 7)->default('#6c757d');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Tabela principal de assets
        Schema::create('assets', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('serial_number')->nullable();
            $table->string('asset_tag')->unique();
            $table->foreignId('model_id')->constrained('asset_models')->onDelete('restrict');
            $table->foreignId('status_id')->constrained('asset_statuses')->onDelete('restrict');
            $table->foreignId('location_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('department_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('assigned_to')->nullable()->constrained('users')->onDelete('set null');
            $table->date('purchase_date')->nullable();
            $table->date('warranty_expires')->nullable();
            $table->decimal('purchase_cost', 10, 2)->nullable();
            $table->text('notes')->nullable();
            $table->json('custom_fields')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        // Tabela de manutenções
        Schema::create('asset_maintenances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('asset_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('description');
            $table->date('maintenance_date');
            $table->decimal('cost', 10, 2)->nullable();
            $table->enum('type', ['preventive', 'corrective', 'upgrade']);
            $table->timestamps();
        });

        // Adicionar campos relacionados a assets na tabela de tickets
        Schema::table('tickets', function (Blueprint $table) {
            $table->foreignId('asset_id')->nullable()->after('category_id')->constrained()->onDelete('set null');
            $table->string('impact')->nullable()->after('priority');
            $table->string('urgency')->nullable()->after('impact');
        });
    }

    public function down()
    {
        Schema::table('tickets', function (Blueprint $table) {
            $table->dropForeign(['asset_id']);
            $table->dropColumn(['asset_id', 'impact', 'urgency']);
        });
        
        Schema::dropIfExists('asset_maintenances');
        Schema::dropIfExists('assets');
        Schema::dropIfExists('asset_statuses');
        Schema::dropIfExists('departments');
        Schema::dropIfExists('locations');
        Schema::dropIfExists('asset_models');
        Schema::dropIfExists('manufacturers');
    }
};
