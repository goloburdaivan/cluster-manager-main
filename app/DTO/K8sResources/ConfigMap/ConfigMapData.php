<?php

namespace App\DTO\K8sResources\ConfigMap;

use Spatie\LaravelData\Data;

class ConfigMapData extends Data
{
    public function __construct(
        public string $name,
        public string $namespace,
        public array $keys,
        public string $age,

        public array $data,
        public ?array $binary_data,

        public ?array $labels,
        public ?array $annotations,
        public ?bool $immutable,

        public string $uid,
    ) {}
}
