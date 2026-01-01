<?php

namespace App\Http\Controllers;

use App\Http\Requests\General\NamespaceRequest;
use App\Services\TopologyService;
use Inertia\Inertia;
use Inertia\Response;

class TopologyController extends Controller
{
    public function __construct(
        private readonly TopologyService $topologyService,
    ) {
    }

    public function __invoke(NamespaceRequest $request): Response
    {
        $data = $request->validated();
        $namespace = $data['namespace'] ?? 'default';

        $topology = $this->topologyService->getTopology($namespace);

        return Inertia::render('Topology/Index', [
            'topology' => $topology,
        ]);
    }
}
