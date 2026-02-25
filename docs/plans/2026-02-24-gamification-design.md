# 游戏化激励机制设计方案

**Date:** 2026-02-24  
**Status:** Implementation Ready  
**Principle:** 《掌控习惯》四法则 — 让它显眼、让它有吸引力、让它简单、让结果满足

---

## 设计哲学

基于《掌控习惯》核心原理，通过三个维度建立正向学习飞轮：

```
游戏化 (有趣) + 可视化 (有感) + 社交化 (有压力)
         ↓
  构建习惯 → 感受进步 → 持续学习 AI
```

---

## 一、经验值与等级系统 (XP & Levels)

### XP 获取规则
| 行为 | XP |
|------|----|
| 完成 BEGINNER 挑战 | +10 XP |
| 完成 INTERMEDIATE 挑战 | +25 XP |
| 完成 ADVANCED 挑战 | +50 XP |
| 完成 EXPERT 挑战 | +100 XP |
| 发布一个挑战（社区） | +20 XP |
| 发布的挑战获得 5 个 Like | +10 XP |
| 连续 7 天完成挑战（周连击） | +50 XP |
| 完成一条完整学习路径 | +200 XP |

### 等级划分 (20 级)
| Level | XP 要求 | 称号 |
|-------|---------|------|
| 1 | 0 | AI 新手 |
| 2 | 50 | AI 探索者 |
| 3 | 150 | AI 实践者 |
| 4 | 300 | 提示工程师 |
| 5 | 500 | AI 构建者 |
| 6 | 800 | 全栈 AI 工程师 |
| 7 | 1200 | AI 产品创作者 |
| 8 | 1800 | AI 应用专家 |
| 9 | 2600 | AI 架构师 |
| 10 | 3500 | AI 大师 |
| 11-15 | 递增 | 传说·AI 领袖 |
| 16-20 | 递增 | 神话·AI 先驱 |

### 数据库模型新增
```prisma
model UserStats {
  id           String   @id @default(cuid())
  userId       String   @unique @map("user_id")
  xp           Int      @default(0)
  level        Int      @default(1)
  currentStreak Int     @default(0) @map("current_streak")
  longestStreak Int     @default(0) @map("longest_streak")
  lastActiveDate DateTime? @map("last_active_date")
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")
  @@map("user_stats")
}
```

---

## 二、成就徽章系统 (Achievements)

### 徽章分类

**完成类**
- 🎯 第一步 — 完成第一个挑战
- 🔟 十全十美 — 完成 10 个挑战
- 💯 百炼成钢 — 完成 100 个挑战
- 🧠 全能 AI — 完成全部 4 个难度各 1 个

**难度类**
- 🟢 绿带 — 完成 5 个 BEGINNER
- 🔵 蓝带 — 完成 5 个 INTERMEDIATE
- 🔴 红带 — 完成 5 个 ADVANCED
- ⚫ 黑带 — 完成 1 个 EXPERT

**连击类**
- 🔥 三日不息 — 连续 3 天
- 🔥🔥 周更达人 — 连续 7 天
- 🔥🔥🔥 月不停歇 — 连续 30 天

**社交类**
- ✍️ 创作者 — 发布第 1 个挑战
- 🌟 受欢迎 — 发布的挑战获得 10 个赞
- 🤝 影响力 — 发布的挑战被 Fork 5 次

**路径类**
- 🗺️ 路径先驱 — 完成第一条学习路径
- 🏆 全路径大师 — 完成所有学习路径

### 数据库模型
```prisma
model Achievement {
  id          String   @id @default(cuid())
  slug        String   @unique
  name        String
  description String
  icon        String   // emoji or lucide icon name
  xpReward    Int      @default(0) @map("xp_reward")
  rarity      AchievementRarity @default(COMMON)
  unlockedBy  UserAchievement[]
  createdAt   DateTime @default(now()) @map("created_at")
  @@map("achievements")
}

model UserAchievement {
  userId        String      @map("user_id")
  achievementId String      @map("achievement_id")
  user          User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  achievement   Achievement @relation(fields: [achievementId], references: [id], onDelete: Cascade)
  unlockedAt    DateTime    @default(now()) @map("unlocked_at")
  @@id([userId, achievementId])
  @@map("user_achievements")
}

enum AchievementRarity {
  COMMON
  RARE
  EPIC
  LEGENDARY
}
```

