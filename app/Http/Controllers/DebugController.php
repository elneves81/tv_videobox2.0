<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class DebugController extends Controller
{
    public function index()
    {
        $admin = User::where('email', 'admin@admin.com')->first();
        
        $data = [
            'admin' => $admin,
            'passwordCheck' => $admin ? Hash::check('admin123', $admin->password) : false,
            'totalUsers' => User::count(),
            'activeUsers' => User::where('is_active', true)->count(),
            'adminUsers' => User::where('role', 'admin')->count(),
            'techUsers' => User::where('role', 'technician')->count(),
        ];
        
        return view('debug', $data);
    }
}
