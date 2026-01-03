<?php

namespace App\Http\Controllers\K8s;

use App\Contracts\Controllers\NeedsNamespaces;
use App\Http\Controllers\Controller;
use App\Http\Requests\General\NamespaceRequest;
use App\Services\K8s\ConfigMapService;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

class ConfigMapController extends Controller implements NeedsNamespaces
{
    public function __construct(
        private readonly ConfigMapService $configMapService,
    ) {
    }

    public function index(NamespaceRequest $request): Response
    {
        $data = $request->validated();

        $configMaps = $this->configMapService->getConfigMaps($data['namespace'] ?? 'default');

        return Inertia::render('ConfigMaps/Index', [
            'configMaps' => $configMaps,
        ]);
    }

    public function show(string $namespace, string $name): JsonResponse
    {
        $configMap = $this->configMapService->getConfigMap($namespace, $name);

        return response()->json($configMap);
    }
}
