<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BoardSettings extends Model
{
    protected $fillable = [
        'user_id',
        'refresh_interval',
        'sound_enabled',
        'theme',
        'columns_visible',
        'filters',
        'notifications_enabled'
    ];
    
    protected $casts = [
        'columns_visible' => 'array',
        'filters' => 'array',
        'sound_enabled' => 'boolean',
        'notifications_enabled' => 'boolean'
    ];
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    public static function getDefaultSettings()
    {
        return [
            'refresh_interval' => 15000, // 15 segundos
            'sound_enabled' => true,
            'theme' => 'dark',
            'columns_visible' => ['open', 'in_progress', 'resolved', 'closed'],
            'filters' => [
                'priority' => 'all',
                'category' => 'all',
                'assigned_to' => 'all'
            ],
            'notifications_enabled' => true
        ];
    }
    
    public function updateSettings(array $settings)
    {
        $this->update(array_merge($this->toArray(), $settings));
    }
}
