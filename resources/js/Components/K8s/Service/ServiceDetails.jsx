import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box, Flex, Heading, Text, Badge, IconButton,
    Grid, Separator, Tabs, Card, Code, Spinner, ScrollArea, DataList, Button, Tooltip
} from '@radix-ui/themes';
import {
    Cross1Icon,
    GlobeIcon,
    CopyIcon,
    ExternalLinkIcon,
    TargetIcon,
    Link2Icon
} from '@radix-ui/react-icons';
import Editor from '@monaco-editor/react';
import yaml from 'js-yaml';

export default function ServiceDetails({ service: summarySvc, onClose }) {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [yamlString, setYamlString] = useState('');

    useEffect(() => {
        if (summarySvc) {
            setLoading(true);
            axios.get(`/services/${summarySvc.namespace}/${summarySvc.name}`)
                .then(response => {
                    setDetails(response.data);
                    try {
                        const dump = yaml.dump(response.data);
                        setYamlString(dump);
                    } catch (e) {
                        setYamlString("# Error parsing YAML");
                    }
                })
                .catch(error => {
                    console.error("Error fetching service details:", error);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setDetails(null);
        }
    }, [summarySvc]);

    if (!summarySvc) return null;

    const svc = details || summarySvc;

    const handleCopyYaml = () => {
        navigator.clipboard.writeText(yamlString);
        alert("YAML copied to clipboard!");
    };

    return (
        <Flex direction="column" style={{ height: '100%' }}>
            <Box style={{ backgroundColor: 'var(--gray-3)', padding: '16px', borderBottom: '1px solid var(--gray-5)' }}>
                <Flex justify="between" align="start">
                    <Flex gap="3" align="center">
                        <Box style={{
                            padding: '8px',
                            backgroundColor: 'var(--purple-9)',
                            borderRadius: '6px',
                            color: 'white'
                        }}>
                            <GlobeIcon width="20" height="20" />
                        </Box>
                        <Flex direction="column">
                            <Heading size="4">{summarySvc.name}</Heading>
                            <Flex gap="2" align="center">
                                <Text size="2" color="gray">Namespace:</Text>
                                <Badge variant="outline" color="gray">{summarySvc.namespace}</Badge>
                            </Flex>
                        </Flex>
                    </Flex>
                    <IconButton variant="ghost" color="gray" onClick={onClose}>
                        <Cross1Icon width="20" height="20" />
                    </IconButton>
                </Flex>
            </Box>

            {/* CONTENT */}
            <Box style={{ flexGrow: 1, overflow: 'hidden', position: 'relative' }}>
                {loading && (
                    <Flex
                        align="center"
                        justify="center"
                        style={{
                            position: 'absolute', inset: 0,
                            backgroundColor: 'rgba(255,255,255,0.6)',
                            zIndex: 10
                        }}
                    >
                        <Spinner size="3" />
                    </Flex>
                )}

                <Tabs.Root defaultValue="overview" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box px="4" pt="3" style={{ flexShrink: 0 }}>
                        <Tabs.List>
                            <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
                            <Tabs.Trigger value="ports">Ports</Tabs.Trigger>
                            <Tabs.Trigger value="yaml">YAML</Tabs.Trigger>
                        </Tabs.List>
                    </Box>

                    <Box style={{ flexGrow: 1, overflow: 'hidden' }}>

                        {/* 1. OVERVIEW TAB */}
                        <Tabs.Content value="overview" style={{ height: '100%' }}>
                            <ScrollArea type="hover" scrollbars="vertical" style={{ height: '100%' }}>
                                <Box p="4">
                                    <Flex direction="column" gap="4">

                                        {/* Basic Info Cards */}
                                        <Grid columns="2" gap="3">
                                            <Card>
                                                <DataList.Root>
                                                    <DataList.Item>
                                                        <DataList.Label>Type</DataList.Label>
                                                        <DataList.Value>
                                                            <Badge color="blue" variant="soft">{svc.type}</Badge>
                                                        </DataList.Value>
                                                    </DataList.Item>
                                                    <DataList.Item>
                                                        <DataList.Label>Cluster IP</DataList.Label>
                                                        <DataList.Value>
                                                            <Code>{svc.cluster_ip}</Code>
                                                        </DataList.Value>
                                                    </DataList.Item>
                                                    <DataList.Item>
                                                        <DataList.Label>Session Affinity</DataList.Label>
                                                        <DataList.Value>{svc.session_affinity || 'None'}</DataList.Value>
                                                    </DataList.Item>
                                                </DataList.Root>
                                            </Card>

                                            <Card>
                                                <Flex direction="column" gap="2">
                                                    <Text size="2" weight="bold">External Access</Text>
                                                    {svc.external_ips && svc.external_ips.length > 0 ? (
                                                        svc.external_ips.map((ip, idx) => (
                                                            <Flex key={idx} align="center" gap="2">
                                                                <ExternalLinkIcon />
                                                                <Text size="2">{ip}</Text>
                                                            </Flex>
                                                        ))
                                                    ) : (
                                                        <Text size="2" color="gray">No external IPs assigned.</Text>
                                                    )}
                                                </Flex>
                                            </Card>
                                        </Grid>

                                        <Separator size="4" />

                                        {/* Selectors */}
                                        <Heading size="3">Selectors</Heading>
                                        <Text size="2" color="gray" mb="2">
                                            This service routes traffic to pods with these labels:
                                        </Text>
                                        <Card>
                                            <Flex gap="2" wrap="wrap">
                                                {svc.selector && Object.keys(svc.selector).length > 0 ? (
                                                    Object.entries(svc.selector).map(([k, v]) => (
                                                        <Badge key={k} color="orange" variant="soft" style={{ padding: '6px' }}>
                                                            <TargetIcon style={{ marginRight: 4 }} />
                                                            {k}={v}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <Flex align="center" gap="2">
                                                        <ExclamationTriangleIcon color="orange" />
                                                        <Text color="gray">No selectors defined (Headless Service?)</Text>
                                                    </Flex>
                                                )}
                                            </Flex>
                                        </Card>
                                    </Flex>
                                </Box>
                            </ScrollArea>
                        </Tabs.Content>

                        <Tabs.Content value="ports" style={{ height: '100%' }}>
                            <ScrollArea type="hover" scrollbars="vertical" style={{ height: '100%' }}>
                                <Box p="4">
                                    <Heading size="3" mb="3">Port Mappings</Heading>
                                    <Flex direction="column" gap="3">
                                        {svc.full_ports && svc.full_ports.length > 0 ? (
                                            svc.full_ports.map((port, i) => (
                                                <Card key={i}>
                                                    <Flex align="center" justify="between">

                                                        {/* Left: Port Name & Protocol */}
                                                        <Flex align="center" gap="3">
                                                            <Box style={{ padding: 8, background: 'var(--gray-4)', borderRadius: '50%' }}>
                                                                <Link2Icon />
                                                            </Box>
                                                            <Flex direction="column">
                                                                <Text weight="bold">{port.name || 'default'}</Text>
                                                                <Badge size="1" color="gray">{port.protocol}</Badge>
                                                            </Flex>
                                                        </Flex>

                                                        {/* Middle: Mapping Visualization */}
                                                        <Flex align="center" gap="4">
                                                            <Flex direction="column" align="center">
                                                                <Text size="1" color="gray">Service Port</Text>
                                                                <Code size="3" weight="bold" color="blue">{port.port}</Code>
                                                            </Flex>

                                                            <Text color="gray">→</Text>

                                                            <Flex direction="column" align="center">
                                                                <Text size="1" color="gray">Target Port</Text>
                                                                <Code size="3" weight="bold" color="green">
                                                                    {port.targetPort}
                                                                </Code>
                                                            </Flex>

                                                            {port.nodePort && (
                                                                <>
                                                                    <Text color="gray">→</Text>
                                                                    <Flex direction="column" align="center">
                                                                        <Text size="1" color="gray">Node Port</Text>
                                                                        <Code size="3" weight="bold" color="orange">
                                                                            {port.nodePort}
                                                                        </Code>
                                                                    </Flex>
                                                                </>
                                                            )}
                                                        </Flex>

                                                    </Flex>
                                                </Card>
                                            ))
                                        ) : (
                                            <Text color="gray">No ports configured.</Text>
                                        )}
                                    </Flex>
                                </Box>
                            </ScrollArea>
                        </Tabs.Content>

                        {/* 3. YAML TAB */}
                        <Tabs.Content value="yaml" style={{ height: '100%', position: 'relative' }}>
                            <Box style={{ position: 'absolute', top: 10, right: 25, zIndex: 5 }}>
                                <Button size="1" variant="soft" onClick={handleCopyYaml}>
                                    <CopyIcon /> Copy
                                </Button>
                            </Box>
                            <Editor
                                height="100%"
                                defaultLanguage="yaml"
                                value={yamlString}
                                theme="vs-dark"
                                options={{
                                    readOnly: true,
                                    minimap: { enabled: false },
                                    fontSize: 12,
                                    scrollBeyondLastLine: false,
                                    lineNumbers: 'on',
                                }}
                            />
                        </Tabs.Content>

                    </Box>
                </Tabs.Root>
            </Box>
        </Flex>
    );
}

// Вспомогательная иконка, если не импортирована
function ExclamationTriangleIcon({ color = 'currentColor' }) {
    return (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.63636 1.5C6.82529 1.13926 7.34138 1.13926 7.5303 1.5L13.8453 13.5C14.0416 13.8748 13.7695 14.3333 13.3467 14.3333H0.819934C0.397148 14.3333 0.125081 13.8748 0.321338 13.5L6.63636 1.5ZM7.08333 11.8333C7.08333 12.0634 7.26988 12.25 7.5 12.25C7.73012 12.25 7.91667 12.0634 7.91667 11.8333C7.91667 11.6032 7.73012 11.4167 7.5 11.4167C7.26988 11.4167 7.08333 11.6032 7.08333 11.8333ZM7.91667 5.58333C7.91667 5.35322 7.73012 5.16667 7.5 5.16667C7.26988 5.16667 7.08333 5.35322 7.08333 5.58333V9.75C7.08333 9.98011 7.26988 10.1667 7.5 10.1667C7.73012 10.1667 7.91667 9.98011 7.91667 9.75V5.58333Z" fill={color} fillRule="evenodd" clipRule="evenodd" />
        </svg>
    );
}
