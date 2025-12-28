<?php

namespace App\Services\ClusterAgent;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Client\Response;
use Psr\Log\LoggerInterface;
use Throwable;

class AgentConnector
{
    public function __construct(
        private LoggerInterface $logger,
        private string $baseUrl,
        private int $clientTimeout = 5,
    ) {
    }

    /**
     * @throws Throwable
     */
    public function get(string $endpoint, array $query = []): Response
    {
        try {
            return $this->client()->get($endpoint, $query)->throw();
        } catch (Throwable $e) {
            $this->logger->error("K8s Agent Error [GET $endpoint]: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * @throws RequestException
     * @throws ConnectionException
     */
    public function post(string $endpoint, array $data = []): Response
    {
        return $this->client()->post($endpoint, $data)->throw();
    }

    /**
     * @throws RequestException
     * @throws ConnectionException
     */
    public function patch(string $endpoint, array $data = []): Response
    {
        return $this->client()->patch($endpoint, $data)->throw();
    }

    /**
     * @throws RequestException
     * @throws ConnectionException
     */
    public function delete(string $endpoint, array $data = []): Response
    {
        return $this->client()->delete($endpoint, $data)->throw();
    }

    private function client(): PendingRequest
    {
        return Http::baseUrl($this->baseUrl)
            ->acceptJson()
            ->timeout($this->clientTimeout)
            ->asJson();
    }
}
