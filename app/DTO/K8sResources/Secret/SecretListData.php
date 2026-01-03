<?php

namespace App\DTO\K8sResources\Secret;

use Spatie\LaravelData\Data;

class SecretListData extends Data
{
    public function __construct(
        public string $name,
        public string $namespace,
        public string $type,
        public array $keys,
        public string $age,
    ) {}
}
