<?php

use App\Http\Controllers\DeploymentController;
use App\Http\Controllers\NodeController;
use App\Http\Controllers\PodController;
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
        Route::post("/", "create");
        Route::patch("/scale", "scale");
    });
});
