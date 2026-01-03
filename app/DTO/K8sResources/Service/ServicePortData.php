<?php

namespace App\DTO\K8sResources\Service;

use Spatie\LaravelData\Data;

class ServicePortData extends Data
{
    public function __construct(
        public ?string $name,
        public ?string $protocol,
        public int $port,
        public string|int|null $targetPort,
        public ?int $nodePort,
    ) {}
}
