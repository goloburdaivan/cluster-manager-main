<?php

namespace App\Http\Controllers;

use App\Contracts\Controllers\NeedsNamespaces;
use App\DTO\Filtering\K8sEventFilterData;
use App\Enums\K8sResources\Event\K8sEventType;
use App\Enums\K8sResources\Event\K8sObjectKind;
use App\Http\Requests\K8sEvent\GetK8sEventsRequest;
use App\Http\Resources\K8sEventResource;
use App\Services\K8sEventService;
use Inertia\Inertia;
use Inertia\Response;

class K8sEventController extends Controller implements NeedsNamespaces
{
    public function __construct(
        private readonly K8sEventService $k8sEventService,
    ) {
    }

    public function index(GetK8sEventsRequest $request): Response
    {
        $filters = K8sEventFilterData::from($request->validated());

        $events = $this->k8sEventService->getFilteredEvents($filters);

        return Inertia::render('K8sEvents/Index', [
            'events' => K8sEventResource::collection($events),
            'filters' => $filters,
            'kinds' => K8sObjectKind::options(),
            'types' => K8sEventType::options(),
        ]);
    }
}
