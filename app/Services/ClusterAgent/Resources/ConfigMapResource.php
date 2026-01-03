<?php

namespace App\Services\ClusterAgent\Resources;

use App\DTO\K8sResources\ConfigMap\ConfigMapData;
use App\DTO\K8sResources\ConfigMap\ConfigMapListData;
use Illuminate\Support\Collection;

class ConfigMapResource extends AbstractResource
{
    public function all(string $namespace = 'default'): Collection
    {
        $response = $this->connector
            ->get('/configmaps', $this->queryWithNamespace($namespace))
            ->json('data');

        return ConfigMapListData::collect($response, Collection::class);
    }

    public function get(string $namespace, string $name): ConfigMapData
    {
        $response = $this->connector->get("/configmaps/{$namespace}/{$name}")->json();

        return ConfigMapData::from($response);
    }
}
