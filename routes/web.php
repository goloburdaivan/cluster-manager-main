<?php

use App\Http\Controllers\K8s\ConfigMapController;
use App\Http\Controllers\K8s\DeploymentController;
use App\Http\Controllers\K8s\IngressController;
use App\Http\Controllers\K8s\K8sEventController;
use App\Http\Controllers\K8s\NodeController;
use App\Http\Controllers\K8s\PodController;
use App\Http\Controllers\K8s\SecretController;
use App\Http\Controllers\K8s\ServiceController;
use App\Http\Controllers\K8s\TopologyController;
use Illuminate\Support\Facades\Route;

Route::prefix('nodes')->group(function () {
    Route::controller(NodeController::class)->group(function () {
        Route::get("/", "index");
    });
});

Route::prefix('pods')->group(function () {
    Route::controller(PodController::class)->group(function () {
        Route::get("/", "index");
        Route::get("/{namespace}/{name}", "show");
    });
});

Route::prefix('deployments')->group(function () {
    Route::controller(DeploymentController::class)->group(function () {
        Route::get("/", "index");
        Route::get("/{namespace}/{name}", "show");
        Route::post("/", "create");
        Route::delete("/{namespace}/{name}", "destroy");
        Route::patch("/scale", "scale");
    });
});

Route::prefix('events')->group(function () {
    Route::controller(K8sEventController::class)->group(function () {
        Route::get("/", "index");
    });
});

Route::prefix('topology')->group(function () {
    Route::get('/', TopologyController::class);
});

Route::prefix('services')->group(function () {
    Route::controller(ServiceController::class)->group(function () {
        Route::get("/", "index");
        Route::get("/{namespace}/{name}", "show");
    });
});

Route::prefix('ingresses')->group(function () {
    Route::controller(IngressController::class)->group(function () {
        Route::get("/", "index");
        Route::get("/{namespace}/{name}", "show");
    });
});

Route::prefix('configmaps')->group(function () {
    Route::controller(ConfigMapController::class)->group(function () {
        Route::get("/", "index");
        Route::get("/{namespace}/{name}", "show");
    });
});

Route::prefix('secrets')->group(function () {
    Route::controller(SecretController::class)->group(function () {
        Route::get("/", "index");
        Route::get("/{namespace}/{name}", "show");
    });
});
