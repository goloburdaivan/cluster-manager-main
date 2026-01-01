<?php

namespace App\Enums\K8sResources\Event;

enum K8sEventType: string
{
    case NORMAL = 'Normal';
    case WARNING = 'Warning';

    public static function options(): array
    {
        return array_map(fn($case) => [
            'value' => $case->value,
            'label' => $case->value,
        ], self::cases());
    }
}
