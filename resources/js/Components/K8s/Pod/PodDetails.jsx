import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box, Flex, Heading, Text, Badge, IconButton,
    Grid, Separator, Tabs, Card, Code, Spinner, ChevronDownIcon, Table
} from '@radix-ui/themes';
import {
    Cross1Icon, ReaderIcon, TrashIcon,
    Pencil1Icon, DesktopIcon, DiscIcon, ActivityLogIcon, CubeIcon
} from '@radix-ui/react-icons';
import {ChevronUpIcon} from "lucide-react";

const EnvValueRenderer = ({ env }) => {
    const breakStyle = { wordBreak: 'break-all', whiteSpace: 'pre-wrap' };

    if (env.value) {
        return <Code variant="ghost" color="gray" style={breakStyle}>{env.value}</Code>;
    }
    if (env.value_from) {
        const vf = env.value_from;
        if (vf.secretKeyRef) {
            return (
                <Badge color="purple" variant="soft" style={breakStyle}>
                    Secret: {vf.secretKeyRef.name} key: {vf.secretKeyRef.key}
                </Badge>
            );
        }
        if (vf.configMapKeyRef) {
            return (
                <Badge color="blue" variant="soft" style={breakStyle}>
                    ConfigMap: {vf.configMapKeyRef.name} key: {vf.configMapKeyRef.key}
                </Badge>
            );
        }
        if (vf.fieldRef) {
            return <Badge color="gray" variant="outline">Field: {vf.fieldRef.fieldPath}</Badge>;
        }
    }
    return <Text color="gray">-</Text>;
};

