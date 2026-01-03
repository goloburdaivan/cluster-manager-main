<?php

namespace App\DTO\K8sResources\Node;
use App\Enums\K8sResources\Node\NodeStatus;
use Spatie\LaravelData\Data;

class NodeData extends Data
{
    public function __construct(
        public string $name,
        public NodeStatus $status,
        public string $role,
        public string $version,
        public ?string $cpu = null,
        public ?string $memory = null,
    ) {}
}
