<?php

namespace App\Services\ClusterAgent\Resources;

use App\Services\ClusterAgent\AgentConnector;

abstract class AbstractResource
{
    public function __construct(
        protected AgentConnector $connector,
    ) {
    }
}
