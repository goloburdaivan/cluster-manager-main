<?php

namespace App\Services\ClusterAgent\Resources;

use App\DTO\K8sResources\Secret\SecretData;
use App\DTO\K8sResources\Secret\SecretListData;
use Illuminate\Support\Collection;

class SecretResource extends AbstractResource
{
    public function all(string $namespace = 'default'): Collection
    {
        $response = $this->connector
            ->get("/secrets", $this->queryWithNamespace($namespace))
            ->json('data');

        return SecretListData::collect($response, Collection::class);
    }

    public function get(string $namespace, string $name): SecretData
    {
        $response = $this->connector->get("/secrets/{$namespace}/{$name}")->json();

        return SecretData::from($response);
    }
}
