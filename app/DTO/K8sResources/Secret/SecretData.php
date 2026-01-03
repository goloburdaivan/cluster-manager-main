<?php

namespace App\DTO\K8sResources\Secret;

use Spatie\LaravelData\Data;

class SecretData extends Data
{
    public function __construct(
        public string $name,
        public string $namespace,
        public string $type,
        public array $keys,
        public string $age,
        public array $data,
        public string $uid,
        public ?array $labels = [],
        public ?array $annotations = [],
        public ?bool $immutable = false,
    ) {}
}
