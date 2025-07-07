<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attachment extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'file_path',
        'file_type',
        'file_size',
        'description',
        'attachable_id',
        'attachable_type',
        'user_id'
    ];

    public function attachable()
    {
        return $this->morphTo();
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getFileSizeFormatted()
    {
        $size = $this->file_size;
        $units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
        
        for ($i = 0; $size >= 1024 && $i < count($units) - 1; $i++) {
            $size /= 1024;
        }
        
        return round($size, 2) . ' ' . $units[$i];
    }

    public function getIconClass()
    {
        $fileType = strtolower($this->file_type);
        
        if (strpos($fileType, 'image/') !== false) {
            return 'far fa-image';
        } elseif (strpos($fileType, 'pdf') !== false) {
            return 'far fa-file-pdf';
        } elseif (strpos($fileType, 'word') !== false || strpos($fileType, 'doc') !== false) {
            return 'far fa-file-word';
        } elseif (strpos($fileType, 'excel') !== false || strpos($fileType, 'sheet') !== false || strpos($fileType, 'xls') !== false) {
            return 'far fa-file-excel';
        } elseif (strpos($fileType, 'powerpoint') !== false || strpos($fileType, 'presentation') !== false || strpos($fileType, 'ppt') !== false) {
            return 'far fa-file-powerpoint';
        } elseif (strpos($fileType, 'zip') !== false || strpos($fileType, 'rar') !== false || strpos($fileType, 'archive') !== false) {
            return 'far fa-file-archive';
        } elseif (strpos($fileType, 'text') !== false || strpos($fileType, 'txt') !== false) {
            return 'far fa-file-alt';
        } elseif (strpos($fileType, 'audio') !== false) {
            return 'far fa-file-audio';
        } elseif (strpos($fileType, 'video') !== false) {
            return 'far fa-file-video';
        } elseif (strpos($fileType, 'code') !== false || strpos($fileType, 'javascript') !== false || strpos($fileType, 'php') !== false || strpos($fileType, 'html') !== false) {
            return 'far fa-file-code';
        } else {
            return 'far fa-file';
        }
    }
}
