<?php

namespace App\Services\K8s;

use App\DTO\Filtering\K8sEventFilterData;
use App\Jobs\ProcessK8sEventsJob;
use App\Repository\K8sEventRepository;
use Illuminate\Pagination\LengthAwarePaginator;
use Psr\Log\LoggerInterface;

readonly class K8sEventService
{
    public function __construct(
        private K8sEventRepository $repository,
        private LoggerInterface $logger,
    ) {
    }

    public function handleEventsFromWebhook(array $events): void
    {
        $this->logger->info("Received webhook events, sending them to queue for upsert");

        ProcessK8sEventsJob::dispatch($events);
    }

    public function getFilteredEvents(K8sEventFilterData $filters): LengthAwarePaginator
    {
        return $this->repository->paginateFiltered($filters);
    }
}
