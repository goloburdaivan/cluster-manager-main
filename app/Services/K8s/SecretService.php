<?php

namespace App\Services\K8s;

use App\DTO\K8sResources\Secret\SecretData;
use App\Services\ClusterAgent\K8sAgentClient;
use Illuminate\Support\Collection;

readonly class SecretService
{
    public function __construct(
        private K8sAgentClient $client,
    ) {
    }

    public function getSecrets(string $namespace = 'default'): Collection
    {
        return $this->client->secrets()->all($namespace);
    }

    public function getSecret(string $namespace, string $name): SecretData
    {
        return $this->client->secrets()->get($namespace, $name);
    }
}
