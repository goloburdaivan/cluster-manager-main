<?php

namespace App\Services;

use App\Jobs\ProcessK8sEventsJob;
use Psr\Log\LoggerInterface;

readonly class K8sEventService
{
    public function __construct(
        private LoggerInterface $logger,
    ) {
    }

    public function handleEventsFromWebhook(array $events): void
    {
        $this->logger->info("Received webhook events, sending them to queue for upsert");

        ProcessK8sEventsJob::dispatch($events);
    }
}
