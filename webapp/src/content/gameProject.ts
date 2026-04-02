export type TurnFlowPhase = {
  phase: string
  description?: string
}

export type TurnBasedAction = {
  name: string
  cost?: string
  description?: string
}

export type GameUnit = {
  id: string
  name: string
  role: string
  faction?: string
  description?: string
  attributes: Record<string, number | string>
  skills: Array<{ name: string; description?: string; cooldown?: string; tags?: string[] }>
  portraitImageUrl?: string
}

export type GameStage = {
  id: string
  name: string
  objective: string
  recommendedLevel?: number
  difficulty?: 'easy' | 'normal' | 'hard'
  previewImageUrl?: string
  mechanicsNotes?: string[]
}

import imgTown from '../assets/进入城镇场景.png'
import imgBattleVictory from '../assets/击败敌人战斗胜利.png'
import imgChest from '../assets/打开宝箱获取奖励.png'
import imgInventory from '../assets/背包栏与装备栏.png'
import imgQuest from '../assets/任务列表与详情.png'

export type GameProject = {
  slug: string
  title: string
  subtitle?: string
  hero: {
    coverImageUrl?: string
    trailerUrl?: string
    colorTheme?: string
  }
  quickFacts: {
    engine: 'Unity'
    genre: string
    platforms?: string[]
    status?: 'prototype' | 'in_progress' | 'released'
    releaseYear?: number
    version?: string
  }
  background: {
    problemOrGoal?: string
    designPhilosophy?: string
    inspirations?: string[]
  }
  turnBasedCore: {
    turnFlow: TurnFlowPhase[]
    actionSystem: {
      systemName: string
      actions: TurnBasedAction[]
      turnRules: string[]
    }
    unitStats: {
      attributes: Array<{ key: string; label: string }>
    }
    combatRules: string[]
    statusEffects?: Array<{ name: string; durationRule?: string; effectSummary: string }>
  }
  units: GameUnit[]
  stages: GameStage[]
  media: {
    screenshots: Array<{ url: string; caption?: string }>
    videos: Array<{ url: string; title?: string }>
  }
  links: Array<{ label: string; href: string; kind?: 'download' | 'store' | 'play' | 'trailer' }>
  faq?: Array<{ q: string; a: string }>
  roadmap?: Array<{ milestone: string; status?: 'planned' | 'doing' | 'done'; eta?: string; notes?: string }>
  devNotes?: string[]
}

