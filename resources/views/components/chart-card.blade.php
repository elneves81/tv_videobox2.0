@props(['title', 'icon', 'chartId', 'bgColor' => 'primary'])

<div class="card h-100">
    <div class="card-header bg-{{ $bgColor }} text-white">
        <h5 class="mb-0">
            <i class="bi bi-{{ $icon }} me-2"></i> {{ $title }}
        </h5>
    </div>
    <div class="card-body">
        <canvas id="{{ $chartId }}"></canvas>
    </div>
</div>
