<?php

namespace App\Enums\K8sResources\Event;

enum K8sObjectKind: string
{
    case POD = 'Pod';
    case DEPLOYMENT = 'Deployment';
    case SERVICE = 'Service';
    case NODE = 'Node';
    case INGRESS = 'Ingress';
    case CONFIG_MAP = 'ConfigMap';
    case CRON_JOB = 'CronJob';
    case JOB = 'Job';

    public static function options(): array
    {
        return array_map(fn($case) => [
            'value' => $case->value,
            'label' => $case->value,
        ], self::cases());
    }
}
