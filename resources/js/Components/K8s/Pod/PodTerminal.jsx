import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import { Box } from '@radix-ui/themes';

export default function PodTerminal({ pod, container = '' }) {
    const terminalRef = useRef(null);
    const wsRef = useRef(null);
    const termRef = useRef(null);
    const fitAddonRef = useRef(null);

    useEffect(() => {
        if (!pod) return;

        const term = new Terminal({
            cursorBlink: true,
            fontSize: 13,
            fontFamily: 'Menlo, Monaco, "Courier New", monospace',
            theme: {
                background: '#1e1e1e',
                foreground: '#ffffff',
            },
        });

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);

        term.open(terminalRef.current);
        fitAddon.fit();

        termRef.current = term;
        fitAddonRef.current = fitAddon;

        term.write(`\x1b[33mConnecting to ${pod.name}...\x1b[0m\r\n`);

        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = 'localhost:8080';
        const url = `${protocol}//${host}/api/v1/pods/${pod.namespace}/${pod.name}/exec?container=${container}`;

        const ws = new WebSocket(url);
        wsRef.current = ws;

        ws.onopen = () => {
            term.write(`\x1b[32mConnected!\x1b[0m\r\n`);

            const dims = fitAddon.proposeDimensions();
            if (dims) {
                ws.send(JSON.stringify({
                    op: 'resize',
                    cols: dims.cols,
                    rows: dims.rows
                }));
            }
        };

        ws.onmessage = (event) => {
            if (typeof event.data === 'string') {
                term.write(event.data);
            } else {
                const reader = new FileReader();
                reader.onload = () => {
                    term.write(reader.result);
                };
                reader.readAsText(event.data);
            }
        };

        ws.onclose = (event) => {
            term.write(`\r\n\x1b[31mConnection closed (Code: ${event.code})\x1b[0m`);
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            term.write(`\r\n\x1b[31mConnection error\x1b[0m`);
        };

        term.onData((data) => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                    op: 'stdin',
                    data: data
                }));
            }
        });

        const handleResize = () => {
            if (!fitAddonRef.current || ws.readyState !== WebSocket.OPEN) return;

            fitAddonRef.current.fit();
            const dims = fitAddonRef.current.proposeDimensions();
            if (dims) {
                ws.send(JSON.stringify({
                    op: 'resize',
                    cols: dims.cols,
                    rows: dims.rows
                }));
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);

            if (wsRef.current) {
                wsRef.current.close(1000, "Component unmounted");
            }

            if (ws) ws.close();
            if (term) term.dispose();
        };

    }, [pod, container]);

    return (
        <Box
            ref={terminalRef}
            style={{
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                backgroundColor: '#1e1e1e',
                borderRadius: '6px',
                padding: '4px'
            }}
        />
    );
}
