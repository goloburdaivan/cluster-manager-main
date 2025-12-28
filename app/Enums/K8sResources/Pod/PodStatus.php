<?php

namespace App\Enums\K8sResources\Pod;

enum PodStatus: string
{
    case Pending = 'Pending';
    case Running = 'Running';
    case Succeeded = 'Succeeded';
    case Failed = 'Failed';
    case Unknown = 'Unknown';
    case Terminating = 'Terminating';
    case CrashLoopBackOff = 'CrashLoopBackOff';
    case ContainerCreating = 'ContainerCreating';
    case ErrImagePull = 'ErrImagePull';
    case Error = 'Error';

    public function color(): string
    {
        return match($this) {
            self::Running, self::Succeeded => 'green',
            self::Pending, self::ContainerCreating => 'amber',
            self::Terminating => 'orange',
            default => 'red',
        };
    }
}
