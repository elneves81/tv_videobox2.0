<?php

namespace App\Http\Controllers;

use App\Models\AssetType;
use Illuminate\Http\Request;

class AssetTypeController extends Controller
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
        $query = AssetType::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->filled('is_active')) {
            $query->where('is_active', $request->is_active);
        }

        $assetTypes = $query->withCount('assets')->paginate(15);

        return view('admin.asset-types.index', compact('assetTypes'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('admin.asset-types.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:100',
            'is_active' => 'boolean'
        ]);

        $validated['is_active'] = $request->has('is_active');

        AssetType::create($validated);

        return redirect()->route('asset-types.index')
            ->with('success', 'Tipo de ativo criado com sucesso!');
    }

    /**
     * Display the specified resource.
     */
    public function show(AssetType $assetType)
    {
        $assetType->load('assets');
        
        return view('admin.asset-types.show', compact('assetType'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AssetType $assetType)
    {
        return view('admin.asset-types.edit', compact('assetType'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, AssetType $assetType)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:100',
            'is_active' => 'boolean'
        ]);

        $validated['is_active'] = $request->has('is_active');

        $assetType->update($validated);

        return redirect()->route('asset-types.index')
            ->with('success', 'Tipo de ativo atualizado com sucesso!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AssetType $assetType)
    {
        if ($assetType->assets()->count() > 0) {
            return redirect()->route('asset-types.index')
                ->with('error', 'Não é possível excluir este tipo pois há ativos vinculados.');
        }

        $assetType->delete();

        return redirect()->route('asset-types.index')
            ->with('success', 'Tipo de ativo excluído com sucesso!');
    }
}
