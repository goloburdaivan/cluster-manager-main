<?php

namespace App\DTO\K8sResources\Pod;

use Spatie\LaravelData\Data;

class EnvVarData extends Data
{
    public function __construct(
        public string $name,
        public ?string $value,
        public ?array $value_from,
    ) {}
}
