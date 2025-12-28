<?php

namespace App\DTO\K8sResources\Pod;

use App\Enums\K8sResources\Pod\PodStatus;
use Spatie\LaravelData\Data;

class PodData extends Data
{
    public function __construct(
        public string $name,
        public string $namespace,
        public string|PodStatus $status,
        public int $restarts,
        public ?string $ip,
        public ?string $owner_name,
        public ?array $labels,
    ) {}
}
