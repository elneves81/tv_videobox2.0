<?php

namespace App\Exports;

use App\Models\Asset;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Illuminate\Http\Request;

class AssetsExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
{
    protected $request;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    public function query()
    {
        $query = Asset::with(['assetType', 'manufacturer', 'location', 'assignedUser']);

        // Aplicar os mesmos filtros da listagem
        if ($this->request->filled('search')) {
            $search = $this->request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('asset_tag', 'like', "%{$search}%")
                  ->orWhere('serial_number', 'like', "%{$search}%")
                  ->orWhere('model', 'like', "%{$search}%");
            });
        }

        if ($this->request->filled('asset_type_id')) {
            $query->where('asset_type_id', $this->request->asset_type_id);
        }

        if ($this->request->filled('manufacturer_id')) {
            $query->where('manufacturer_id', $this->request->manufacturer_id);
        }

        if ($this->request->filled('location_id')) {
            $query->where('location_id', $this->request->location_id);
        }

        if ($this->request->filled('status')) {
            $query->where('status', $this->request->status);
        }

        if ($this->request->filled('assigned_to')) {
            $query->where('assigned_to', $this->request->assigned_to);
        }

        return $query->orderBy('created_at', 'desc');
    }

    public function headings(): array
    {
        return [
            'Patrimônio',
            'Nome',
            'Tipo',
            'Fabricante',
            'Modelo',
            'Número de Série',
            'Status',
            'Localização',
            'Atribuído a',
            'E-mail do Usuário',
            'Data de Compra',
            'Valor de Compra',
            'Garantia até',
            'Especificações',
            'Observações',
            'Criado em',
            'Atualizado em'
        ];
    }

    public function map($asset): array
    {
        return [
            $asset->asset_tag,
            $asset->name,
            $asset->assetType ? $asset->assetType->name : '',
            $asset->manufacturer ? $asset->manufacturer->name : '',
            $asset->model ?? '',
            $asset->serial_number ?? '',
            ucfirst($asset->status),
            $asset->location ? $asset->location->name : '',
            $asset->assignedUser ? $asset->assignedUser->name : '',
            $asset->assignedUser ? $asset->assignedUser->email : '',
            $asset->purchase_date ? $asset->purchase_date->format('d/m/Y') : '',
            $asset->purchase_cost ? 'R$ ' . number_format($asset->purchase_cost, 2, ',', '.') : '',
            $asset->warranty_end ? $asset->warranty_end->format('d/m/Y') : '',
            $asset->specifications ?? '',
            $asset->notes ?? '',
            $asset->created_at->format('d/m/Y H:i'),
            $asset->updated_at->format('d/m/Y H:i')
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            // Estilo para o cabeçalho
            1 => [
                'font' => [
                    'bold' => true,
                    'color' => ['rgb' => 'FFFFFF']
                ],
                'fill' => [
                    'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                    'startColor' => ['rgb' => '4E73DF']
                ]
            ]
        ];
    }
}
