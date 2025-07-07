<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Asset extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'asset_tag',
        'serial_number',
        'model',
        'asset_type_id',
        'manufacturer_id',
        'location_id',
        'assigned_to',
        'status',
        'purchase_date',
        'purchase_cost',
        'warranty_end',
        'supplier',
        'notes',
        'custom_data',
        'network_info',
        'specifications',
        'is_requestable'
    ];

    protected $casts = [
        'purchase_date' => 'date',
        'warranty_end' => 'date',
        'purchase_cost' => 'decimal:2',
        'custom_data' => 'array',
        'network_info' => 'array',
        'specifications' => 'array',
        'is_requestable' => 'boolean'
    ];

    // Relacionamentos
    public function assetType()
    {
        return $this->belongsTo(AssetType::class);
    }

    public function manufacturer()
    {
        return $this->belongsTo(Manufacturer::class);
    }

    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function assignedUser()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeAssignedTo($query, $userId)
    {
        return $query->where('assigned_to', $userId);
    }

    public function scopeByType($query, $typeId)
    {
        return $query->where('asset_type_id', $typeId);
    }

    public function scopeByLocation($query, $locationId)
    {
        return $query->where('location_id', $locationId);
    }

    // Accessors
    public function getStatusLabelAttribute()
    {
        $labels = [
            'active' => 'Ativo',
            'inactive' => 'Inativo',
            'maintenance' => 'Manutenção',
            'retired' => 'Aposentado',
            'lost' => 'Perdido',
            'stolen' => 'Roubado'
        ];

        return $labels[$this->status] ?? $this->status;
    }

    public function getStatusColorAttribute()
    {
        $colors = [
            'active' => 'success',
            'inactive' => 'secondary',
            'maintenance' => 'warning',
            'retired' => 'dark',
            'lost' => 'danger',
            'stolen' => 'danger'
        ];

        return $colors[$this->status] ?? 'secondary';
    }

    public function getIsUnderWarrantyAttribute()
    {
        return $this->warranty_end && $this->warranty_end->isFuture();
    }

    public function getAgeInMonthsAttribute()
    {
        return $this->purchase_date ? $this->purchase_date->diffInMonths(now()) : null;
    }

    // Método para gerar próximo asset_tag
    public static function generateNextAssetTag($prefix = 'ASS')
    {
        $lastAsset = static::where('asset_tag', 'like', $prefix . '%')
                          ->orderBy('asset_tag', 'desc')
                          ->first();

        if (!$lastAsset) {
            return $prefix . '0001';
        }

        $lastNumber = (int) substr($lastAsset->asset_tag, strlen($prefix));
        $nextNumber = $lastNumber + 1;

        return $prefix . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);
    }
}
