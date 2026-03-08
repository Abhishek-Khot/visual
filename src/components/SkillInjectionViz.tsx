import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder, FileCode, ArrowRight, Cpu, Database, Check } from 'lucide-react';

interface SkillMapping {
    file: string;
    skillClass: string;
    tool: string;
    datasource: string;
    color: string;
}

const skillMappings: SkillMapping[] = [
    { file: 'mongoSkill.py', skillClass: 'MongoSkill', tool: 'mongo_tool', datasource: 'MongoDB', color: '#4ade80' },
    { file: 'relationalSkill.py', skillClass: 'RelationalSkill', tool: 'mysql_tool', datasource: 'MySQL', color: '#60a5fa' },
    { file: 'fileSystemSkill.py', skillClass: 'FileSystemSkill', tool: 'filesystem_tool', datasource: 'FileSystem', color: '#94a3b8' },
    { file: 'minioSkill.py', skillClass: 'MinioSkill', tool: 'minio_tool', datasource: 'MinIO', color: '#fb923c' },
    { file: 'jiraSkill.py', skillClass: 'JiraSkill', tool: 'jira_tool', datasource: 'Jira', color: '#c084fc' },
    { file: 'webSearchSkill.py', skillClass: 'WebSearchSkill', tool: 'websearch_tool', datasource: 'WebSearch', color: '#fde047' },
];

const extraSkills = ['pgvectorSkill.py', 'chromaSkill.py', 'confluenceSkill.py'];

interface SkillInjectionVizProps {
    animate?: boolean;
    onComplete?: () => void;
}

const SkillInjectionViz: React.FC<SkillInjectionVizProps> = ({ animate = true, onComplete }) => {
    const [phase, setPhase] = useState<'folder' | 'explode' | 'inject' | 'done'>('folder');
    const [injectedCount, setInjectedCount] = useState(0);

    useEffect(() => {
        if (!animate) { setPhase('done'); setInjectedCount(9); return; }
        const t1 = setTimeout(() => setPhase('explode'), 600);
        const t2 = setTimeout(() => setPhase('inject'), 1400);
        const t3 = setTimeout(() => { setPhase('done'); onComplete?.(); }, 1400 + skillMappings.length * 500 + 800);
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }, [animate, onComplete]);

    useEffect(() => {
        if (phase !== 'inject') return;
        let count = 0;
        const interval = setInterval(() => {
            count++;
            setInjectedCount(count);
            if (count >= skillMappings.length + extraSkills.length) clearInterval(interval);
        }, 400);
        return () => clearInterval(interval);
    }, [phase]);

    return (
        <div className="glass-strong p-5 space-y-4 max-w-2xl w-full">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                    <Cpu size={12} className="text-teal-400" />
                    <span>Dynamic Skill Injection</span>
                </div>
                <span className="text-[10px] font-mono text-teal-400">
                    {injectedCount}/9 skills injected
                </span>
            </div>

            {/* Folder opening */}
            <AnimatePresence>
                {(phase === 'folder' || phase === 'explode') && (
                    <motion.div
                        initial={{ scale: 1 }}
                        animate={phase === 'explode' ? { scale: 1.1 } : {}}
                        className="flex items-center justify-center py-4"
                    >
                        <motion.div
                            animate={phase === 'explode' ? {
                                scale: [1, 1.3, 0.8],
                                rotate: [0, -5, 5, 0],
                            } : {}}
                            transition={{ duration: 0.5 }}
                            className="flex items-center gap-2 glass px-5 py-3"
                            style={{ borderColor: 'rgba(94,234,212,0.3)' }}
                        >
                            <Folder size={20} className="text-teal-400" />
                            <span className="text-sm font-mono text-teal-300">src/asgp/skills/</span>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Injection chains */}
            {(phase === 'inject' || phase === 'done') && (
                <div className="space-y-2">
                    {skillMappings.map((skill, i) => {
                        const isVisible = injectedCount > i;
                        return (
                            <AnimatePresence key={skill.file}>
                                {isVisible && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -40, scale: 0.8 }}
                                        animate={{ opacity: 1, x: 0, scale: 1 }}
                                        transition={{
                                            type: 'spring', stiffness: 400, damping: 25,
                                        }}
                                        className="flex items-center gap-2 text-[11px] font-mono"
                                    >
                                        {/* File */}
                                        <div className="flex items-center gap-1.5 glass px-2 py-1 min-w-[130px]"
                                            style={{ borderColor: `${skill.color}33` }}>
                                            <FileCode size={10} style={{ color: skill.color }} />
                                            <span className="text-slate-300">{skill.file}</span>
                                        </div>

                                        <motion.div
                                            initial={{ scaleX: 0 }}
                                            animate={{ scaleX: 1 }}
                                            transition={{ delay: 0.1 }}
                                        >
                                            <ArrowRight size={10} className="text-slate-600" />
                                        </motion.div>

                                        {/* Skill class */}
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.15 }}
                                            className="glass px-2 py-1 min-w-[110px]"
                                            style={{ borderColor: `${skill.color}22` }}
                                        >
                                            <span style={{ color: skill.color }}>{skill.skillClass}</span>
                                        </motion.div>

                                        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.2 }}>
                                            <ArrowRight size={10} className="text-slate-600" />
                                        </motion.div>

                                        {/* Tool */}
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.25 }}
                                            className="glass px-2 py-1 min-w-[100px]"
                                        >
                                            <span className="text-cyan-400">{skill.tool}</span>
                                        </motion.div>

                                        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3 }}>
                                            <ArrowRight size={10} className="text-slate-600" />
                                        </motion.div>

                                        {/* Datasource */}
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.35, type: 'spring', stiffness: 500 }}
                                            className="flex items-center gap-1 glass px-2 py-1"
                                            style={{ borderColor: `${skill.color}33` }}
                                        >
                                            <Database size={9} style={{ color: skill.color }} />
                                            <span style={{ color: skill.color }}>{skill.datasource}</span>
                                            <Check size={9} className="text-green-400" />
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        );
                    })}

                    {/* Extra skills */}
                    {injectedCount > skillMappings.length && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-2 text-[10px] font-mono text-slate-500 pt-1"
                        >
                            {extraSkills.map((s, i) => (
                                <span key={s} className="glass px-2 py-0.5" style={{
                                    borderColor: 'rgba(94,234,212,0.15)',
                                }}>
                                    <FileCode size={8} className="inline mr-1 text-teal-400/50" />
                                    {s}
                                </span>
                            ))}
                            <span className="text-teal-400/60">+3 registered</span>
                        </motion.div>
                    )}
                </div>
            )}

            {/* Code ref */}
            <div className="text-[9px] font-mono text-slate-600 pt-1">
                src/asgp/skills/skillRegistry.py → SkillRegistry.inject_all()
            </div>
        </div>
    );
};

export default React.memo(SkillInjectionViz);
