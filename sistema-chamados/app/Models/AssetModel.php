<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssetModel extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'manufacturer_id',
        'specifications',
    ];

    protected $casts = [
        'specifications' => 'array',
    ];

    public function manufacturer()
    {
        return $this->belongsTo(Manufacturer::class);
    }

    public function assets()
    {
        return $this->hasMany(Asset::class, 'model_id');
    }
}
