<?php

namespace App\Http\Controllers\K8s;

use App\Contracts\Controllers\NeedsNamespaces;
use App\Http\Controllers\Controller;
use App\Http\Requests\General\NamespaceRequest;
use App\Services\K8s\K8sServiceService;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller implements NeedsNamespaces
{
    public function __construct(
        private readonly K8sServiceService $k8sServiceService,
    ) {
    }

    public function index(NamespaceRequest $request): Response
    {
        $data = $request->validated();

        $services = $this->k8sServiceService->getServices($data['namespace'] ?? 'default');

        return Inertia::render('Services/Index', [
            'services' => $services,
        ]);
    }

    public function show(string $namespace, string $name): JsonResponse
    {
        $service = $this->k8sServiceService->getService($namespace, $name);

        return response()->json($service);
    }
}
