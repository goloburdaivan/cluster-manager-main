<?php

use App\Http\Controllers\Api\EventWebhookController;
use Illuminate\Support\Facades\Route;

Route::prefix("/webhooks")->group(function () {
    Route::post("/events", EventWebhookController::class);
});
