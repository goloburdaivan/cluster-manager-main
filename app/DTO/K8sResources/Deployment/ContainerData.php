<?php

namespace App\DTO\K8sResources\Deployment;

use Spatie\LaravelData\Data;

class ContainerData extends Data
{
    public function __construct(
        public string $name,
        public string $image,
        public ?string $imagePullPolicy = 'IfNotPresent',
        public ?array $ports = [],
        public ?array $resources = [],
        public ?array $env = [],
        public ?array $livenessProbe = null,
        public ?array $readinessProbe = null,
        public ?array $volumeMounts = [],
    ) {}
}
