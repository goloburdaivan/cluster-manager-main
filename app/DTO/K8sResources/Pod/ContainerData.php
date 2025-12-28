<?php

namespace App\DTO\K8sResources\Pod;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

class ContainerData extends Data
{
    public function __construct(
        public string $name,
        public string $image,
        public ?ResourcesData $resources,
        /** @var VolumeMountData[] */
        public ?array $volume_mounts,

        #[DataCollectionOf(EnvVarData::class)]
        public ?array $env,
    ) {}
}
