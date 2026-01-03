<?php

namespace App\DTO\K8sResources\ConfigMap;

use Spatie\LaravelData\Data;

class ConfigMapListData extends Data
{
    public function __construct(
        public string $name,
        public string $namespace,
        public array $keys,
        public string $age,
    ) {}
}
