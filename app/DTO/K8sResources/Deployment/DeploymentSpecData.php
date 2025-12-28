<?php

namespace App\DTO\K8sResources\Deployment;

use Spatie\LaravelData\Data;

class DeploymentSpecData extends Data
{
    public function __construct(
        public int $replicas,
        public DeploymentSelectorData $selector,
        public PodTemplateData $template,
        public ?int $revisionHistoryLimit = 10,
        public ?bool $paused = false,
        public ?array $strategy = null,
    ) {}
}
