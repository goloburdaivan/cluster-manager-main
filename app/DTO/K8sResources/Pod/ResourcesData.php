<?php

namespace App\DTO\K8sResources\Pod;

use Spatie\LaravelData\Data;

class ResourcesData extends Data
{
    public function __construct(
        public ?array $requests,
        public ?array $limits,
    ) {}
}
