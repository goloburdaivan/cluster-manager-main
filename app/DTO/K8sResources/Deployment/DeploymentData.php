<?php

namespace App\DTO\K8sResources\Deployment;

use Spatie\LaravelData\Data;

class DeploymentData extends Data
{
    public function __construct(
        public string $apiVersion,
        public string $kind,
        public MetadataData $metadata,
        public array $spec,
        public ?array $status = null,
    ) {}
}
