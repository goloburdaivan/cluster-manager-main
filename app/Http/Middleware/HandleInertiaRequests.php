<?php

namespace App\Http\Middleware;

use App\Contracts\Controllers\NeedsNamespaces;
use App\Services\K8s\NamespaceService;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{

    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    public function __construct(
        private readonly NamespaceService $namespaceService,
    )
    {
    }

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $props = [
            ...parent::share($request),
            'namespaces' => [],
        ];

        $controller = $request->route()->getController();

        if ($controller instanceof NeedsNamespaces) {
            $props['namespaces'] = $this->namespaceService->getNamespaces();
        }

        return $props;
    }
}
