import React, {useState} from 'react';
import AppLayout from '../../Layouts/AppLayout';
import {router, usePage} from '@inertiajs/react';
import {
    Table,
    Badge,
    Text,
    Heading,
    Card,
    Flex,
    Box,
    IconButton,
    Code,
    Tooltip,
    Select,
    Dialog
} from '@radix-ui/themes';
import {
    CubeIcon,
    DotsHorizontalIcon,
    ReloadIcon,
    ReaderIcon,
    TrashIcon, DesktopIcon, Cross1Icon
} from '@radix-ui/react-icons';
import RightPanel from "../../Components/RightPanel.jsx";
import PodDetails from "../../Components/K8s/Pod/PodDetails.jsx";
import PodTerminal from "../../Components/K8s/Pod/PodTerminal.jsx";
import NamespaceSelector from "../../Components/K8s/Namespace/NamespaceSelector.jsx";
import PodLogs from "../../Components/K8s/Pod/PodLogs.jsx";

const getStatusColor = (status) => {
    switch (status) {
        case 'Running':
        case 'Succeeded':
            return 'green';
        case 'Pending':
        case 'ContainerCreating':
            return 'amber';
        case 'Terminating':
            return 'orange';
        case 'Failed':
        case 'CrashLoopBackOff':
        case 'ErrImagePull':
        case 'Error':
            return 'red';
        default:
            return 'gray';
    }
};