const ContainerCard = ({ container, status }) => {
    const [isOpen, setIsOpen] = useState(false);

    let stateColor = 'gray';
    let stateText = 'Unknown';
    let stateDetails = null;

    if (status?.state?.running) {
        stateColor = 'green';
        stateText = 'Running';
        stateDetails = `Started: ${new Date(status.state.running.startedAt).toLocaleString()}`;
    } else if (status?.state?.waiting) {
        stateColor = 'amber';
        stateText = `Waiting (${status.state.waiting.reason})`;
        stateDetails = status.state.waiting.message;
    } else if (status?.state?.terminated) {
        stateColor = 'gray';
        stateText = `Terminated (${status.state.terminated.reason})`;
        stateDetails = `Exit: ${status.state.terminated.exitCode}`;
    }

    return (
        <Card style={{ marginBottom: '12px' }}>
            <Flex direction="column" gap="3">
                <Flex justify="between" align="center" style={{ cursor: 'pointer' }} onClick={() => setIsOpen(!isOpen)}>
                    <Flex gap="3" align="center"> {/* overflow щоб текст не вилазив */}
                        <Box style={{ position: 'relative', flexShrink: 0 }}>
                            <Box style={{ padding: 6, backgroundColor: 'var(--gray-3)', borderRadius: '50%' }}>
                                <CubeIcon />
                            </Box>
                            <Box style={{
                                position: 'absolute', bottom: -2, right: -2,
                                width: 10, height: 10, borderRadius: '50%',
                                backgroundColor: `var(--${stateColor}-9)`, border: '2px solid white'
                            }} />
                        </Box>
                        <Flex direction="column">
                            <Text weight="bold" trim="end">{container.name}</Text>
                            <Text color="gray" size="1" trim="end">{container.image.split(':')[0]}</Text>
                        </Flex>
                    </Flex>
                    <IconButton variant="ghost" color="gray" flexShrink="0">
                        {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    </IconButton>
                </Flex>

                {isOpen && (
                    <Box pt="2" style={{ borderTop: '1px solid var(--gray-4)' }}>

                        <Grid columns="2" gap="4" mb="4">
                            <Box>
                                <Text size="1" color="gray" mb="1" display="block">State</Text>
                                <Flex direction="column" gap="1">
                                    <Badge color={stateColor} style={{ width: 'fit-content' }}>{stateText}</Badge>
                                    {stateDetails && (
                                        <Text size="1" color="gray" style={{ lineHeight: '1.4' }}>
                                            {stateDetails}
                                        </Text>
                                    )}
                                </Flex>
                            </Box>

                            <Box>
                                <Text size="1" color="gray" mb="1" display="block">Restarts</Text>
                                <Text size="2" weight="bold">{status?.restartCount || 0}</Text>

                                {status?.lastState?.terminated && (
                                    <Box mt="2">
                                        <Text size="1" color="gray" mb="1" display="block">Last State</Text>
                                        <Badge color="orange" variant="soft">
                                            {status.lastState.terminated.reason} (Exit: {status.lastState.terminated.exitCode})
                                        </Badge>
                                    </Box>
                                )}
                            </Box>

                            <Box style={{ gridColumn: 'span 2' }}>
                                <Text size="1" color="gray" mb="1" display="block">Image Full Name</Text>
                                <Code variant="ghost" color="gray" style={{ wordBreak: 'break-all', fontSize: '11px', display: 'block', marginBottom: '8px' }}>
                                    {container.image}
                                </Code>

                                <Text size="1" color="gray" mb="1" display="block">Image ID</Text>
                                <Code variant="ghost" color="gray" style={{ wordBreak: 'break-all', fontSize: '11px', display: 'block' }}>
                                    {status?.imageID || '-'}
                                </Code>
                            </Box>
                        </Grid>

                        {container.env && container.env.length > 0 && (
                            <Box mb="2">
                                <Text size="2" weight="bold" mb="2">Environment Variables</Text>
                                <Table.Root variant="surface" layout="fixed"> {/* layout fixed важливий для довгих таблиць */}
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.ColumnHeaderCell width="40%">Name</Table.ColumnHeaderCell>
                                            <Table.ColumnHeaderCell width="60%">Value</Table.ColumnHeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {container.env.map((e, idx) => (
                                            <Table.Row key={idx}>
                                                <Table.Cell style={{ verticalAlign: 'top' }}>
                                                    <Code variant="ghost" style={{ wordBreak: 'break-all', whiteSpace: 'pre-wrap' }}>
                                                        {e.name}
                                                    </Code>
                                                </Table.Cell>
                                                <Table.Cell style={{ verticalAlign: 'top' }}>
                                                    <EnvValueRenderer env={e} />
                                                </Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table.Root>
                            </Box>
                        )}

                        {container.volume_mounts && container.volume_mounts.length > 0 && (
                            <Box mt="4">
                                <Text size="2" weight="bold" mb="2">Mounts</Text>
                                <Flex gap="2" wrap="wrap">
                                    {container.volume_mounts.map((m, i) => (
                                        <Badge key={i} color="gray" variant="outline" style={{ wordBreak: 'break-all', whiteSpace: 'normal', textAlign: 'left' }}>
                                            {m.mount_path} {m.read_only && '(RO)'}
                                        </Badge>
                                    ))}
                                </Flex>
                            </Box>
                        )}
                    </Box>
                )}
            </Flex>
        </Card>
    );
};
const VolumeCard = ({ vol }) => {
    return (
        <Card>
            <Flex gap="3" align="start">
                <DiscIcon width="20" height="20" color="var(--gray-10)" />
                <Box style={{ width: '100%' }}>
                    <Flex justify="between">
                        <Text weight="bold" size="2">{vol.name}</Text>
                        <Flex gap="2">
                            {vol.configMap && <Badge color="blue">ConfigMap</Badge>}
                            {vol.secret && <Badge color="purple">Secret</Badge>}
                            {vol.persistentVolumeClaim && <Badge color="orange">PVC</Badge>}
                            {vol.emptyDir && <Badge color="gray">EmptyDir</Badge>}
                            {vol.hostPath && <Badge color="red">HostPath</Badge>}
                            {vol.projected && <Badge color="cyan">Projected</Badge>}
                        </Flex>
                    </Flex>

                    {vol.projected && (
                        <Box mt="2" p="2" style={{ background: 'var(--gray-2)', borderRadius: '6px' }}>
                            <Text size="1" weight="medium" color="gray" mb="1">Sources:</Text>
                            <Flex direction="column" gap="1">
                                {vol.projected.sources?.map((source, idx) => (
                                    <Flex key={idx} gap="2" align="center">
                                        <Box style={{width: 4, height: 4, borderRadius: '50%', background: 'gray'}} />
                                        {source.serviceAccountToken && (
                                            <Text size="1">ServiceAccountToken (path: {source.serviceAccountToken.path})</Text>
                                        )}
                                        {source.configMap && (
                                            <Text size="1">ConfigMap: {source.configMap.name}</Text>
                                        )}
                                        {source.downwardAPI && (
                                            <Text size="1">DownwardAPI</Text>
                                        )}
                                    </Flex>
                                ))}
                            </Flex>
                        </Box>
                    )}

                    {vol.hostPath && (
                        <Text size="1" color="gray" mt="1">Path: {vol.hostPath.path}</Text>
                    )}

                    {vol.configMap && (
                        <Text size="1" color="gray" mt="1">Name: {vol.configMap.name}</Text>
                    )}
                </Box>
            </Flex>
        </Card>
    );
};

export default function PodDetails({ pod: summaryPod, onClose }) {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (summaryPod) {
            setLoading(true);
            setDetails(null);

            axios.get(`/pods/${summaryPod.namespace}/${summaryPod.name}`)
                .then(response => {
                    setDetails(response.data);
                })
                .catch(error => {
                    console.error("Failed to fetch pod details:", error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [summaryPod]);

    if (!summaryPod) return null;

    const pod = details || summaryPod;

    return (
        <Flex direction="column" style={{ height: '100%' }}>
            <Box style={{ backgroundColor: 'var(--accent-9)', padding: '16px', color: 'white', flexShrink: 0 }}>
                <Flex justify="between" align="start">
                    <Flex direction="column" gap="1">
                        <Heading size="4" style={{ color: 'white' }}>{pod.name}</Heading>
                        <Text size="2" style={{ opacity: 0.8, color: 'white' }}>{pod.namespace}</Text>
                    </Flex>
                    <IconButton variant="ghost" onClick={onClose} style={{ color: 'white' }}>
                        <Cross1Icon width="20" height="20" />
                    </IconButton>
                </Flex>

                <Flex gap="3" mt="4">
                    <IconButton variant="surface" highContrast color="gray"><ReaderIcon /></IconButton>
                    <IconButton variant="surface" highContrast color="gray"><DesktopIcon /></IconButton>
                    <IconButton variant="surface" highContrast color="gray"><Pencil1Icon /></IconButton>
                    <IconButton variant="surface" highContrast color="red"><TrashIcon /></IconButton>
                </Flex>
            </Box>

            <Box style={{ flexGrow: 1, overflowY: 'auto', position: 'relative' }}>

                {loading && (
                    <Flex align="center" justify="center" style={{ height: '200px', width: '100%', position: 'absolute', zIndex: 10, background: 'rgba(255,255,255,0.8)' }}>
                        <Flex gap="2" align="center">
                            <Spinner />
                            <Text color="gray">Loading details...</Text>
                        </Flex>
                    </Flex>
                )}

                {/* Tabs */}
                {details && (
                    <Tabs.Root defaultValue="info">
                        <Box px="4" pt="3" style={{ borderBottom: '1px solid var(--gray-5)' }}>
                            <Tabs.List>
                                <Tabs.Trigger value="info">Info</Tabs.Trigger>
                                <Tabs.Trigger value="cpu">CPU</Tabs.Trigger>
                                <Tabs.Trigger value="memory">Memory</Tabs.Trigger>
                                <Tabs.Trigger value="network">Network</Tabs.Trigger>
                                <Tabs.Trigger value="fs">Filesystem</Tabs.Trigger>
                            </Tabs.List>
                        </Box>

                        <Tabs.Content value="info">
                            <Box p="4">
                                <Grid columns="140px 1fr" gapY="3" align="center">
                                    <Text size="2" color="gray">Status</Text>
                                    <Badge color={pod.status === 'Running' ? 'green' : 'red'}>{pod.status}</Badge>

                                    <Text size="2" color="gray">Node</Text>
                                    <Text size="2" style={{ color: 'var(--accent-9)', cursor: 'pointer' }}>
                                        {pod.node || '-'}
                                    </Text>

                                    <Text size="2" color="gray">IP</Text>
                                    <Text size="2">{pod.ip || '-'}</Text>

                                    <Text size="2" color="gray">Created</Text>
                                    <Text size="2">
                                        {pod.created ? new Date(pod.created).toLocaleString() : '-'}
                                    </Text>

                                    <Text size="2" color="gray">UID</Text>
                                    <Code variant="ghost" color="gray" style={{ fontSize: '11px' }}>
                                        {pod.uid || '-'}
                                    </Code>

                                    <Text size="2" color="gray">Controlled By</Text>
                                    <Text size="2">{pod.owner_name || 'Standalone'}</Text>

                                    <Text size="2" color="gray">Labels</Text>
                                    <Flex gap="1" wrap="wrap">
                                        {pod.labels && Object.keys(pod.labels).length > 0 ? (
                                            Object.entries(pod.labels).map(([k, v]) => (
                                                <Badge key={k} variant="outline" color="gray">
                                                    {k}={v}
                                                </Badge>
                                            ))
                                        ) : (
                                            <Text size="2">-</Text>
                                        )}
                                    </Flex>
                                </Grid>

                                <Separator my="4" size="4" />

                                <Heading size="3" mb="3">Containers</Heading>
                                <Flex direction="column" gap="2">
                                    {pod.containers?.map((container) => {
                                        const status = pod.container_statuses?.find(s => s.name === container.name);
                                        return (
                                            <ContainerCard
                                                key={container.name}
                                                container={container}
                                                status={status}
                                            />
                                        );
                                    })}
                                </Flex>
                            </Box>
                        </Tabs.Content>

                        {/* === CPU TAB === */}
                        <Tabs.Content value="cpu">
                            <Box p="4">
                                <Card style={{ marginBottom: '16px', backgroundColor: 'var(--gray-2)' }}>
                                    <Flex justify="center" align="center" style={{ height: '80px' }}>
                                        <Flex align="center" gap="2">
                                            <ActivityLogIcon />
                                            <Text size="2" color="gray">Live metrics not available</Text>
                                        </Flex>
                                    </Flex>
                                </Card>

                                <Heading size="3" mb="3">Configuration</Heading>
                                <Flex direction="column" gap="3">
                                    {pod.containers?.map(c => (
                                        <Card key={c.name}>
                                            <Flex gap="2" align="center" mb="2">
                                                <CubeIcon />
                                                <Text weight="bold">{c.name}</Text>
                                            </Flex>
                                            <Grid columns="2" gap="3">
                                                <Box>
                                                    <Text size="1" color="gray">Requests</Text>
                                                    <Text size="3" weight="bold">{c.resources?.requests?.cpu || '0'}</Text>
                                                </Box>
                                                <Box>
                                                    <Text size="1" color="gray">Limits</Text>
                                                    <Text size="3" weight="bold">{c.resources?.limits?.cpu || '∞'}</Text>
                                                </Box>
                                            </Grid>
                                        </Card>
                                    ))}
                                </Flex>
                            </Box>
                        </Tabs.Content>

                        <Tabs.Content value="memory">
                            <Box p="4">
                                <Card style={{ marginBottom: '16px', backgroundColor: 'var(--gray-2)' }}>
                                    <Flex justify="center" align="center" style={{ height: '80px' }}>
                                        <Flex align="center" gap="2">
                                            <ActivityLogIcon />
                                            <Text size="2" color="gray">Live metrics not available</Text>
                                        </Flex>
                                    </Flex>
                                </Card>

                                <Heading size="3" mb="3">Configuration</Heading>
                                <Flex direction="column" gap="3">
                                    {pod.containers?.map(c => (
                                        <Card key={c.name}>
                                            <Flex gap="2" align="center" mb="2">
                                                <CubeIcon />
                                                <Text weight="bold">{c.name}</Text>
                                            </Flex>
                                            <Grid columns="2" gap="3">
                                                <Box>
                                                    <Text size="1" color="gray">Requests</Text>
                                                    <Text size="3" weight="bold">{c.resources?.requests?.memory || '0'}</Text>
                                                </Box>
                                                <Box>
                                                    <Text size="1" color="gray">Limits</Text>
                                                    <Text size="3" weight="bold">{c.resources?.limits?.memory || '∞'}</Text>
                                                </Box>
                                            </Grid>
                                        </Card>
                                    ))}
                                </Flex>
                            </Box>
                        </Tabs.Content>

                        <Tabs.Content value="network">
                            <Box p="4">
                                <Heading size="3" mb="3">IP Addresses</Heading>
                                {pod.pod_ips?.length > 0 ? (
                                    <Flex direction="column" gap="2">
                                        {pod.pod_ips.map((ipObj, idx) => (
                                            <Card key={idx}>
                                                <Flex justify="between" align="center">
                                                    <Text weight="bold">IP</Text>
                                                    <Code size="3">{ipObj.ip}</Code>
                                                </Flex>
                                            </Card>
                                        ))}
                                    </Flex>
                                ) : (
                                    <Text color="gray">No IP addresses assigned yet.</Text>
                                )}
                            </Box>
                        </Tabs.Content>

                        <Tabs.Content value="fs">
                            <Box p="4">
                                <Heading size="3" mb="3">Volumes</Heading>
                                {pod.volumes?.length > 0 ? (
                                    <Flex direction="column" gap="3">
                                        {pod.volumes.map((vol, i) => (
                                            <VolumeCard key={i} vol={vol} />
                                        ))}
                                    </Flex>
                                ) : (
                                    <Text color="gray">No volumes mounted.</Text>
                                )}
                            </Box>
                        </Tabs.Content>

                    </Tabs.Root>
                )}
            </Box>
        </Flex>
    );
}
