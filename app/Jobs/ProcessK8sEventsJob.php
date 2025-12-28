<?php

namespace App\Jobs;

use App\Repository\K8sEventRepository;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Carbon;
use Psr\Log\LoggerInterface;

class ProcessK8sEventsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    /**
     * Create a new job instance.
     * * @param array $events Масив "сирих" подій з Go-агента
     */
    public function __construct(
        public array $events
    ) {

    }

    /**
     * Execute the job.
     */
    public function handle(
        K8sEventRepository $repository,
        LoggerInterface $logger,
    ): void {
        if (empty($this->events)) {
            return;
        }

        $preparedEvents = [];
        $now = now();

        foreach ($this->events as $event) {
            try {
                $firstSeen = isset($event['firstTimestamp'])
                    ? Carbon::parse($event['firstTimestamp'])
                    : $now;

                $lastSeen = isset($event['lastTimestamp'])
                    ? Carbon::parse($event['lastTimestamp'])
                    : $now;

                $preparedEvents[] = [
                    'uid' => $event['metadata']['uid'],

                    'namespace' => $event['involvedObject']['namespace'] ?? 'default',
                    'type'      => $event['type'] ?? 'Normal',
                    'reason'    => $event['reason'] ?? 'Unknown',
                    'message'   => $event['message'] ?? '',

                    'object_kind' => $event['involvedObject']['kind'] ?? 'Unknown',
                    'object_name' => $event['involvedObject']['name'] ?? 'Unknown',
                    'object_uid'  => $event['involvedObject']['uid'] ?? null,

                    'source_component' => $event['source']['component'] ?? null,
                    'source_host'      => $event['source']['host'] ?? null,

                    'count' => $event['count'] ?? 1,

                    'first_seen_at' => $firstSeen->toDateTimeString(),
                    'last_seen_at'  => $lastSeen->toDateTimeString(),

                    'updated_at'    => $now->toDateTimeString(),
                    'created_at'    => $now->toDateTimeString(),
                ];

            } catch (\Exception $e) {
                $logger->warning("Failed to parse event in job: " . $e->getMessage(), [
                    'event_uid' => $event['metadata']['uid'] ?? 'unknown'
                ]);
                continue;
            }
        }

        if (!empty($preparedEvents)) {
            $repository->saveBatch($preparedEvents);
        }
    }
}