---

## 三、每日挑战 & 连击系统 (Daily Streak)

- 每天完成任意 1 个挑战 → 连击 +1
- 超过 24 小时未完成 → 连击归零
- 前端展示火焰图标 + 天数
- Profile 页展示 GitHub 风格贡献热力图（按周）

---

## 四、排行榜 (Leaderboard)

`/leaderboard` 页面，展示：
- 本周经验榜（重置每周一）
- 本月经验榜
- 总经验榜
- 当前连击榜

数据库模型（周期快照，可选，初期直接实时查询）：
```prisma
// 直接从 UserStats 聚合查询，不需要额外表
```

---

## 五、可视化组件

### Profile 页增强
1. **XP 进度条** — 当前等级 XP / 下一级 XP，带动画
2. **等级徽章** — 大号图标 + 称号，显眼
3. **连击展示** — 🔥 N天连击，带最长记录
4. **成就展柜** — 最近解锁 + 稀有成就优先展示
5. **贡献热力图** — 类 GitHub 日历，显示每天完成情况
6. **技能分布** — 饼图/雷达图，按 Category 分析完成情况

### 挑战完成弹窗
完成挑战时触发：
- 🎉 动画弹窗 showing +XP
- 如果有新成就解锁 → 额外展示徽章
- 如果连击增加 → 显示当前连击数

---

## 六、社交机制增强

### 活动Feed（可选 v2）
- 首页展示最近社区动态
- "XXX 完成了 YYY 挑战 +50XP"
- "XXX 解锁了 🔥🔥🔥 月不停歇 成就"

### 挑战页显示完成者
- 挑战详情页底部展示"已有 N 人完成"+ 头像列表

---

## 实现优先级 (MVP)

### P0 - 核心游戏循环（本次实现）
1. DB Schema: `UserStats` + `Achievement` + `UserAchievement` 表
2. XP 计算逻辑：`markComplete` 时自动加 XP + 检查等级
3. 连击逻辑：`markComplete` 时更新 streak
4. 成就检查函数：每次完成/发布后调用
5. Profile 页：XP条 + 等级 + 连击 + 成就展示
6. 完成弹窗：XP 动画 + 成就解锁提示

### P1 - 可视化（本次实现）
7. 贡献热力图组件
8. 排行榜页面 `/leaderboard`

### P2 - 社交（后续）
9. 活动 Feed
10. 挑战完成者列表

---

## 文件变更清单

### 数据库
- `prisma/schema.prisma` — 新增 UserStats, Achievement, UserAchievement, AchievementRarity
- `prisma/migrations/` — 新建迁移
- `prisma/seed.ts` — 种入 Achievement 数据

### 后端逻辑
- `src/lib/xp.ts` — XP/等级计算纯函数
- `src/lib/achievements.ts` — 成就定义 + 检查逻辑
- `src/actions/completions.ts` — 改造，加入 XP/streak/achievement 逻辑
- `src/actions/challenges.ts` — createChallenge 时加 XP
- `src/lib/gamification.ts` — 统一入口：`awardXP`, `checkStreaks`, `checkAchievements`

### 前端组件
- `src/components/gamification/xp-progress.tsx` — XP 进度条
- `src/components/gamification/level-badge.tsx` — 等级徽章
- `src/components/gamification/streak-display.tsx` — 连击火焰
- `src/components/gamification/achievement-card.tsx` — 单个成就卡片
- `src/components/gamification/achievement-unlock-toast.tsx` — 解锁动画
- `src/components/gamification/contribution-heatmap.tsx` — 热力图
- `src/components/gamification/completion-modal.tsx` — 完成弹窗
- `src/app/leaderboard/page.tsx` — 排行榜页

### 页面改造
- `src/app/profile/[id]/profile-content.tsx` — 集成游戏化组件
- `src/app/challenges/[slug]/challenge-actions.tsx` — 完成后触发弹窗
- `src/components/layout/header.tsx` — 显示当前 XP/等级

---

## 技术注意事项

1. XP 变更用 Prisma transaction（防并发）
2. 成就检查幂等（已有成就不重复发放）
3. 热力图数据从 ChallengeCompletion 聚合，按日期 GROUP BY
4. 动画用 framer-motion 或 CSS animation（看项目是否已有）
5. Toast 用 sonner 或 shadcn/ui Toast（看项目已有什么）
