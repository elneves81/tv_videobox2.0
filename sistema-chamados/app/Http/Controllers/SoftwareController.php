<?php

namespace App\Http\Controllers;

use App\Models\Software;
use App\Models\Manufacturer;
use Illuminate\Http\Request;

class SoftwareController extends Controller
{
    public function index()
    {
        $software = Software::with('manufacturer')->orderBy('name')->get();
        return view('software.index', compact('software'));
    }

    public function create()
    {
        $manufacturers = Manufacturer::orderBy('name')->get();
        return view('software.create', compact('manufacturers'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'version' => 'required|string|max:50',
            'manufacturer_id' => 'required|exists:manufacturers,id',
            'type' => 'required|string|max:50',
            'description' => 'nullable|string',
            'is_paid' => 'boolean',
            'purchase_date' => 'nullable|date',
            'expiration_date' => 'nullable|date|after_or_equal:purchase_date',
            'license_key' => 'nullable|string|max:255',
            'license_count' => 'nullable|integer|min:1',
        ]);

        $software = Software::create($validated);

        return redirect()->route('software.index')
            ->with('success', 'Software cadastrado com sucesso.');
    }

    public function show(Software $software)
    {
        $software->load('manufacturer', 'assets');
        return view('software.show', compact('software'));
    }

    public function edit(Software $software)
    {
        $manufacturers = Manufacturer::orderBy('name')->get();
        return view('software.edit', compact('software', 'manufacturers'));
    }

    public function update(Request $request, Software $software)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'version' => 'required|string|max:50',
            'manufacturer_id' => 'required|exists:manufacturers,id',
            'type' => 'required|string|max:50',
            'description' => 'nullable|string',
            'is_paid' => 'boolean',
            'purchase_date' => 'nullable|date',
            'expiration_date' => 'nullable|date|after_or_equal:purchase_date',
            'license_key' => 'nullable|string|max:255',
            'license_count' => 'nullable|integer|min:1',
        ]);

        $software->update($validated);

        return redirect()->route('software.index')
            ->with('success', 'Software atualizado com sucesso.');
    }

    public function destroy(Software $software)
    {
        $software->delete();

        return redirect()->route('software.index')
            ->with('success', 'Software excluído com sucesso.');
    }

    public function assignAsset(Request $request, Software $software)
    {
        $validated = $request->validate([
            'asset_ids' => 'required|array',
            'asset_ids.*' => 'exists:assets,id',
        ]);

        $software->assets()->sync($validated['asset_ids']);

        return redirect()->route('software.show', $software)
            ->with('success', 'Ativos associados com sucesso.');
    }

    public function unassignAsset(Software $software, $assetId)
    {
        $software->assets()->detach($assetId);

        return redirect()->route('software.show', $software)
            ->with('success', 'Ativo desassociado com sucesso.');
    }
}
