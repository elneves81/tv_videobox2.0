<?php

namespace App\Http\Controllers;

use App\Models\SLA;
use App\Models\Category;
use Illuminate\Http\Request;

class SLAController extends Controller
{
    public function index()
    {
        $slas = SLA::orderBy('name')->get();
        return view('sla.index', compact('slas'));
    }

    public function create()
    {
        return view('sla.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'response_time' => 'required|integer|min:0',
            'resolution_time' => 'required|integer|min:0',
            'is_active' => 'boolean',
            'priority_low_modifier' => 'nullable|numeric',
            'priority_normal_modifier' => 'nullable|numeric',
            'priority_high_modifier' => 'nullable|numeric',
            'priority_critical_modifier' => 'nullable|numeric',
            'business_hours_only' => 'boolean',
        ]);

        $sla = SLA::create($validated);

        return redirect()->route('sla.index')
            ->with('success', 'SLA criado com sucesso.');
    }

    public function show(SLA $sla)
    {
        $sla->load('categories');
        return view('sla.show', compact('sla'));
    }

    public function edit(SLA $sla)
    {
        return view('sla.edit', compact('sla'));
    }

    public function update(Request $request, SLA $sla)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'response_time' => 'required|integer|min:0',
            'resolution_time' => 'required|integer|min:0',
            'is_active' => 'boolean',
            'priority_low_modifier' => 'nullable|numeric',
            'priority_normal_modifier' => 'nullable|numeric',
            'priority_high_modifier' => 'nullable|numeric',
            'priority_critical_modifier' => 'nullable|numeric',
            'business_hours_only' => 'boolean',
        ]);

        $sla->update($validated);

        return redirect()->route('sla.index')
            ->with('success', 'SLA atualizado com sucesso.');
    }

    public function destroy(SLA $sla)
    {
        // Verificar se há categorias usando este SLA
        if ($sla->categories()->count() > 0) {
            return redirect()->route('sla.show', $sla)
                ->with('error', 'Não é possível excluir este SLA porque existem categorias associadas a ele.');
        }

        $sla->delete();

        return redirect()->route('sla.index')
            ->with('success', 'SLA excluído com sucesso.');
    }

    public function assignCategories(Request $request, SLA $sla)
    {
        $validated = $request->validate([
            'category_ids' => 'required|array',
            'category_ids.*' => 'exists:categories,id',
        ]);

        // Atribuir o SLA às categorias selecionadas
        Category::whereIn('id', $validated['category_ids'])->update(['sla_id' => $sla->id]);

        return redirect()->route('sla.show', $sla)
            ->with('success', 'Categorias associadas com sucesso.');
    }

    public function unassignCategory(SLA $sla, $categoryId)
    {
        Category::where('id', $categoryId)->where('sla_id', $sla->id)->update(['sla_id' => null]);

        return redirect()->route('sla.show', $sla)
            ->with('success', 'Categoria desassociada com sucesso.');
    }
}
