<?php

namespace App\Http\Controllers;

use App\Models\AssetModel;
use App\Models\Manufacturer;
use Illuminate\Http\Request;

class ModelController extends Controller
{
    public function index(Request $request)
    {
        $query = AssetModel::with(['manufacturer', 'assets']);
        
        // Filtro por busca
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhereHas('manufacturer', function($mq) use ($search) {
                      $mq->where('name', 'like', "%{$search}%");
                  });
            });
        }
        
        // Filtro por fabricante
        if ($request->filled('manufacturer')) {
            $query->where('manufacturer_id', $request->manufacturer);
        }
        
        $models = $query->paginate(15);
        $manufacturers = Manufacturer::all();
        
        return view('models.index', compact('models', 'manufacturers'));
    }

    public function create()
    {
        $manufacturers = Manufacturer::all();
        return view('models.create', compact('manufacturers'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|max:255',
            'manufacturer_id' => 'required|exists:manufacturers,id',
            'specifications' => 'nullable|string'
        ]);

        AssetModel::create($validated);

        return redirect()->route('models.index')
            ->with('success', 'Modelo criado com sucesso.');
    }

    public function show(AssetModel $model)
    {
        $model->load(['manufacturer', 'assets.status', 'assets.location', 'assets.assignedUser']);
        return view('models.show', compact('model'));
    }

    public function edit(AssetModel $model)
    {
        $manufacturers = Manufacturer::all();
        return view('models.edit', compact('model', 'manufacturers'));
    }

    public function update(Request $request, AssetModel $model)
    {
        $validated = $request->validate([
            'name' => 'required|max:255',
            'manufacturer_id' => 'required|exists:manufacturers,id',
            'specifications' => 'nullable|string'
        ]);

        $model->update($validated);

        return redirect()->route('models.index')
            ->with('success', 'Modelo atualizado com sucesso.');
    }

    public function destroy(AssetModel $model)
    {
        $model->delete();

        return redirect()->route('models.index')
            ->with('success', 'Modelo excluído com sucesso.');
    }
}
