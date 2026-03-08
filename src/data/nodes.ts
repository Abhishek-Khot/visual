import type { Node } from '@xyflow/react';
import type { NodeData, SceneName } from '../types';

type FlowNode = Node<NodeData>;

/* ─── Problem Scene Nodes ─── */
const problemNodes: FlowNode[] = [
    { id: 'alex', type: 'userNode', position: { x: 400, y: 300 }, data: { label: 'Alex', tag: 'Developer', icon: 'user', color: '#e2e8f0' } },
    { id: 'jira-silo', type: 'dataSourceNode', position: { x: 80, y: 80 }, data: { label: 'Jira', tag: 'Disconnected', icon: 'clipboard', color: '#c084fc', subType: 'jira' } },
    { id: 'fs-silo', type: 'dataSourceNode', position: { x: 720, y: 80 }, data: { label: 'File System', tag: 'Disconnected', icon: 'folder', color: '#94a3b8', subType: 'filesystem' } },
    { id: 'minio-silo', type: 'dataSourceNode', position: { x: 80, y: 520 }, data: { label: 'MinIO Blob', tag: 'Disconnected', icon: 'image', color: '#fb923c', subType: 'minio' } },
    { id: 'mysql-silo', type: 'dataSourceNode', position: { x: 720, y: 520 }, data: { label: 'MySQL', tag: 'Disconnected', icon: 'database', color: '#60a5fa', subType: 'mysql' } },
    { id: 'mongo-silo', type: 'dataSourceNode', position: { x: 80, y: 300 }, data: { label: 'MongoDB', tag: 'Disconnected', icon: 'database', color: '#4ade80', subType: 'mongo' } },
    { id: 'web-silo', type: 'dataSourceNode', position: { x: 720, y: 300 }, data: { label: 'Web Search', tag: 'Disconnected', icon: 'globe', color: '#fde047', subType: 'web' } },
];

/* ─── Config Scene Nodes ─── */
const configNodes: FlowNode[] = [
    { id: 'cfg-terminal', type: 'configNode', position: { x: 400, y: 50 }, data: { label: 'Terminal', tag: 'pip install', icon: 'terminal', color: '#f9a8d4' } },
    { id: 'cfg-gateway', type: 'configNode', position: { x: 200, y: 250 }, data: { label: 'gateway.yaml', tag: 'Config', icon: 'file-json', color: '#f9a8d4' } },
    { id: 'cfg-security', type: 'securityNode', position: { x: 600, y: 250 }, data: { label: 'Security Config', tag: 'Allowlists', icon: 'shield', color: '#f87171' } },
    { id: 'cfg-sources', type: 'configNode', position: { x: 400, y: 450 }, data: { label: '6 Data Sources', tag: 'Configured', icon: 'layers', color: '#f9a8d4' } },
];

/* ─── Boot Scene Nodes ─── */
const bootNodes: FlowNode[] = [
    { id: 'loader', type: 'configNode', position: { x: 100, y: 50 }, data: { label: 'Config Loader', tag: 'load_config.py', icon: 'file-json', color: '#f9a8d4' } },
    { id: 'validator', type: 'configNode', position: { x: 350, y: 50 }, data: { label: 'Pydantic Models', tag: 'Validation', icon: 'check-circle', color: '#f9a8d4' } },
    { id: 'security-init', type: 'securityNode', position: { x: 600, y: 50 }, data: { label: 'Security Layer', tag: 'Allowlists', icon: 'shield', color: '#f87171' } },
    { id: 'tool-registry', type: 'gatewayNode', position: { x: 100, y: 250 }, data: { label: 'Tool Registry', tag: '6 Tools', icon: 'wrench', color: '#22d3ee' } },
    { id: 'skill-registry', type: 'skillNode', position: { x: 350, y: 250 }, data: { label: 'Skill Registry', tag: '9 Skills', icon: 'cpu', color: '#5eead4' } },
    { id: 'subagent-factory', type: 'subagentNode', position: { x: 600, y: 250 }, data: { label: 'SubAgent Factory', tag: 'Dynamic', icon: 'boxes', color: '#5eead4' } },
    { id: 'gateway-ready', type: 'gatewayNode', position: { x: 350, y: 450 }, data: { label: 'ASGP Gateway', tag: 'Ready ✓', icon: 'zap', color: '#22d3ee' } },
];

