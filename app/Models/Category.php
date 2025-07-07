<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'color',
        'sla_hours',
        'active'
    ];

    protected $casts = [
        'active' => 'boolean'
    ];

    // Relacionamentos
    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }

    // Mutators
    public function setNameAttribute($value)
    {
        $this->attributes['name'] = $value;
        $this->attributes['slug'] = Str::slug($value);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('active', true);
    }

    // Accessors
    public function getTicketCountAttribute()
    {
        return $this->tickets()->count();
    }

    public function getOpenTicketCountAttribute()
    {
        return $this->tickets()->whereNotIn('status', ['resolved', 'closed'])->count();
    }
}
