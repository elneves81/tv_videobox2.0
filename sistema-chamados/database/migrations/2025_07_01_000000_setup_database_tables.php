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
        // Criar tabela de categorias
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

        // Criar tabela de tickets após categorias
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->string('title'); // Título do chamado
            $table->text('description'); // Descrição detalhada
            $table->enum('status', ['open', 'in_progress', 'pending', 'resolved', 'closed'])->default('open');
            $table->enum('priority', ['low', 'normal', 'high', 'critical'])->default('normal');
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Cliente que criou
            $table->foreignId('assigned_to')->nullable()->constrained('users')->onDelete('set null'); // Técnico responsável
            $table->foreignId('category_id')->constrained()->onDelete('cascade'); // Categoria
            $table->timestamp('due_date')->nullable(); // Prazo SLA
            $table->timestamp('resolved_at')->nullable(); // Data de resolução
            $table->timestamp('closed_at')->nullable(); // Data de fechamento
            $table->json('attachments')->nullable(); // Anexos
            $table->timestamps();
            
            // Índices para performance
            $table->index(['status', 'priority']);
            $table->index(['user_id', 'status']);
            $table->index(['assigned_to', 'status']);
        });

        // Criar tabela de comentários de tickets após tickets
        Schema::create('ticket_comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ticket_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->text('comment');
            $table->boolean('is_private')->default(false);
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
        Schema::dropIfExists('ticket_comments');
        Schema::dropIfExists('tickets');
        Schema::dropIfExists('categories');
    }
};
