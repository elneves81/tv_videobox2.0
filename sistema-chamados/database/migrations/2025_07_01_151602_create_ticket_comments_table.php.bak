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
        Schema::create('ticket_comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ticket_id')->constrained()->onDelete('cascade'); // Ticket relacionado
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Usuário que comentou
            $table->text('comment'); // Conteúdo do comentário
            $table->boolean('is_internal')->default(false); // Comentário interno (apenas staff)
            $table->json('attachments')->nullable(); // Anexos do comentário
            $table->timestamps();
            
            // Índices
            $table->index(['ticket_id', 'created_at']);
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
    }
};
