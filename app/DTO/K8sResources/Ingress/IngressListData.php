<?php

namespace App\DTO\K8sResources\Ingress;

use Spatie\LaravelData\Data;

class IngressListData extends Data
{
    public function __construct(
        public string $name,
        public string $namespace,
        public string $load_balancer,
        public array $rules,
        public string $age,
    ) {}
}
