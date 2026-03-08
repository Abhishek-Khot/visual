import React from 'react';
import type { NodeProps } from '@xyflow/react';
import BaseNode from './BaseNode';
import type { NodeData } from '../../types';

const ConfigNode: React.FC<NodeProps> = ({ data }) => (
    <BaseNode data={data as NodeData} glowColor="#f9a8d4" borderColor="#f9a8d4" />
);
export default React.memo(ConfigNode);
