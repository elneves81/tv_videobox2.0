<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // SLAs
        Schema::create('slas', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('response_time')->nullable(); // tempo em minutos
            $table->integer('resolution_time')->nullable(); // tempo em minutos
            $table->json('business_hours')->nullable(); // horário de trabalho
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Contratos
        Schema::create('contracts', function (Blueprint $table) {
            $table->id();
            $table->string('number')->unique();
            $table->string('name');
            $table->string('type'); // suporte, manutenção, licença, etc
            $table->foreignId('vendor_id')->nullable()->constrained('manufacturers')->onDelete('set null');
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->decimal('cost', 10, 2)->nullable();
            $table->text('terms')->nullable();
            $table->text('notes')->nullable();
            $table->boolean('auto_renewal')->default(false);
            $table->timestamps();
        });

        // Relação Contrato-Asset
        Schema::create('asset_contract', function (Blueprint $table) {
            $table->foreignId('asset_id')->constrained()->onDelete('cascade');
            $table->foreignId('contract_id')->constrained()->onDelete('cascade');
            $table->primary(['asset_id', 'contract_id']);
        });

        // Adicionar SLA às categorias
        Schema::table('categories', function (Blueprint $table) {
            $table->foreignId('sla_id')->nullable()->after('active')->constrained()->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->dropForeign(['sla_id']);
            $table->dropColumn('sla_id');
        });
        Schema::dropIfExists('asset_contract');
        Schema::dropIfExists('contracts');
        Schema::dropIfExists('slas');
    }
};
