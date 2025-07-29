<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class ActivityLog
 *
 * @property int $id
 * @property int|null $user_id
 * @property string $action
 * @property string $model_type
 * @property int $model_id
 * @property array|null $old_values
 * @property array|null $new_values
 * @property string|null $ip_address
 * @property string|null $user_agent
 * @property \App\Models\User|null $user
 */
class ActivityLog extends Model
{
    protected $fillable = [
        'user_id',
        'action',
        'model_type',
        'model_id',
        'old_values',
        'new_values',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'old_values' => 'array',
        'new_values' => 'array',
    ];

    /**
     * Usuário relacionado ao log.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Registra uma atividade no log.
     *
     * @param string $action
     * @param Model|null $model
     * @param array|null $oldValues
     * @param array|null $newValues
     * @return void
     */
    public static function logActivity($action, $model = null, $oldValues = null, $newValues = null)
    {
        $userId = auth()->check() ? auth()->id() : null;
        $modelType = $model ? get_class($model) : null;
        $modelId = $model && isset($model->id) ? $model->id : null;

        // Permite logging mesmo fora de request (ex: jobs)
        $ip = function_exists('request') && request()?->ip() ? request()->ip() : null;
        $userAgent = function_exists('request') && request()?->userAgent() ? request()->userAgent() : null;

        self::create([
            'user_id' => $userId,
            'action' => $action,
            'model_type' => $modelType,
            'model_id' => $modelId,
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'ip_address' => $ip,
            'user_agent' => $userAgent,
        ]);
    }

    /**
     * Eventos de model para auditoria futura (exemplo de uso de observer).
     */
    protected static function booted()
    {
        // Exemplo: log automático ao deletar
        static::deleting(function ($log) {
            // Poderia registrar auditoria de deleção aqui
        });
    }
}
