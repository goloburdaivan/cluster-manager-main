<?php

namespace App\Http\Controllers\K8s;

use App\Contracts\Controllers\NeedsNamespaces;
use App\Http\Controllers\Controller;
use App\Http\Requests\General\NamespaceRequest;
use App\Services\K8s\IngressService;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

class IngressController extends Controller implements NeedsNamespaces
{
    public function __construct(
        private readonly IngressService $ingressService,
    ) {
    }

    public function index(NamespaceRequest $request): Response
    {
        $data = $request->validated();

        $ingresses = $this->ingressService->getIngresses($data['namespace'] ?? 'default');

        return Inertia::render('Ingresses/Index', [
            'ingresses' => $ingresses,
        ]);
    }

    public function show(string $namespace, string $name): JsonResponse
    {
        $ingresses = $this->ingressService->getIngress($namespace, $name);

        return response()->json($ingresses);
    }
}
