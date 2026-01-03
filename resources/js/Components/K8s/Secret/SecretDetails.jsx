import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box, Flex, Heading, Text, Badge, IconButton,
    Tabs, Card, Code, Spinner, ScrollArea, DataList, Button, TextField,
    Tooltip,
} from '@radix-ui/themes';
import {
    Cross1Icon,
    LockClosedIcon,
    CopyIcon,
    EyeOpenIcon,
    EyeNoneIcon,
    CubeIcon
} from '@radix-ui/react-icons';
import Editor from '@monaco-editor/react';
import yaml from 'js-yaml';

export default function SecretDetails({ secret: summarySec, onClose }) {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [yamlString, setYamlString] = useState('');

    const [visibleKeys, setVisibleKeys] = useState({});

    useEffect(() => {
        if (summarySec) {
            setLoading(true);
            setVisibleKeys({}); // Сбрасываем видимость при смене секрета
            axios.get(`/secrets/${summarySec.namespace}/${summarySec.name}`)
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
                    console.error("Error fetching details:", error);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setDetails(null);
        }
    }, [summarySec]);

    if (!summarySec) return null;

    const sec = details || summarySec;

    const handleCopyYaml = () => {
        navigator.clipboard.writeText(yamlString);
        alert("YAML copied to clipboard!");
    };

    // Функция для безопасного декодирования base64
    const safeDecode = (base64Str) => {
        try {
            return atob(base64Str);
        } catch (e) {
            return "[Binary or Invalid Data]";
        }
    };

    const toggleKeyVisibility = (key) => {
        setVisibleKeys(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    return (
        <Flex direction="column" style={{ height: '100%' }}>
            {/* HEADER */}
            <Box style={{ backgroundColor: 'var(--gray-3)', padding: '16px', borderBottom: '1px solid var(--gray-5)' }}>
                <Flex justify="between" align="start">
                    <Flex gap="3" align="center">
                        <Box style={{
                            padding: '8px',
                            backgroundColor: 'var(--amber-9)', // Янтарный для секретов
                            borderRadius: '6px',
                            color: 'white'
                        }}>
                            <LockClosedIcon width="20" height="20" />
                        </Box>
                        <Flex direction="column">
                            <Heading size="4">{summarySec.name}</Heading>
                            <Flex gap="2" align="center">
                                <Text size="2" color="gray">Namespace:</Text>
                                <Badge variant="outline" color="gray">{summarySec.namespace}</Badge>
                                <Badge color="gray" variant="solid" size="1">{sec.type}</Badge>
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

                <Tabs.Root defaultValue="data" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box px="4" pt="3" style={{ flexShrink: 0 }}>
                        <Tabs.List>
                            <Tabs.Trigger value="data">Data</Tabs.Trigger>
                            <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
                            <Tabs.Trigger value="yaml">YAML</Tabs.Trigger>
                        </Tabs.List>
                    </Box>

                    <Box style={{ flexGrow: 1, overflow: 'hidden' }}>

                        {/* 1. DATA TAB */}
                        <Tabs.Content value="data" style={{ height: '100%' }}>
                            <ScrollArea type="hover" scrollbars="vertical" style={{ height: '100%' }}>
                                <Box p="4">
                                    <Flex direction="column" gap="3">

                                        {/* K8s API возвращает байты как Base64 в поле data */}
                                        {sec.data && Object.keys(sec.data).length > 0 ? (
                                            Object.entries(sec.data).map(([key, base64Value]) => {
                                                const isVisible = visibleKeys[key];
                                                const decodedValue = isVisible ? safeDecode(base64Value) : '••••••••••••';

                                                return (
                                                    <Card key={key}>
                                                        <Flex direction="column" gap="2">
                                                            <Flex justify="between" align="center">
                                                                <Text weight="bold" size="2" color="gray">{key}</Text>
                                                                <Flex gap="2">
                                                                    <Tooltip content={isVisible ? "Hide value" : "Reveal value"}>
                                                                        <IconButton
                                                                            size="1"
                                                                            variant="ghost"
                                                                            color="gray"
                                                                            onClick={() => toggleKeyVisibility(key)}
                                                                        >
                                                                            {isVisible ? <EyeNoneIcon /> : <EyeOpenIcon />}
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                    <Tooltip content="Copy decoded value">
                                                                        <IconButton
                                                                            size="1"
                                                                            variant="ghost"
                                                                            color="gray"
                                                                            onClick={() => {
                                                                                navigator.clipboard.writeText(safeDecode(base64Value));
                                                                            }}
                                                                        >
                                                                            <CopyIcon />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                </Flex>
                                                            </Flex>

                                                            {/* VALUE DISPLAY */}
                                                            <Box style={{
                                                                backgroundColor: 'var(--gray-3)',
                                                                padding: '8px 12px',
                                                                borderRadius: '4px',
                                                                fontFamily: 'monospace',
                                                                fontSize: '13px',
                                                                wordBreak: 'break-all',
                                                                minHeight: '36px',
                                                                display: 'flex',
                                                                alignItems: 'center'
                                                            }}>
                                                                {isVisible ? (
                                                                    // Если это многострочный текст (например, SSH ключ), сохраняем форматирование
                                                                    <Text style={{ whiteSpace: 'pre-wrap' }}>{decodedValue}</Text>
                                                                ) : (
                                                                    <Text color="gray" style={{ letterSpacing: 2 }}>{decodedValue}</Text>
                                                                )}
                                                            </Box>
                                                        </Flex>
                                                    </Card>
                                                );
                                            })
                                        ) : (
                                            <Text color="gray">No data entries found.</Text>
                                        )}
                                    </Flex>
                                </Box>
                            </ScrollArea>
                        </Tabs.Content>

                        {/* 2. OVERVIEW TAB */}
                        <Tabs.Content value="overview" style={{ height: '100%' }}>
                            <ScrollArea type="hover" scrollbars="vertical" style={{ height: '100%' }}>
                                <Box p="4">
                                    <Flex direction="column" gap="4">
                                        <Card>
                                            <DataList.Root>
                                                <DataList.Item>
                                                    <DataList.Label>UID</DataList.Label>
                                                    <DataList.Value><Code variant="ghost">{sec.uid || '-'}</Code></DataList.Value>
                                                </DataList.Item>
                                                <DataList.Item>
                                                    <DataList.Label>Type</DataList.Label>
                                                    <DataList.Value>
                                                        <Code color="amber">{sec.type}</Code>
                                                    </DataList.Value>
                                                </DataList.Item>
                                                <DataList.Item>
                                                    <DataList.Label>Created</DataList.Label>
                                                    <DataList.Value>{new Date(sec.age).toLocaleString()}</DataList.Value>
                                                </DataList.Item>
                                                <DataList.Item>
                                                    <DataList.Label>Immutable</DataList.Label>
                                                    <DataList.Value>
                                                        {sec.immutable ? <Badge color="red">Yes</Badge> : <Badge color="gray">No</Badge>}
                                                    </DataList.Value>
                                                </DataList.Item>
                                            </DataList.Root>
                                        </Card>

                                        {/* Labels */}
                                        <Flex direction="column" gap="2">
                                            <Heading size="3">Labels</Heading>
                                            <Flex gap="2" wrap="wrap">
                                                {sec.labels && Object.keys(sec.labels).length > 0 ? (
                                                    Object.entries(sec.labels).map(([k, v]) => (
                                                        <Badge key={k} color="blue" variant="soft">
                                                            {k}={v}
                                                        </Badge>
                                                    ))
                                                ) : <Text color="gray">-</Text>}
                                            </Flex>
                                        </Flex>

                                        {/* Annotations */}
                                        <Flex direction="column" gap="2">
                                            <Heading size="3">Annotations</Heading>
                                            {sec.annotations && Object.keys(sec.annotations).length > 0 ? (
                                                <Flex direction="column" gap="1">
                                                    {Object.entries(sec.annotations).map(([k, v]) => (
                                                        <Card key={k} style={{ padding: '8px' }}>
                                                            <Text size="1" weight="bold" color="gray" style={{ display: 'block', marginBottom: 2 }}>{k}</Text>
                                                            <Code size="1" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{v}</Code>
                                                        </Card>
                                                    ))}
                                                </Flex>
                                            ) : <Text color="gray">-</Text>}
                                        </Flex>
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
