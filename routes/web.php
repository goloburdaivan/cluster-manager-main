<?php

use App\Http\Controllers\DeploymentController;
use App\Http\Controllers\K8sEventController;
use App\Http\Controllers\NodeController;
use App\Http\Controllers\PodController;
use App\Http\Controllers\TopologyController;
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
