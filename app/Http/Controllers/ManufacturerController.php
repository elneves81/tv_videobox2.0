<?php

namespace App\Http\Controllers;

use App\Models\Manufacturer;
use Illuminate\Http\Request;

class ManufacturerController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('role:admin,technician')->except(['index', 'show']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Manufacturer::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('website', 'like', "%{$search}%")
                  ->orWhere('support_email', 'like', "%{$search}%");
            });
        }

        if ($request->filled('is_active')) {
            $query->where('is_active', $request->is_active);
        }

        $manufacturers = $query->withCount('assets')->paginate(15);

        return view('admin.manufacturers.index', compact('manufacturers'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('admin.manufacturers.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'website' => 'nullable|url|max:255',
            'support_phone' => 'nullable|string|max:20',
            'support_email' => 'nullable|email|max:255',
            'comment' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        $validated['is_active'] = $request->has('is_active');

        Manufacturer::create($validated);

        return redirect()->route('manufacturers.index')
            ->with('success', 'Fabricante criado com sucesso!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Manufacturer $manufacturer)
    {
        $manufacturer->load('assets');
        
        return view('admin.manufacturers.show', compact('manufacturer'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Manufacturer $manufacturer)
    {
        return view('admin.manufacturers.edit', compact('manufacturer'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Manufacturer $manufacturer)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'website' => 'nullable|url|max:255',
            'support_phone' => 'nullable|string|max:20',
            'support_email' => 'nullable|email|max:255',
            'comment' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        $validated['is_active'] = $request->has('is_active');

        $manufacturer->update($validated);

        return redirect()->route('manufacturers.index')
            ->with('success', 'Fabricante atualizado com sucesso!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Manufacturer $manufacturer)
    {
        if ($manufacturer->assets()->count() > 0) {
            return redirect()->route('manufacturers.index')
                ->with('error', 'Não é possível excluir este fabricante pois há ativos vinculados.');
        }

        $manufacturer->delete();

        return redirect()->route('manufacturers.index')
            ->with('success', 'Fabricante excluído com sucesso!');
    }
}
