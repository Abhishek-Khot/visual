import type { Edge } from '@xyflow/react';
import type { SceneName } from '../types';

const baseEdgeStyle = {
    stroke: 'rgba(255,255,255,0.15)',
    strokeWidth: 1.5,
};

const activeEdgeStyle = {
    stroke: '#22d3ee',
    strokeWidth: 2.5,
};

/* ─── Problem Scene ─── */
const problemEdges: Edge[] = [
    { id: 'e-alex-jira', source: 'alex', target: 'jira-silo', style: baseEdgeStyle, animated: true },
    { id: 'e-alex-fs', source: 'alex', target: 'fs-silo', style: baseEdgeStyle, animated: true },
    { id: 'e-alex-minio', source: 'alex', target: 'minio-silo', style: baseEdgeStyle, animated: true },
    { id: 'e-alex-mysql', source: 'alex', target: 'mysql-silo', style: baseEdgeStyle, animated: true },
    { id: 'e-alex-mongo', source: 'alex', target: 'mongo-silo', style: baseEdgeStyle, animated: true },
    { id: 'e-alex-web', source: 'alex', target: 'web-silo', style: baseEdgeStyle, animated: true },
];

/* ─── Config Scene ─── */
const configEdges: Edge[] = [
    { id: 'e-term-gw', source: 'cfg-terminal', target: 'cfg-gateway', style: activeEdgeStyle, animated: true },
    { id: 'e-term-sec', source: 'cfg-terminal', target: 'cfg-security', style: activeEdgeStyle, animated: true },
    { id: 'e-gw-src', source: 'cfg-gateway', target: 'cfg-sources', style: activeEdgeStyle, animated: true },
    { id: 'e-sec-src', source: 'cfg-security', target: 'cfg-sources', style: activeEdgeStyle, animated: true },
];

/* ─── Boot Scene ─── */
const bootEdges: Edge[] = [
    { id: 'e-load-val', source: 'loader', target: 'validator', style: activeEdgeStyle, animated: true },
    { id: 'e-val-sec', source: 'validator', target: 'security-init', style: activeEdgeStyle, animated: true },
    { id: 'e-val-tool', source: 'validator', target: 'tool-registry', style: activeEdgeStyle, animated: true },
    { id: 'e-tool-skill', source: 'tool-registry', target: 'skill-registry', style: activeEdgeStyle, animated: true },
    { id: 'e-skill-sub', source: 'skill-registry', target: 'subagent-factory', style: activeEdgeStyle, animated: true },
    { id: 'e-sec-gw', source: 'security-init', target: 'gateway-ready', style: activeEdgeStyle, animated: true },
    { id: 'e-tool-gw', source: 'tool-registry', target: 'gateway-ready', style: activeEdgeStyle, animated: true },
    { id: 'e-skill-gw', source: 'skill-registry', target: 'gateway-ready', style: activeEdgeStyle, animated: true },
    { id: 'e-sub-gw', source: 'subagent-factory', target: 'gateway-ready', style: activeEdgeStyle, animated: true },
];

/* ─── Flow Scene ─── */
const flowEdges: Edge[] = [
    { id: 'e-alex-gw', source: 'alex-q', target: 'gateway', style: activeEdgeStyle, animated: true },
    { id: 'e-gw-tok', source: 'gateway', target: 'tokenizer', style: activeEdgeStyle, animated: true },
    { id: 'e-gw-think', source: 'gateway', target: 'thinking', style: activeEdgeStyle, animated: true },
    { id: 'e-think-ref', source: 'thinking', target: 'reflection', style: activeEdgeStyle, animated: true },
    { id: 'e-ref-conn', source: 'reflection', target: 'conn-mgr', style: activeEdgeStyle, animated: true },
    { id: 'e-conn-sec', source: 'conn-mgr', target: 'security-check', style: activeEdgeStyle, animated: true },
    // Parallel dispatch
    { id: 'e-conn-jira', source: 'conn-mgr', target: 'skill-jira', style: { ...activeEdgeStyle, stroke: '#5eead4' }, animated: true },
    { id: 'e-conn-minio', source: 'conn-mgr', target: 'skill-minio', style: { ...activeEdgeStyle, stroke: '#fb923c' }, animated: true },
    { id: 'e-minio-retry', source: 'skill-minio', target: 'retry-minio', style: { ...activeEdgeStyle, stroke: '#e879f9' }, animated: true },
    { id: 'e-conn-fs', source: 'conn-mgr', target: 'skill-fs', style: { ...activeEdgeStyle, stroke: '#cbd5e1' }, animated: true },
    { id: 'e-conn-web', source: 'conn-mgr', target: 'skill-web', style: { ...activeEdgeStyle, stroke: '#c084fc' }, animated: true },
    // Convergence
    { id: 'e-jira-agg', source: 'skill-jira', target: 'aggregator', style: activeEdgeStyle, animated: true },
    { id: 'e-retry-agg', source: 'retry-minio', target: 'aggregator', style: activeEdgeStyle, animated: true },
    { id: 'e-fs-agg', source: 'skill-fs', target: 'aggregator', style: activeEdgeStyle, animated: true },
    { id: 'e-web-agg', source: 'skill-web', target: 'aggregator', style: activeEdgeStyle, animated: true },
    // Post-processing
    { id: 'e-agg-llm', source: 'aggregator', target: 'llm', style: { ...activeEdgeStyle, stroke: '#fde047' }, animated: true },
    { id: 'e-llm-resp', source: 'llm', target: 'response', style: activeEdgeStyle, animated: true },
    { id: 'e-resp-alex', source: 'response', target: 'alex-q', style: activeEdgeStyle, animated: true },
];

/* ─── Result Scene ─── */
const resultEdges: Edge[] = [
    { id: 'e-dash-jira', source: 'dashboard', target: 'res-jira', style: { ...activeEdgeStyle, stroke: '#60a5fa' }, animated: true },
    { id: 'e-dash-minio', source: 'dashboard', target: 'res-minio', style: { ...activeEdgeStyle, stroke: '#fb923c' }, animated: true },
    { id: 'e-dash-fs', source: 'dashboard', target: 'res-fs', style: { ...activeEdgeStyle, stroke: '#cbd5e1' }, animated: true },
    { id: 'e-dash-web', source: 'dashboard', target: 'res-web', style: { ...activeEdgeStyle, stroke: '#c084fc' }, animated: true },
    { id: 'e-dash-stats', source: 'dashboard', target: 'stats', style: activeEdgeStyle, animated: true },
];

export const sceneEdges: Record<SceneName, Edge[]> = {
    problem: problemEdges,
    config: configEdges,
    boot: bootEdges,
    flow: flowEdges,
    result: resultEdges,
};
