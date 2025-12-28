<?php

namespace App\DTO\K8sResources\Deployment;

use Spatie\LaravelData\Data;

class MetadataData extends Data
{
    public function __construct(
        public string $name,
        public ?string $namespace = 'default',
        public ?array $labels = null,
        public ?array $annotations = null,
    ) {}
}
