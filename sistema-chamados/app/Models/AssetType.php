<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class AssetType extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'icon',
        'custom_fields',
        'is_active'
    ];

    protected $casts = [
        'custom_fields' => 'array',
        'is_active' => 'boolean'
    ];

    // Boot method para gerar slug automaticamente
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($assetType) {
            if (empty($assetType->slug)) {
                $assetType->slug = Str::slug($assetType->name);
            }
        });
    }

    // Relacionamentos
    public function assets()
    {
        return $this->hasMany(Asset::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // Accessors
    public function getIconClassAttribute()
    {
        $icons = [
            'computer' => 'bi-laptop',
            'server' => 'bi-server',
            'printer' => 'bi-printer',
            'phone' => 'bi-telephone',
            'tablet' => 'bi-tablet',
            'monitor' => 'bi-display',
            'network' => 'bi-router',
            'software' => 'bi-code-square',
            'other' => 'bi-box'
        ];
        
        return $icons[$this->icon] ?? 'bi-box';
    }
}
