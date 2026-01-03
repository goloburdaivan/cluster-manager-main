<?php

namespace App\Services\ClusterAgent;

use App\Services\ClusterAgent\Resources\ConfigMapResource;
use App\Services\ClusterAgent\Resources\DeploymentResource;
use App\Services\ClusterAgent\Resources\IngressResource;
use App\Services\ClusterAgent\Resources\NamespaceResource;
use App\Services\ClusterAgent\Resources\NodeResource;
use App\Services\ClusterAgent\Resources\PodResource;
use App\Services\ClusterAgent\Resources\SecretResource;
use App\Services\ClusterAgent\Resources\ServiceResource;
use App\Services\ClusterAgent\Resources\TopologyResource;

class K8sAgentClient
{
    private array $resources = [];

    public function __construct(
        private readonly AgentConnector  $connector,
    )
    {
    }

    public function nodes(): NodeResource
    {
        return $this->resources['nodes'] ??= new NodeResource($this->connector);
    }

    public function deployments(): DeploymentResource
    {
        return $this->resources['deployments'] ??= new DeploymentResource($this->connector);
    }

    public function pods(): PodResource
    {
        return $this->resources['pods'] ??= new PodResource($this->connector);
    }

    public function namespaces(): NamespaceResource
    {
        return $this->resources['namespaces'] ??= new NamespaceResource($this->connector);
    }

    public function topology(): TopologyResource
    {
        return $this->resources['topology'] ??= new TopologyResource($this->connector);
    }

    public function services(): ServiceResource
    {
        return $this->resources['services'] ??= new ServiceResource($this->connector);
    }

    public function ingresses(): IngressResource
    {
        return $this->resources['ingresses'] ??= new IngressResource($this->connector);
    }

    public function configMaps(): ConfigMapResource
    {
        return $this->resources['configmaps'] ??= new ConfigMapResource($this->connector);
    }

    public function secrets(): SecretResource
    {
        return $this->resources['secrets'] ??= new SecretResource($this->connector);
    }
}
