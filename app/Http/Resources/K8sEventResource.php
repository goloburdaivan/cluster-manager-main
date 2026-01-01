<?php

namespace App\Http\Resources;

use App\Models\K8sEvent;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin K8sEvent */
class K8sEventResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uid' => $this->uid,

            'namespace' => $this->namespace,
            'type' => $this->type,
            'reason' => $this->reason,
            'message' => $this->message,

            'object_kind' => $this->object_kind,
            'object_name' => $this->object_name,
            'object_uid' => $this->object_uid,

            'count' => (int) $this->count,

            'source_component' => $this->source_component,
            'source_host' => $this->source_host,

            'first_seen_at' => $this->first_seen_at?->format('Y-m-d H:i:s'),
            'last_seen_at' => $this->last_seen_at?->format('Y-m-d H:i:s'),

            'last_seen_human' => $this->last_seen_at?->diffForHumans(),
        ];
    }
}
