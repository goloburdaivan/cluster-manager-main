<?php

namespace App\Services\K8s;

use App\Services\ClusterAgent\K8sAgentClient;

readonly class NamespaceService
{
    public function __construct(
        private K8sAgentClient $client,
    ){
    }

    public function getNamespaces(): array
    {
        return $this->client->namespaces()->all();
    }
}
