<?php

namespace App\DTO\K8sResources\Service;

use Spatie\LaravelData\Data;

class ServiceListData extends Data
{
    public function __construct(
        public string $name,
        public string $namespace,
        public string $type,
        public string $cluster_ip,
        public array $ports,
        public ?array $selector = [],
        public ?array $external_ips = [],
    ) {}
}
