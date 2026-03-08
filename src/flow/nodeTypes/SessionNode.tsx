import React from 'react';
import type { NodeProps } from '@xyflow/react';
import BaseNode from './BaseNode';
import type { NodeData } from '../../types';

const SessionNode: React.FC<NodeProps> = ({ data }) => (
    <BaseNode data={data as NodeData} glowColor="#22d3ee" borderColor="#06b6d4" />
);
export default React.memo(SessionNode);
