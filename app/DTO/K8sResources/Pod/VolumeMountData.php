<?php

namespace App\DTO\K8sResources\Pod;

use Spatie\LaravelData\Data;

class VolumeMountData extends Data
{
    public function __construct(
        public string $name,
        public string $mount_path,
        public bool $read_only = false,
    ) {
    }
}
