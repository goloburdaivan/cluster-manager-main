<?php

namespace App\Enums\K8sResources\Node;

enum NodeStatus: string
{
    case Ready = 'Ready';
    case NotReady = 'NotReady';
    case Unknown = 'Unknown';
}
