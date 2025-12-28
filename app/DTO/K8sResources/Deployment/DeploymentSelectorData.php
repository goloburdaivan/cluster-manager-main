<?php

namespace App\DTO\K8sResources\Deployment;

use Spatie\LaravelData\Data;

class DeploymentSelectorData extends Data
{
    public function __construct(
        public array $matchLabels,
    ) {}
}
