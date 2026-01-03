import React, { useEffect, useRef, useState } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import { Box, Flex, Button, Checkbox, Text } from '@radix-ui/themes';
import { EraserIcon } from '@radix-ui/react-icons';

export default function PodLogs({ pod, container = '' }) {
    const terminalRef = useRef(null);
    const wsRef = useRef(null);
    const termRef = useRef(null);
    const fitAddonRef = useRef(null);

    const [autoScroll, setAutoScroll] = useState(true);

    useEffect(() => {
        if (!pod) return;

        const term = new Terminal({
            cursorBlink: false,
            disableStdin: true,
            fontSize: 13,
            fontFamily: 'Menlo, Monaco, "Courier New", monospace',
            theme: {
                background: '#1e1e1e',
                foreground: '#d4d4d4',
                cursor: '#1e1e1e'
            },
            convertEol: true,
        });

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);

        term.open(terminalRef.current);
        fitAddon.fit();

        termRef.current = term;
        fitAddonRef.current = fitAddon;

        term.write(`\x1b[34mFetching logs for ${pod.name}...\x1b[0m\r\n`);

        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = 'localhost:8080';
        const url = `${protocol}//${host}/api/v1/pods/${pod.namespace}/${pod.name}/logs?container=${container}`;

        const ws = new WebSocket(url);
        wsRef.current = ws;

        ws.onopen = () => {
            term.write(`\x1b[32mStream connected!\x1b[0m\r\n\r\n`);
        };

        ws.onmessage = (event) => {
            term.write(event.data);

            if (autoScroll) {
                term.scrollToBottom();
            }
        };

        ws.onclose = (event) => {
            term.write(`\r\n\x1b[31mStream closed (Code: ${event.code})\x1b[0m`);
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            term.write(`\r\n\x1b[31mConnection error\x1b[0m`);
        };

        const handleResize = () => {
            if (fitAddonRef.current) {
                fitAddonRef.current.fit();
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (wsRef.current) wsRef.current.close();
            if (term) term.dispose();
        };

    }, [pod, container]);

    useEffect(() => {
        if (autoScroll && termRef.current) {
            termRef.current.scrollToBottom();
        }
    }, [autoScroll]);

    const handleClear = () => {
        termRef.current?.clear();
    };

    return (
        <Flex direction="column" style={{ height: '100%' }}>
            <Flex
                justify="end"
                align="center"
                gap="4"
                p="2"
                style={{ backgroundColor: '#2d2d2d', borderBottom: '1px solid #444' }}
            >
                <Flex align="center" gap="2">
                    <Checkbox
                        checked={autoScroll}
                        onCheckedChange={setAutoScroll}
                        id="autoscroll-check"
                    />
                    <Text size="2" color="gray" as="label" htmlFor="autoscroll-check">
                        Auto-scroll
                    </Text>
                </Flex>

                <Button variant="soft" color="gray" size="1" onClick={handleClear}>
                    <EraserIcon /> Clear
                </Button>
            </Flex>

            <Box
                ref={terminalRef}
                style={{
                    flexGrow: 1,
                    overflow: 'hidden',
                    backgroundColor: '#1e1e1e',
                }}
            />
        </Flex>
    );
}
