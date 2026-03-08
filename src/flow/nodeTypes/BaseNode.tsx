import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { motion } from 'framer-motion';
import type { NodeData } from '../../types';
import {
    User, Zap, Server, Database, Cpu, Sparkles, FileJson, Link,
    Shield, RefreshCw, Hash, GitMerge, Folder, Globe, Image,
    ClipboardList, Eye, Brain, Wrench, Boxes, FileOutput,
    LayoutDashboard, BarChart, FileText, CheckCircle, Layers, Terminal
} from 'lucide-react';

const iconMap: Record<string, React.FC<{ size?: number; className?: string }>> = {
    user: User, zap: Zap, server: Server, database: Database,
    cpu: Cpu, sparkles: Sparkles, 'file-json': FileJson, link: Link,
    shield: Shield, 'refresh-cw': RefreshCw, hash: Hash, 'git-merge': GitMerge,
    folder: Folder, globe: Globe, image: Image, clipboard: ClipboardList,
    eye: Eye, brain: Brain, wrench: Wrench, boxes: Boxes,
    'file-output': FileOutput, 'layout-dashboard': LayoutDashboard,
    'bar-chart': BarChart, 'file-text': FileText, 'check-circle': CheckCircle,
    layers: Layers, terminal: Terminal,
};

interface BaseNodeProps {
    data: NodeData;
    glowColor?: string;
    borderColor?: string;
    selected?: boolean;
}

const BaseNode: React.FC<BaseNodeProps> = ({ data, glowColor, borderColor }) => {
    const { label, tag, icon, color, active, dimmed } = data;
    const resolvedColor = color || '#22d3ee';
    const resolvedGlow = glowColor || resolvedColor;
    const resolvedBorder = borderColor || resolvedColor;
    const IconComp = icon ? iconMap[icon] : null;

    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
                scale: active ? 1.04 : 1,
                opacity: dimmed ? 0.3 : 1,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative"
            style={{
                filter: dimmed ? 'grayscale(0.4)' : 'none',
            }}
        >
            <Handle type="target" position={Position.Left} className="!bg-white/20 !border-none !w-2 !h-2" />
            <div
                className="glass px-4 py-3 min-w-[140px] flex items-center gap-3 cursor-default"
                style={{
                    borderColor: `${resolvedBorder}33`,
                    boxShadow: active
                        ? `0 0 24px ${resolvedGlow}55, 0 0 48px ${resolvedGlow}22`
                        : `0 0 0 transparent`,
                    transition: 'box-shadow 0.4s ease, border-color 0.4s ease',
                }}
            >
                {IconComp && (
                    <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: `${resolvedColor}22` }}
                    >
                        <IconComp size={16} className="opacity-90" style={{ color: resolvedColor } as React.CSSProperties} />
                    </div>
                )}
                <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold text-white truncate">{label}</span>
                    {tag && (
                        <span
                            className="text-[10px] font-mono truncate"
                            style={{ color: `${resolvedColor}bb` }}
                        >
                            {tag}
                        </span>
                    )}
                </div>
            </div>
            <Handle type="source" position={Position.Right} className="!bg-white/20 !border-none !w-2 !h-2" />
        </motion.div>
    );
};

export default React.memo(BaseNode);
export { iconMap };