export const gameProject: GameProject = {
  slug: 'my-dnd-project',
  title: 'My DND Project',
  subtitle: '已实现战斗回合、技能系统、任务系统、背包装备与宝箱掉落的可玩版本',
  hero: {
    coverImageUrl: imgTown,
    trailerUrl: '',
    colorTheme: '#3b82f6',
  },
  quickFacts: {
    engine: 'Unity',
    genre: '俯视角探索 + 回合战斗 RPG',
    platforms: ['PC'],
    status: 'in_progress',
    releaseYear: 2026,
    version: 'v0.3',
  },
  background: {
    problemOrGoal: '目标是把 DND 风格的属性成长与回合战斗做成可快速验证的 Unity 原型。',
    designPhilosophy: '先做可玩的核心循环：探索 -> 遭遇战 -> 掉落/金币 -> 任务推进。',
    inspirations: ['DND 属性体系', '回合制战斗', '数据驱动的技能与任务 ScriptableObject'],
  },
  turnBasedCore: {
    turnFlow: [
      { phase: '进入战斗', description: 'BattleManager 收集参战单位并按 d20+速度掷先攻排序' },
      { phase: '单位回合开始', description: '重置行动点，刷新技能每回合次数，玩家可移动/攻击/施法' },
      { phase: '单位行动', description: '玩家通过按钮进入选目标/选范围点；敌人由 EnemyBattleAI 自动决策' },
      { phase: '回合结束与推进', description: '回蓝并切下一个存活单位；敌方全灭则结束战斗并恢复探索移动' },
    ],
    actionSystem: {
      systemName: '行动点 + 魔力双资源系统',
      actions: [
        { name: '普通攻击', cost: '1 AP', description: '消耗行动点，按力量与暴击率结算伤害' },
        { name: '技能施放', cost: '消耗 MP', description: '技能不扣 AP，只受蓝量、射程和次数限制约束' },
        { name: '战斗内移动', cost: '消耗剩余移动距离', description: '点击地面移动，超出距离会自动截断到可达点' },
        { name: '结束回合', cost: '0', description: '主动结束当前单位回合，推进到下一个单位' },
      ],
      turnRules: [
        '普通攻击依赖行动点；行动点用完后该单位本回合不能继续攻击/移动。',
        '技能支持每回合多次、每回合一次、每战斗一次三种施放限制。',
        '回合结束会根据智力回蓝；战斗结束会恢复玩家 ClickToMove 探索控制。',
      ],
    },
    unitStats: {
      attributes: [
        { key: 'vitality', label: '体质' },
        { key: 'strength', label: '力量' },
        { key: 'intelligence', label: '智力' },
        { key: 'speed', label: '速度' },
        { key: 'luck', label: '运气' },
      ],
    },
    combatRules: [
      '先攻：每个单位 RollInitiative() = d20 + 速度。',
      '生命/魔力上限：MaxHP = 体质*2，MaxMP = 魅力*2，初始蓝量 = 魅力。',
      '普通攻击伤害：baseDamage + 攻击者力量，暴击时翻倍（暴击率受运气影响）。',
      'AOE 技能通过 OverlapSphere 对半径内目标结算；敌我判定基于 Tag。',
    ],
    statusEffects: [
      { name: '技能次数限制', durationRule: '按回合/战斗重置', effectSummary: '支持每回合一次与每战斗一次的技能限制逻辑' },
      { name: '敌人 Buff 占位逻辑', durationRule: 'AI 回合内触发', effectSummary: '敌人无法攻击时可施放 Buff（当前示例为日志与简单回血）' },
    ],
  },
  units: [
    {
      id: 'player',
      name: 'Player',
      role: '可操控主角',
      faction: '玩家阵营',
      description: '支持点击移动、普通攻击、技能释放、背包与任务交互。',
      attributes: { vitality: 10, strength: 10, intelligence: 10, speed: 10, luck: 10 },
      skills: [
        { name: '追击', description: '位移到敌人面前并造成伤害', cooldown: '每回合可多次', tags: ['敌方单体', '位移', '消耗5MP'] },
        { name: '平心静气', description: '对自身施放恢复生命', cooldown: '每回合一次', tags: ['自疗', '消耗8MP'] },
        { name: '旋风斩', description: '以自身为中心的近身 AOE 伤害', cooldown: '每回合可多次', tags: ['AOE', '消耗10MP'] },
        { name: '剑雨', description: '远距离指定落点后造成范围伤害', cooldown: '每战斗一次', tags: ['远程AOE', '消耗15MP'] },
      ],
      portraitImageUrl: imgTown,
    },
    {
      id: 'enemy',
      name: 'Enemy',
      role: 'AI 控制敌方单位',
      faction: '敌对阵营',
      description: '会自动判断距离、移动、施法/普攻，并在必要时施放 Buff。',
      attributes: { vitality: 10, strength: 10, intelligence: 10, speed: 10, luck: 10 },
      skills: [
        { name: 'EnemySkill[]', description: '按配置顺序寻找可用伤害技能并优先释放', cooldown: 'AI 即时评估', tags: ['自动决策'] },
        { name: '普攻', description: '进入基础攻击距离后消耗行动点进行攻击', cooldown: 'AP 允许时可连续', tags: ['近战'] },
      ],
      portraitImageUrl: imgBattleVictory,
    },
  ],
  stages: [
    {
      id: 'explore-battle',
      name: 'SampleScene：探索与遭遇战',
      objective: '在场景中探索，触发战斗并完成回合战斗循环',
      recommendedLevel: 1,
      difficulty: 'easy',
      previewImageUrl: imgTown,
      mechanicsNotes: ['玩家非战斗状态使用 ClickToMoveAgent 探索', '进入战斗后切换为 BattleManager 主导的回合流程'],
    },
    {
      id: 'chest-loot',
      name: '宝箱与掉落验证',
      objective: '靠近并开启宝箱，拾取金币和物品进入背包',
      recommendedLevel: 1,
      difficulty: 'normal',
      previewImageUrl: imgChest,
      mechanicsNotes: ['ChestLootSpawner 支持点击后自动走近开箱', '掉落物带吸附拾取与背包满逻辑处理'],
    },
    {
      id: 'quest-panel',
      name: '任务栏与任务面板',
      objective: '展示主线/支线/已完成任务状态并支持收起展开',
      recommendedLevel: 1,
      difficulty: 'easy',
      previewImageUrl: imgQuest,
      mechanicsNotes: ['任务状态分为 Available / Accepted / Completed', '已配置新手教程、主线任务1、支线任务1/2'],
    },
  ],
  media: {
    screenshots: [
      { url: imgTown, caption: '实机：进入城镇场景' },
      { url: imgBattleVictory, caption: '实机：击败敌人，战斗胜利' },
      { url: imgChest, caption: '实机：打开宝箱获取奖励' },
      { url: imgInventory, caption: '实机：背包栏与装备栏' },
      { url: imgQuest, caption: '实机：任务列表与详情' },
    ],
    videos: [
      { url: '', title: '实机演示（可填 B 站或网盘链接）' },
    ],
  },
  links: [
    { label: '项目源码（待填）', href: '#', kind: 'download' },
    { label: '实机视频（待填）', href: '#', kind: 'trailer' },
    { label: '试玩包（待填）', href: '#', kind: 'play' },
  ],
  faq: [
    { q: '当前版本已经做了哪些系统？', a: '已实现战斗管理、玩家战斗控制、敌人 AI、技能系统、任务系统、背包装备、掉落拾取与金币系统。' },
    { q: '技能是硬编码还是数据驱动？', a: '技能基础数据来自 ScriptableObject（SkillData），运行时由 UnitSkills + SkillExecutor 执行。' },
    { q: '任务系统是否支持状态切换？', a: '支持 None/Available/Accepted/Completed，并可通过 AcceptQuest / CompleteQuest 更新状态。' },
  ],
  roadmap: [
    { milestone: '战斗主循环（先攻/回合/AP/MP）', status: 'done', eta: '2026-04' },
    { milestone: '背包装备与掉落系统', status: 'done', eta: '2026-04' },
    { milestone: '任务 UI 与任务状态流转', status: 'doing', eta: '2026-04', notes: '正在接剧情触发与任务完成条件' },
    { milestone: '补充美术资源与实机展示页面素材', status: 'done', eta: '2026-04', notes: '头图与媒体区已接入 src/assets 实机截图' },
  ],
  devNotes: [
    '本页面内容已按 Unity 项目中脚本与 ScriptableObject 数据同步。',
    '实机截图位于 webapp/src/assets/，通过 import 引用以便打包时正确处理路径。',
  ],
}

