"use client";

import { motion } from "framer-motion";
import {
  ExternalLink,
  Rocket,
  Users,
  Zap,
  Shield,
  Code2,
  Megaphone,
  TrendingUp,
  Baby,
  Pen,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  Target,
  Bot,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

/* ── Animation variants ── */

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

/* ── User case data ── */

const userCases = [
  {
    id: "luxury-trade",
    title: "奢侈品买手的AI军团",
    subtitle: "1人=10人团队的跨境贸易革命",
    persona: "独立奢侈品买手",
    personaTag: "跨境贸易",
    name: "Vivian",
    industry: "奢侈品批发",
    icon: ShoppingBag,
    color: "from-amber-500 to-yellow-600",
    colorBg: "bg-amber-50 dark:bg-amber-950/20",
    colorText: "text-amber-600 dark:text-amber-400",
    colorBorder: "border-amber-200 dark:border-amber-800",
    stats: [
      { value: "73%", label: "时间节省" },
      { value: "5", label: "AI Agent" },
    ],
    highlights: ["采购询价自动化", "客户服务7×24", "社媒矩阵运营"],
    htmlUrl: "/usercase/openclaw-luxury-trade-configuration-guide.html",
  },
  {
    id: "content-marketing",
    title: "内容营销超级个体的睡后收入",
    subtitle: "OpenClaw如何实现24/7无休运营",
    persona: "内容营销创始人",
    personaTag: "内容营销",
    name: "林逸飞",
    industry: "内容营销",
    icon: Megaphone,
    color: "from-orange-500 to-amber-600",
    colorBg: "bg-orange-50 dark:bg-orange-950/20",
    colorText: "text-orange-600 dark:text-orange-400",
    colorBorder: "border-orange-200 dark:border-orange-800",
    stats: [
      { value: "70%", label: "运营时间节省" },
      { value: "600%", label: "情报更新提升" },
    ],
    highlights: ["市场情报自动化", "内容分发优化", "客户沟通代理"],
    htmlUrl: "/usercase/content-marketing-automation.html",
  },
  {
    id: "indie-dev",
    title: "独立开发者的7×24小时AI分身",
    subtitle: "告别碎片化，构建全天候智能工作流",
    persona: "独立开发者",
    personaTag: "软件开发",
    name: "张明",
    industry: "软件开发",
    icon: Code2,
    color: "from-blue-500 to-indigo-600",
    colorBg: "bg-blue-50 dark:bg-blue-950/20",
    colorText: "text-blue-600 dark:text-blue-400",
    colorBorder: "border-blue-200 dark:border-blue-800",
    stats: [
      { value: "60%", label: "时间节省" },
      { value: "$0", label: "SaaS成本" },
    ],
    highlights: ["代码审查自动化", "邮件智能处理", "日程管理AI"],
    htmlUrl: "/usercase/indie-developer-workflow.html",
  },
  {
    id: "saas-sales",
    title: "替代20万美元SDR的增长引擎",
    subtitle: "AI智能体实现自主LinkedIn GTM自动化",
    persona: "销售/市场经理",
    personaTag: "SaaS销售",
    name: "Sarah Chen",
    industry: "SaaS",
    icon: TrendingUp,
    color: "from-purple-500 to-violet-600",
    colorBg: "bg-purple-50 dark:bg-purple-950/20",
    colorText: "text-purple-600 dark:text-purple-400",
    colorBorder: "border-purple-200 dark:border-purple-800",
    stats: [
      { value: "$200K", label: "年人力成本替代" },
      { value: "10x", label: "外展规模扩展" },
    ],
    highlights: ["潜在客户自动发现", "个性化外展沟通", "多步骤跟进管理"],
    htmlUrl: "/usercase/saas-sales-growth-engine.html",
  },
  {
    id: "dev-assistant",
    title: "告别工具炼狱，构建AI助手网络",
    subtitle: "独立开发者解放60%时间的秘密",
    persona: "独立开发者",
    personaTag: "效率自动化",
    name: "张帆",
    industry: "软件开发",
    icon: Zap,
    color: "from-teal-500 to-cyan-600",
    colorBg: "bg-teal-50 dark:bg-teal-950/20",
    colorText: "text-teal-600 dark:text-teal-400",
    colorBorder: "border-teal-200 dark:border-teal-800",
    stats: [
      { value: "60%", label: "时间节省" },
      { value: "~$60", label: "月成本节省" },
    ],
    highlights: ["CodeReviewBot", "MailAssistant", "ScheduleMaster"],
    htmlUrl: "/usercase/developer-ai-assistant-network.html",
  },
  {
    id: "cybersecurity",
    title: "网络安全专家的7×24自动化防护",
    subtitle: "从手动疲劳到AI赋能的超个体转型",
    persona: "网络安全顾问",
    personaTag: "网络安全",
    name: "Simon Roses Femerling",
    industry: "网络安全",
    icon: Shield,
    color: "from-red-500 to-rose-600",
    colorBg: "bg-red-50 dark:bg-red-950/20",
    colorText: "text-red-600 dark:text-red-400",
    colorBorder: "border-red-200 dark:border-red-800",
    stats: [
      { value: "50%+", label: "时间节省" },
      { value: "1-2\u20AC", label: "每日成本" },
    ],
    highlights: ["AgentX安全助理", "自动化邮件管理", "7×24网络监控"],
    htmlUrl: "/usercase/cybersecurity-automation.html",
  },
  {
    id: "supermom",
    title: "全职妈妈的AI超能力",
    subtitle: "重塑家庭与事业的平衡",
    persona: "全职妈妈兼创业者",
    personaTag: "家庭教育",
    name: "Jesse Genet",
    industry: "教育科技",
    icon: Baby,
    color: "from-pink-500 to-fuchsia-600",
    colorBg: "bg-pink-50 dark:bg-pink-950/20",
    colorText: "text-pink-600 dark:text-pink-400",
    colorBorder: "border-pink-200 dark:border-pink-800",
    stats: [
      { value: "90%", label: "流程提速" },
      { value: "75%", label: "规划时间节省" },
    ],
    highlights: ["家庭教育Agent", "财务管理Agent", "零代码应用开发"],
    htmlUrl: "/usercase/supermom-ai-empowerment.html",
  },
  {
    id: "content-creator",
    title: "独立创作者的月入破万之路",
    subtitle: "多智能体打造个人内容工厂",
    persona: "内容创作者",
    personaTag: "数字营销",
    name: "张华",
    industry: "内容创作",
    icon: Pen,
    color: "from-amber-500 to-orange-600",
    colorBg: "bg-amber-50 dark:bg-amber-950/20",
    colorText: "text-amber-600 dark:text-amber-400",
    colorBorder: "border-amber-200 dark:border-amber-800",
    stats: [
      { value: "90%", label: "人工减少" },
      { value: "5x", label: "账号翻倍" },
    ],
    highlights: ["研究智能体", "内容创作智能体", "数据分析优化"],
    htmlUrl: "/usercase/content-creator-passive-income.html",
  },
];

const steps = [
  {
    num: 1,
    title: "选择你的角色",
    desc: "浏览下方8个真实用户案例，找到与你最匹配的角色和场景",
    icon: Target,
  },
  {
    num: 2,
    title: "阅读配置指南",
    desc: "深入了解该角色的 Agent 配置方案、技能组合和工作流设计",
    icon: Bot,
  },
  {
    num: 3,
    title: "动手配置OpenClaw",
    desc: "按照指南在 OpenClaw 平台上实际配置你的 AI Agent 网络",
    icon: Rocket,
  },
  {
    num: 4,
    title: "分享你的成果",
    desc: "将你的配置实践提交到 AI In Action，与社区一起交流进步",
    icon: Users,
  },
];

export default function ActivitiesPage() {
  return (
    <div className="min-h-screen">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-background via-background to-muted/30 px-4 py-16 sm:py-24">
        {/* Decorative grid */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="relative mx-auto max-w-4xl text-center"
        >
          <motion.div variants={fadeUp}>
            <Badge
              variant="outline"
              className="mb-6 gap-1.5 px-3 py-1 text-sm"
            >
              <Rocket className="h-3.5 w-3.5" />
              OpenClaw 实践挑战
            </Badge>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
          >
            用 AI Agent 重新定义
            <br />
            <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              你的工作方式
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed"
          >
            8 个真实用户案例，8 种 AI Agent 配置方案。
            <br />
            选择你的角色，跟随配置指南，亲手搭建属于自己的 OpenClaw
            自动化工作流。
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex justify-center gap-4">
            <Button size="lg" asChild>
              <a href="#cases">
                浏览案例
                <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a
                href="https://openclaw.ai"
                target="_blank"
                rel="noopener noreferrer"
              >
                了解 OpenClaw
                <ExternalLink className="ml-1 h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/challenges/openclaw">
                参与挑战
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeUp}
            className="mx-auto mt-12 grid max-w-lg grid-cols-3 gap-8"
          >
            {[
              { value: "8", label: "用户案例" },
              { value: "30+", label: "Agent配置" },
              { value: "60%+", label: "平均效率提升" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold tracking-tight">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── How to Participate ── */}
      <section className="border-b px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="text-center"
          >
            <motion.h2
              variants={fadeUp}
              className="text-2xl font-bold tracking-tight sm:text-3xl"
            >
              如何参与挑战
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mt-3 text-muted-foreground"
            >
              四步完成你的 OpenClaw 实践之旅
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {steps.map((step) => (
              <motion.div key={step.num} variants={scaleIn}>
                <div className="group relative rounded-xl border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-md">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
                      {step.num}
                    </div>
                    <step.icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
                  </div>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── User Cases Grid ── */}
      <section id="cases" className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="text-center"
          >
            <motion.h2
              variants={fadeUp}
              className="text-2xl font-bold tracking-tight sm:text-3xl"
            >
              选择你的角色，开始挑战
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mt-3 text-muted-foreground"
            >
              每个案例都包含完整的 Agent 配置方案和实施指南
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {userCases.map((uc) => (
              <motion.div key={uc.id} variants={scaleIn}>
                <a
                  href={uc.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block h-full"
                >
                  <div
                    className={`relative h-full overflow-hidden rounded-xl border ${uc.colorBorder} bg-card transition-all hover:shadow-xl hover:-translate-y-1`}
                  >
                    {/* Color gradient top bar */}
                    <div
                      className={`h-1.5 bg-gradient-to-r ${uc.color}`}
                    />

                    <div className="p-5">
                      {/* Icon + persona badge */}
                      <div className="flex items-start justify-between">
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-lg ${uc.colorBg}`}
                        >
                          <uc.icon
                            className={`h-5 w-5 ${uc.colorText}`}
                          />
                        </div>
                        <Badge
                          variant="outline"
                          className={`text-[10px] ${uc.colorText} ${uc.colorBorder}`}
                        >
                          {uc.personaTag}
                        </Badge>
                      </div>

                      {/* Title */}
                      <h3 className="mt-4 font-semibold leading-snug group-hover:text-primary transition-colors">
                        {uc.title}
                      </h3>
                      <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                        {uc.subtitle}
                      </p>

                      {/* Persona info */}
                      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">
                          {uc.name}
                        </span>
                        <span>·</span>
                        <span>{uc.persona}</span>
                      </div>

                      {/* Stats */}
                      <div className="mt-4 flex gap-4">
                        {uc.stats.map((stat) => (
                          <div key={stat.label}>
                            <div
                              className={`text-lg font-bold ${uc.colorText}`}
                            >
                              {stat.value}
                            </div>
                            <div className="text-[10px] text-muted-foreground">
                              {stat.label}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Highlights */}
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {uc.highlights.map((h) => (
                          <span
                            key={h}
                            className="inline-flex items-center gap-1 rounded-md bg-muted/50 px-2 py-0.5 text-[10px] text-muted-foreground"
                          >
                            <CheckCircle2 className="h-2.5 w-2.5" />
                            {h}
                          </span>
                        ))}
                      </div>

                      {/* CTA */}
                      <div className="mt-5 flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                        查看配置指南
                        <ArrowRight className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </div>
                </a>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="border-t bg-muted/30 px-4 py-16 sm:py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.div variants={fadeUp}>
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-3xl">
              🦞
            </div>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="text-2xl font-bold tracking-tight sm:text-3xl"
          >
            准备好开始你的 OpenClaw 之旅了吗？
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-4 text-muted-foreground leading-relaxed"
          >
            OpenClaw（小龙虾 🦞）是 2026 年 GitHub
            增长最快的开源 AI Agent 项目。
            <br />
            无论你是开发者、营销人、创业者还是自由职业者，
            都能找到属于你的 AI 自动化方案。
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Button size="lg" asChild>
              <a
                href="https://openclaw.ai"
                target="_blank"
                rel="noopener noreferrer"
              >
                访问 OpenClaw 官网
                <ExternalLink className="ml-1 h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a
                href="https://github.com/nicepkg/openclaw"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub 开源仓库
                <ExternalLink className="ml-1 h-4 w-4" />
              </a>
            </Button>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="mt-6 text-xs text-muted-foreground"
          >
            加入 OpenClaw 社区：openclaw.ai · Discord
          </motion.p>
        </motion.div>
      </section>
    </div>
  );
}