export default function PodsIndex({ pods, namespaces }) {
    const currentNamespace = new URLSearchParams(window.location.search).get('namespace') || 'default';

    const [selectedPod, setSelectedPod] = useState(null);
    const [terminalPod, setTerminalPod] = useState(null);
    const [logsPod, setLogsPod] = useState(null);

    const handleReload = () => {
        router.reload({ only: ['pods'] });
    };

    return (
        <AppLayout title="Workloads">
            <Flex direction="column" gap="5">

                <Flex justify="between" align="end">
                    <Box>
                        <Heading size="6" mb="1">Pods</Heading>
                        <Text color="gray" size="2">
                            Manage your containerized applications and view logs.
                        </Text>
                    </Box>

                    <Flex gap="3" align="center">
                        <NamespaceSelector
                            namespaces={namespaces}
                        />
                        <IconButton variant="soft" color="gray" onClick={handleReload}>
                            <ReloadIcon />
                        </IconButton>
                    </Flex>
                </Flex>

                <Card variant="surface" style={{ padding: 0, overflow: 'hidden' }}>
                    <Table.Root variant="surface">
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Namespace</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Restarts</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>IP</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell>Controlled By</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell align="right"></Table.ColumnHeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {pods.length === 0 ? (
                                <Table.Row>
                                    <Table.Cell colSpan={7} align="center">
                                        <Text color="gray" size="2" style={{ padding: '20px' }}>
                                            No pods found in namespace "{currentNamespace}"
                                        </Text>
                                    </Table.Cell>
                                </Table.Row>
                            ) : (
                                pods.map((pod) => (
                                    <Table.Row
                                        key={pod.name}
                                        align="center"
                                        style={{ transition: 'background 0.2s' }}
                                    >
                                        <Table.RowHeaderCell>
                                            <Flex align="center" gap="3">
                                                <Box style={{ padding: '6px', backgroundColor: 'var(--accent-a3)', borderRadius: '6px' }}>
                                                    <CubeIcon color="var(--accent-9)" />
                                                </Box>
                                                <Flex direction="column">
                                                    <Text
                                                        weight="medium"
                                                        style={{
                                                            color: 'var(--accent-9)',
                                                            cursor: 'pointer',
                                                            textDecoration: 'none'
                                                        }}
                                                        onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                                                        onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                                                        onClick={() => setSelectedPod(pod)}
                                                    >
                                                        {pod.name}
                                                    </Text>
                                                </Flex>
                                            </Flex>
                                        </Table.RowHeaderCell>

                                        <Table.Cell>
                                            <Text size="2" color="gray">{pod.namespace}</Text>
                                        </Table.Cell>

                                        <Table.Cell>
                                            <Badge color={getStatusColor(pod.status)} variant="soft" radius="full">
                                                <Box
                                                    style={{
                                                        width: 6,
                                                        height: 6,
                                                        borderRadius: '50%',
                                                        backgroundColor: 'currentColor'
                                                    }}
                                                />
                                                {pod.status}
                                            </Badge>
                                        </Table.Cell>

                                        <Table.Cell>
                                            <Text size="2">{pod.restarts || 0}</Text>
                                        </Table.Cell>

                                        <Table.Cell>
                                            {pod.ip ? (
                                                <Code variant="ghost" color="gray">{pod.ip}</Code>
                                            ) : (
                                                <Text color="gray" size="1">-</Text>
                                            )}
                                        </Table.Cell>

                                        <Table.Cell>
                                            {pod.owner_name ? (
                                                <Badge variant="outline" color="gray">
                                                    {pod.owner_name}
                                                </Badge>
                                            ) : (
                                                <Text color="gray" size="1">Standalone</Text>
                                            )}
                                        </Table.Cell>

                                        <Table.Cell align="right">
                                            <Flex gap="2" justify="end">
                                                <Tooltip content="Exec / Terminal">
                                                    <IconButton
                                                        variant="ghost"
                                                        color="gray"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setTerminalPod(pod);
                                                        }}
                                                        disabled={pod.status !== 'Running'}
                                                    >
                                                        <DesktopIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip content="View Logs">
                                                    <IconButton
                                                        variant="ghost"
                                                        color="gray"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setLogsPod(pod);
                                                        }}
                                                    >
                                                        <ReaderIcon />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip content="Delete Pod">
                                                    <IconButton variant="ghost" color="red">
                                                        <TrashIcon />
                                                    </IconButton>
                                                </Tooltip>

                                                <IconButton variant="ghost" color="gray">
                                                    <DotsHorizontalIcon />
                                                </IconButton>
                                            </Flex>
                                        </Table.Cell>

                                    </Table.Row>
                                ))
                            )}
                        </Table.Body>
                    </Table.Root>
                </Card>

                <Flex justify="center" mt="2">
                    <Text size="1" color="gray">
                        Showing {pods.length} pods in {currentNamespace}
                    </Text>
                </Flex>
                <RightPanel
                    isOpen={!!selectedPod}
                    onClose={() => setSelectedPod(null)}
                >
                    <PodDetails
                        pod={selectedPod}
                        onClose={() => setSelectedPod(null)}
                    />
                </RightPanel>

                <Dialog.Root open={!!terminalPod} onOpenChange={(open) => !open && setTerminalPod(null)}>
                    <Dialog.Content style={{ maxWidth: '900px', height: '600px', padding: 0, display: 'flex', flexDirection: 'column' }}>

                        <Flex justify="between" align="center" p="3" style={{ borderBottom: '1px solid var(--gray-5)', backgroundColor: 'var(--gray-2)' }}>
                            <Flex align="center" gap="2">
                                <DesktopIcon />
                                <Text weight="bold">{terminalPod?.name}</Text>
                                <Badge variant="outline">{terminalPod?.namespace}</Badge>
                            </Flex>
                            <IconButton variant="ghost" color="gray" onClick={() => setTerminalPod(null)}>
                                <Cross1Icon />
                            </IconButton>
                        </Flex>

                        <Box style={{ flexGrow: 1, backgroundColor: '#1e1e1e', position: 'relative' }}>
                            {terminalPod && (
                                <PodTerminal
                                    pod={terminalPod}
                                    container=""
                                />
                            )}
                        </Box>

                    </Dialog.Content>
                </Dialog.Root>

                <Dialog.Root open={!!logsPod} onOpenChange={(open) => !open && setLogsPod(null)}>
                    <Dialog.Content style={{ maxWidth: '1000px', height: '70vh', padding: 0, display: 'flex', flexDirection: 'column' }}>

                        <Flex justify="between" align="center" p="3" style={{ borderBottom: '1px solid var(--gray-5)', backgroundColor: 'var(--gray-2)' }}>
                            <Flex align="center" gap="2">
                                <ReaderIcon />
                                <Text weight="bold">Logs: {logsPod?.name}</Text>
                                <Badge variant="outline">{logsPod?.namespace}</Badge>
                            </Flex>
                            <IconButton variant="ghost" color="gray" onClick={() => setLogsPod(null)}>
                                <Cross1Icon />
                            </IconButton>
                        </Flex>

                        <Box style={{ flexGrow: 1, backgroundColor: '#1e1e1e', position: 'relative' }}>
                            {logsPod && (
                                <PodLogs
                                    pod={logsPod}
                                    container=""
                                />
                            )}
                        </Box>

                    </Dialog.Content>
                </Dialog.Root>
            </Flex>
        </AppLayout>
    );
}
