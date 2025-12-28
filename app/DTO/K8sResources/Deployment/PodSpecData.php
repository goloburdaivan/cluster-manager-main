<?php

namespace App\DTO\K8sResources\Deployment;

use Spatie\LaravelData\Data;

class PodSpecData extends Data
{
    public function __construct(
        /** @var ContainerData[] */
        public array $containers,
        public ?string $restartPolicy = 'Always',
        public ?array $nodeSelector = null,
        public ?string $serviceAccountName = null,
        public ?array $volumes = null,
    ) {}
}
