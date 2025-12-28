<?php

namespace App\DTO\K8sResources\Deployment;

use Spatie\LaravelData\Data;

class DeploymentListData extends Data
{
    public function __construct(
        public string $name,
        public string $namespace,
        public int $replicas,
        public int $ready_replicas,
        public int $updated_replicas,
        public string $status,
    ) {
    }
}
