<?php

namespace App\DTO\K8sResources\Pod;

use Spatie\LaravelData\Data;

class VolumeData extends Data
{
    public function __construct(
        public string $name,
    ) {}
}
