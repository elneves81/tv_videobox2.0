@props(['type', 'value', 'label', 'icon'])

<div class="kpi-card kpi-{{ $type }}">
    <div class="kpi-icon">
        <i class="bi bi-{{ $icon }}"></i>
    </div>
    <div class="kpi-number">{{ $value }}</div>
    <div class="kpi-label">{{ $label }}</div>
</div>
