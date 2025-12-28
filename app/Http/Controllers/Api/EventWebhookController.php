<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreK8sEventsRequest;
use App\Services\K8sEventService;
use Illuminate\Http\Response;

class EventWebhookController extends Controller
{
    public function __construct(
        private readonly K8sEventService $k8sEventService,
    )
    {
    }

    public function __invoke(StoreK8sEventsRequest $request): Response
    {
        $events = $request->validated();

        $this->k8sEventService->handleEventsFromWebhook($events);

        return response()->noContent();
    }
}
