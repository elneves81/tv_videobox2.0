<?php

namespace App\Http\Controllers;

use App\Models\License;
use App\Models\Software;
use Illuminate\Http\Request;

class LicenseController extends Controller
{
    public function index()
    {
        $licenses = License::with(['software'])->orderBy('created_at', 'desc')->get();
        return view('licenses.index', compact('licenses'));
    }

    public function create()
    {
        $software = Software::where('is_paid', true)->orderBy('name')->get();
        return view('licenses.create', compact('software'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'software_id' => 'required|exists:software,id',
            'license_key' => 'required|string|max:255',
            'seats' => 'required|integer|min:1',
            'purchase_date' => 'nullable|date',
            'expiration_date' => 'nullable|date|after_or_equal:purchase_date',
            'price' => 'nullable|numeric|min:0',
            'vendor' => 'nullable|string|max:255',
            'order_number' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $license = License::create($validated);

        return redirect()->route('licenses.index')
            ->with('success', 'Licença cadastrada com sucesso.');
    }

    public function show(License $license)
    {
        $license->load('software', 'assets');
        return view('licenses.show', compact('license'));
    }

    public function edit(License $license)
    {
        $software = Software::where('is_paid', true)->orderBy('name')->get();
        return view('licenses.edit', compact('license', 'software'));
    }

    public function update(Request $request, License $license)
    {
        $validated = $request->validate([
            'software_id' => 'required|exists:software,id',
            'license_key' => 'required|string|max:255',
            'seats' => 'required|integer|min:1',
            'purchase_date' => 'nullable|date',
            'expiration_date' => 'nullable|date|after_or_equal:purchase_date',
            'price' => 'nullable|numeric|min:0',
            'vendor' => 'nullable|string|max:255',
            'order_number' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $license->update($validated);

        return redirect()->route('licenses.index')
            ->with('success', 'Licença atualizada com sucesso.');
    }

    public function destroy(License $license)
    {
        // Verificar se há ativos usando esta licença
        if ($license->assets()->count() > 0) {
            return redirect()->route('licenses.show', $license)
                ->with('error', 'Não é possível excluir a licença porque existem ativos associados a ela.');
        }

        $license->delete();

        return redirect()->route('licenses.index')
            ->with('success', 'Licença excluída com sucesso.');
    }

    public function assignAsset(Request $request, License $license)
    {
        $validated = $request->validate([
            'asset_ids' => 'required|array',
            'asset_ids.*' => 'exists:assets,id',
        ]);

        if (count($validated['asset_ids']) > $license->available_seats) {
            return redirect()->route('licenses.show', $license)
                ->with('error', 'Não há lugares disponíveis suficientes para associar todos esses ativos.');
        }

        foreach ($validated['asset_ids'] as $assetId) {
            $asset = \App\Models\Asset::find($assetId);
            $asset->license_id = $license->id;
            $asset->save();
        }

        return redirect()->route('licenses.show', $license)
            ->with('success', 'Ativos associados com sucesso.');
    }

    public function unassignAsset(License $license, $assetId)
    {
        $asset = \App\Models\Asset::find($assetId);
        if ($asset && $asset->license_id == $license->id) {
            $asset->license_id = null;
            $asset->save();
        }

        return redirect()->route('licenses.show', $license)
            ->with('success', 'Ativo desassociado com sucesso.');
    }
}
