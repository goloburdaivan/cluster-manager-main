import React, {useState, useCallback, useEffect} from 'react';
import {Head, router, usePoll} from '@inertiajs/react';
import {debounce} from 'lodash';
import AppLayout from '../../Layouts/AppLayout';
import NamespaceSelector from '../../Components/K8s/Namespace/NamespaceSelector.jsx';
import {
    Table,
    Badge,
    Text,
    Heading,
    Card,
    Flex,
    Box,
    TextField,
    Select,
    Button,
    IconButton,
    Tooltip,
    Separator, Checkbox
} from '@radix-ui/themes';
import {
    MagnifyingGlassIcon,
    ReloadIcon,
    ExclamationTriangleIcon,
    InfoCircledIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    Cross2Icon
} from '@radix-ui/react-icons';

export default function K8sEventsIndex({
                                           events,
                                           filters: serverFilters,
                                           kinds,
                                           types,
                                           namespaces
                                       }) {
    console.log(events);
    const [filters, setFilters] = useState({
        object_name: serverFilters.object_name || '',
        namespace: serverFilters.namespace || '',
        object_kind: serverFilters.object_kind || 'all',
        type: serverFilters.type || 'all',
        sort_by: serverFilters.sort_by || 'last_seen_at',
        direction: serverFilters.direction || 'desc',
    });

    const [isAutoRefresh, setIsAutoRefresh] = useState(false);

    const { start, stop } = usePoll(5000, {
        only: ['events'],
        preserveScroll: true,
        preserveState: true,
    }, {
        autoStart: false,
    });

    useEffect(() => {
        if (isAutoRefresh) {
            start();
        } else {
            stop();
        }
    }, [isAutoRefresh]);

    const updateEvents = useCallback(
        debounce((updatedFilters) => {
            const query = {...updatedFilters};
            Object.keys(query).forEach(key => {
                if (query[key] === 'all' || query[key] === '' || query[key] === null) {
                    delete query[key];
                }
            });

            router.get('/events', query, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }, 300),
        []
    );

    const handleFilterChange = (key, value) => {
        const newFilters = {...filters, [key]: value};
        setFilters(newFilters);
        updateEvents(newFilters);
    };

    const handleSort = (column) => {
        const isAsc = filters.sort_by === column && filters.direction === 'asc';
        const newDirection = isAsc ? 'desc' : 'asc';
        const newFilters = {...filters, sort_by: column, direction: newDirection};
        setFilters(newFilters);
        updateEvents(newFilters);
    };

    const refreshData = () => {
        router.reload({preserveScroll: true, preserveState: true});
    };

    const resetFilters = () => {
        const defaults = {
            object_name: '',
            namespace: filters.namespace,
            object_kind: 'all',
            type: 'all',
            sort_by: 'last_seen_at',
            direction: 'desc',
        };
        setFilters(defaults);
        updateEvents(defaults);
    };

    const SortIcon = ({column}) => {
        if (filters.sort_by !== column) return null;
        return filters.direction === 'asc' ? <ArrowUpIcon/> : <ArrowDownIcon/>;
    };

    return (
        <AppLayout title="Kubernetes Events">
            <Head title="Kubernetes Events"/>

            <Flex direction="column" gap="5">

                <Flex justify="between" align="end">
                    <Box>
                        <Heading size="6" mb="1">Cluster Events</Heading>
                        <Text color="gray" size="2">
                            Monitor, filter and troubleshoot Kubernetes cluster activities.
                        </Text>
                    </Box>

                    <Flex gap="3" align="center">
                        <NamespaceSelector
                            namespaces={namespaces}
                            value={filters.namespace}
                            onChange={(val) => handleFilterChange('namespace', val)}
                        />

                        <Tooltip content="Refresh data now">
                            <IconButton variant="soft" color="gray" onClick={refreshData}>
                                <ReloadIcon />
                            </IconButton>
                        </Tooltip>

                        <Separator orientation="vertical" style={{ height: 20 }} />

                        <Flex align="center" gap="2">
                            <Checkbox
                                checked={isAutoRefresh}
                                onCheckedChange={setIsAutoRefresh}
                                id="auto-refresh"
                            />
                            <Text size="2" as="label" htmlFor="auto-refresh" style={{ cursor: 'pointer', userSelect: 'none' }}>
                                Auto refresh 5s
                            </Text>
                        </Flex>
                    </Flex>
                </Flex>

                <Flex gap="3" wrap="wrap" align="center">

                    <Box style={{width: 300}}>
                        <TextField.Root
                            placeholder="Search object name..."
                            value={filters.object_name}
                            onChange={(e) => handleFilterChange('object_name', e.target.value)}
                        >
                            <TextField.Slot>
                                <MagnifyingGlassIcon height="16" width="16"/>
                            </TextField.Slot>
                        </TextField.Root>
                    </Box>

                    <Separator orientation="vertical" style={{height: 20}}/>

                    <Select.Root
                        value={filters.object_kind}
                        onValueChange={(val) => handleFilterChange('object_kind', val)}
                    >
                        <Select.Trigger placeholder="Kind" style={{minWidth: 140}}/>
                        <Select.Content>
                            <Select.Item value="all">All Kinds</Select.Item>
                            {kinds.map((kind) => (
                                <Select.Item key={kind.value} value={kind.value}>
                                    {kind.label}
                                </Select.Item>
                            ))}
                        </Select.Content>
                    </Select.Root>

                    <Select.Root
                        value={filters.type}
                        onValueChange={(val) => handleFilterChange('type', val)}
                    >
                        <Select.Trigger placeholder="Type" style={{ minWidth: 120 }} />
                        <Select.Content>
                            <Select.Item value="all">All Types</Select.Item>
                            {types.map((type) => (
                                <Select.Item key={type.value} value={type.value}>
                                    {type.label}
                                </Select.Item>
                            ))}
                        </Select.Content>
                    </Select.Root>

                    {(filters.object_name || filters.object_kind !== 'all' || filters.type !== 'all') && (
                        <Button variant="ghost" color="gray" onClick={resetFilters}>
                            <Cross2Icon/> Clear filters
                        </Button>
                    )}
                </Flex>

                <Card variant="surface" style={{padding: 0}}>
                    <Table.Root variant="surface">
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeaderCell
                                    style={{cursor: 'pointer', width: '15%'}}
                                    onClick={() => handleSort('last_seen_at')}
                                >
                                    <Flex align="center" gap="1">
                                        Last Seen <SortIcon column="last_seen_at"/>
                                    </Flex>
                                </Table.ColumnHeaderCell>

                                <Table.ColumnHeaderCell style={{width: '10%'}}>Type</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell style={{width: '15%'}}>Reason</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell
                                    style={{ width: '20%', cursor: 'pointer' }}
                                    onClick={() => handleSort('object_kind')}
                                >
                                    <Flex align="center" gap="1">
                                        Object <SortIcon column="object_kind" />
                                    </Flex>
                                </Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Message</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell style={{width: '10%'}}>Namespace</Table.ColumnHeaderCell>

                                <Table.ColumnHeaderCell align="right" style={{width: '5%'}}>
                                    <Flex align="center" justify="end" gap="1" style={{cursor: 'pointer'}}
                                          onClick={() => handleSort('count')}>
                                        Count <SortIcon column="count"/>
                                    </Flex>
                                </Table.ColumnHeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {events.data.length === 0 ? (
                                <Table.Row>
                                    <Table.Cell colSpan={7} align="center">
                                        <Flex align="center" justify="center" p="5" direction="column" gap="2">
                                            <MagnifyingGlassIcon width="32" height="32" color="gray"/>
                                            <Text color="gray">No events found matching these filters.</Text>
                                        </Flex>
                                    </Table.Cell>
                                </Table.Row>
                            ) : (
                                events.data.map((event) => (
                                    <Table.Row key={event.id} align="center">
                                        <Table.RowHeaderCell>
                                            <Flex direction="column">
                                                <Text weight="medium" size="2">{event.last_seen_human}</Text>
                                                <Text size="1" color="gray">{event.last_seen_at}</Text>
                                            </Flex>
                                        </Table.RowHeaderCell>

                                        <Table.Cell>
                                            <Badge variant="soft" color={event.type === 'Warning' ? 'orange' : 'green'}>
                                                <Flex gap="1" align="center">
                                                    {event.type === 'Warning' ? <ExclamationTriangleIcon/> :
                                                        <InfoCircledIcon/>}
                                                    {event.type}
                                                </Flex>
                                            </Badge>
                                        </Table.Cell>

                                        <Table.Cell>
                                            <Text weight="medium" size="2">{event.reason}</Text>
                                        </Table.Cell>

                                        <Table.Cell>
                                            <Flex direction="column" gap="1">
                                                <Badge size="1" color="gray" variant="outline"
                                                       style={{width: 'fit-content'}}>
                                                    {event.object_kind}
                                                </Badge>
                                                <Text size="2" weight="medium" style={{wordBreak: 'break-all'}}>
                                                    {event.object_name}
                                                </Text>
                                            </Flex>
                                        </Table.Cell>

                                        <Table.Cell>
                                            <Tooltip content={event.message}>
                                                <Text
                                                    size="2"
                                                    style={{
                                                        maxWidth: '350px',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden'
                                                    }}
                                                >
                                                    {event.message}
                                                </Text>
                                            </Tooltip>
                                        </Table.Cell>

                                        <Table.Cell>
                                            <Badge color="blue" variant="soft">{event.namespace}</Badge>
                                        </Table.Cell>

                                        <Table.Cell align="right">
                                            <Text size="2" color="gray">x{event.count}</Text>
                                        </Table.Cell>
                                    </Table.Row>
                                ))
                            )}
                        </Table.Body>
                    </Table.Root>
                </Card>

                {events.meta && events.meta.last_page > 1 && (
                    <Flex justify="between" align="center" mt="2">
                        <Text size="2" color="gray">
                            Showing {events.meta.from} to {events.meta.to} of {events.meta.total} results
                        </Text>
                        <Flex gap="2">
                            <Button
                                style={{cursor: "pointer"}}
                                variant="soft"
                                disabled={!events.links.prev}
                                onClick={() => router.get(events.links.prev, undefined, {
                                    preserveState: true,
                                    preserveScroll: true
                                })}
                            >
                                <ChevronLeftIcon/> Previous
                            </Button>
                            <Button
                                style={{cursor: "pointer"}}
                                variant="soft"
                                disabled={!events.links.next}
                                onClick={() => router.get(events.links.next, undefined, {
                                    preserveState: true,
                                    preserveScroll: true
                                })}
                            >
                                Next <ChevronRightIcon/>
                            </Button>
                        </Flex>
                    </Flex>
                )}
            </Flex>
        </AppLayout>
    );
}
