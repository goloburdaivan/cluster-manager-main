<?php

namespace App\DTO\K8sResources\Pod;

use App\Enums\K8sResources\Pod\PodStatus;
use Spatie\LaravelData\Attributes\DataCollectionOf;

class PodDetailData extends PodData
{
    public function __construct(
        string $name,
        string $namespace,
        string|PodStatus $status,
        ?string $ip,
        ?string $owner_name,
        int $restarts,
        ?array $labels,

        // Info Tab
        public string $uid,
        public string $node,

        public string $created,

        public ?array $pod_ips,

        #[DataCollectionOf(ContainerData::class)]
        public array $containers,

        public ?array $container_statuses,

        #[DataCollectionOf(VolumeData::class)]
        public array $volumes,

        public ?array $conditions,
    ) {
        parent::__construct(
            name: $name,
            namespace: $namespace,
            status: $status,
            ip: $ip,
            owner_name: $owner_name,
            restarts: $restarts,
            labels: $labels
        );
    }
}
