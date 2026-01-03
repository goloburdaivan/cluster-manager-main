<?php

namespace App\DTO\K8sResources\Service;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\DataCollectionOf;

class ServiceData extends Data
{
    public function __construct(
        public string $name,
        public string $namespace,
        public string $type,
        public string $cluster_ip,
        public ?array $selector,
        public array $ports,
        #[DataCollectionOf(ServicePortData::class)]
        public array $full_ports,

        public string $uid,
        public string $age,
        public ?array $external_ips = null,
    ) {}
}