/* ─── Flow Scene Nodes ─── */
const flowNodes: FlowNode[] = [
    { id: 'alex-q', type: 'userNode', position: { x: 50, y: 250 }, data: { label: 'Alex', tag: 'Query', icon: 'user', color: '#e2e8f0' } },
    { id: 'gateway', type: 'gatewayNode', position: { x: 250, y: 250 }, data: { label: 'ASGP Gateway', tag: 'Orchestrator', icon: 'zap', color: '#22d3ee' } },
    { id: 'tokenizer', type: 'optimizerNode', position: { x: 250, y: 80 }, data: { label: 'tiktoken', tag: 'Tokenizer', icon: 'hash', color: '#fcd34d' } },
    { id: 'thinking', type: 'gatewayNode', position: { x: 250, y: 420 }, data: { label: 'ThinkingEngine', tag: 'Planner', icon: 'brain', color: '#22d3ee' } },
    { id: 'reflection', type: 'gatewayNode', position: { x: 450, y: 420 }, data: { label: 'ReflectionEngine', tag: 'Reviewer', icon: 'eye', color: '#22d3ee' } },
    { id: 'conn-mgr', type: 'sessionNode', position: { x: 450, y: 250 }, data: { label: 'ConnectionMgr', tag: 'Session', icon: 'link', color: '#22d3ee' } },
    { id: 'security-check', type: 'securityNode', position: { x: 450, y: 80 }, data: { label: 'Security Filter', tag: 'Allowlist', icon: 'shield', color: '#f87171' } },
    // Skill lanes
    { id: 'skill-jira', type: 'skillNode', position: { x: 650, y: 80 }, data: { label: 'jiraSkill', tag: 'Lane A', icon: 'clipboard', color: '#5eead4' } },
    { id: 'skill-minio', type: 'skillNode', position: { x: 650, y: 200 }, data: { label: 'minioSkill', tag: 'Lane B', icon: 'image', color: '#5eead4' } },
    { id: 'retry-minio', type: 'retryNode', position: { x: 830, y: 200 }, data: { label: 'Retry (3x)', tag: '0.41→0.87', icon: 'refresh-cw', color: '#e879f9' } },
    { id: 'skill-fs', type: 'skillNode', position: { x: 650, y: 320 }, data: { label: 'fileSystemSkill', tag: 'Lane C', icon: 'folder', color: '#5eead4' } },
    { id: 'skill-web', type: 'skillNode', position: { x: 650, y: 440 }, data: { label: 'webSearchSkill', tag: 'Lane D', icon: 'globe', color: '#5eead4' } },
    // Post-processing
    { id: 'aggregator', type: 'summarizerNode', position: { x: 450, y: 560 }, data: { label: 'Aggregator', tag: 'Merge', icon: 'git-merge', color: '#5eead4' } },
    { id: 'llm', type: 'llmNode', position: { x: 250, y: 560 }, data: { label: 'LLM Client', tag: 'Summarize', icon: 'sparkles', color: '#fde047' } },
    { id: 'response', type: 'summarizerNode', position: { x: 50, y: 560 }, data: { label: 'Response Builder', tag: 'Schema', icon: 'file-output', color: '#5eead4' } },
];

/* ─── Result Scene Nodes ─── */
const resultNodes: FlowNode[] = [
    { id: 'dashboard', type: 'userNode', position: { x: 400, y: 50 }, data: { label: "Alex's Dashboard", tag: 'Unified View', icon: 'layout-dashboard', color: '#e2e8f0' } },
    { id: 'res-jira', type: 'dataSourceNode', position: { x: 100, y: 250 }, data: { label: '7 Jira Tasks', tag: 'Score: 0.94', icon: 'clipboard', color: '#60a5fa', subType: 'jira' } },
    { id: 'res-minio', type: 'dataSourceNode', position: { x: 350, y: 250 }, data: { label: '12 Photos', tag: 'Score: 0.87', icon: 'image', color: '#fb923c', subType: 'minio' } },
    { id: 'res-fs', type: 'dataSourceNode', position: { x: 550, y: 250 }, data: { label: '3 Invoices', tag: 'Score: 0.91', icon: 'file-text', color: '#cbd5e1', subType: 'filesystem' } },
    { id: 'res-web', type: 'dataSourceNode', position: { x: 750, y: 250 }, data: { label: '3 Articles', tag: 'Score: 0.88', icon: 'globe', color: '#c084fc', subType: 'web' } },
    { id: 'stats', type: 'gatewayNode', position: { x: 400, y: 450 }, data: { label: 'Final Stats', tag: 'Confidence: 89%', icon: 'bar-chart', color: '#22d3ee' } },
];

export const sceneNodes: Record<SceneName, FlowNode[]> = {
    problem: problemNodes,
    config: configNodes,
    boot: bootNodes,
    flow: flowNodes,
    result: resultNodes,
};
