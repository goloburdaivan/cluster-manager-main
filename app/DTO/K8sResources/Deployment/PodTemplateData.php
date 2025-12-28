<?php

namespace App\DTO\K8sResources\Deployment;

use Spatie\LaravelData\Data;

class PodTemplateData extends Data
{
    public function __construct(
        public MetadataData $metadata,
        public PodSpecData $spec,
    ) {}
}
