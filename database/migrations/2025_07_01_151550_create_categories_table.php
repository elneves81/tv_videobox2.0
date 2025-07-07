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
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Nome da categoria
            $table->string('slug')->unique(); // Slug único
            $table->text('description')->nullable(); // Descrição
            $table->string('color', 7)->default('#6c757d'); // Cor hexadecimal
            $table->integer('sla_hours')->default(24); // SLA padrão em horas
            $table->boolean('active')->default(true); // Categoria ativa
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('categories');
    }
};
