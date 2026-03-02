"use client";

import { Suspense, lazy, useRef, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
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
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

const Hero3DScene = lazy(
  () => import("@/components/activities/hero-3d-scene")
);

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
    colorBg: "bg-amber-500/10",
    colorText: "text-amber-400",
    colorBorder: "border-amber-500/30",
    glowColor: "#f59e0b",
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
    colorBg: "bg-orange-500/10",
    colorText: "text-orange-400",
    colorBorder: "border-orange-500/30",
    glowColor: "#f97316",
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
    colorBg: "bg-blue-500/10",
    colorText: "text-blue-400",
    colorBorder: "border-blue-500/30",
    glowColor: "#3b82f6",
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
    colorBg: "bg-purple-500/10",
    colorText: "text-purple-400",
    colorBorder: "border-purple-500/30",
    glowColor: "#a855f7",
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
    colorBg: "bg-teal-500/10",
    colorText: "text-teal-400",
    colorBorder: "border-teal-500/30",
    glowColor: "#14b8a6",
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
    colorBg: "bg-red-500/10",
    colorText: "text-red-400",
    colorBorder: "border-red-500/30",
    glowColor: "#ef4444",
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
    colorBg: "bg-pink-500/10",
    colorText: "text-pink-400",
    colorBorder: "border-pink-500/30",
    glowColor: "#ec4899",
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
    colorBg: "bg-amber-500/10",
    colorText: "text-amber-400",
    colorBorder: "border-amber-500/30",
    glowColor: "#d97706",
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
    color: "from-violet-500 to-purple-600",
  },
  {
    num: 2,
    title: "阅读配置指南",
    desc: "深入了解该角色的 Agent 配置方案、技能组合和工作流设计",
    icon: Bot,
    color: "from-blue-500 to-cyan-600",
  },
  {
    num: 3,
    title: "动手配置OpenClaw",
    desc: "按照指南在 OpenClaw 平台上实际配置你的 AI Agent 网络",
    icon: Rocket,
    color: "from-orange-500 to-amber-600",
  },
  {
    num: 4,
    title: "分享你的成果",
    desc: "将你的配置实践提交到 AI In Action，与社区一起交流进步",
    icon: Users,
    color: "from-emerald-500 to-teal-600",
  },
];

/* ── Glassmorphism Step Card ── */
function GlassStepCard({
  step,
}: {
  step: (typeof steps)[number];
}) {
  return (
    <motion.div variants={scaleIn}>
      <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-500 hover:border-white/20 hover:bg-white/10 hover:shadow-2xl hover:shadow-purple-500/5">
        {/* Background gradient glow */}
        <div
          className={`absolute -top-20 -right-20 h-40 w-40 rounded-full bg-gradient-to-br ${step.color} opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-20`}
        />

        <div className="relative z-10">
          <div className="mb-4 flex items-center gap-3">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${step.color} text-lg font-bold text-white shadow-lg`}
            >
              {step.num}
            </div>
            <step.icon className="h-5 w-5 text-white/40 transition-colors group-hover:text-white/70" />
          </div>
          <h3 className="font-semibold text-white/90">{step.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-white/50">
            {step.desc}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Glowing Case Card with 3D Tilt ── */
function GlowingCaseCard({ uc }: { uc: (typeof userCases)[number] }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { stiffness: 300, damping: 30 };
  const xSpring = useSpring(mouseX, springConfig);
  const ySpring = useSpring(mouseY, springConfig);

  const rotateX = useTransform(ySpring, [0, 1], [5, -5]);
  const rotateY = useTransform(xSpring, [0, 1], [-5, 5]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <motion.div variants={scaleIn}>
      <a
        href={uc.htmlUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group block h-full"
      >
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          className="relative h-full"
        >
          <div
            className={`relative h-full overflow-hidden rounded-2xl border ${uc.colorBorder} bg-black/40 backdrop-blur-xl transition-all duration-500 hover:shadow-2xl`}
            style={{
              boxShadow: `0 0 0 1px ${uc.glowColor}15`,
            }}
          >
            {/* Animated gradient top bar */}
            <div className="relative h-1.5 overflow-hidden">
              <div
                className={`absolute inset-0 bg-gradient-to-r ${uc.color}`}
              />
              <div
                className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent"
                style={{
                  backgroundSize: "200% 100%",
                }}
              />
            </div>

            {/* Hover glow overlay */}
            <div
              className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background: `radial-gradient(circle at 50% 0%, ${uc.glowColor}15 0%, transparent 60%)`,
              }}
            />

            <div className="relative z-10 p-5">
              {/* Icon + persona badge */}
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${uc.colorBg} ring-1 ring-white/5`}
                >
                  <uc.icon className={`h-5 w-5 ${uc.colorText}`} />
                </div>
                <Badge
                  variant="outline"
                  className={`border-white/10 text-[10px] ${uc.colorText} backdrop-blur-sm`}
                >
                  {uc.personaTag}
                </Badge>
              </div>

              {/* Title */}
              <h3 className="mt-4 font-semibold leading-snug text-white/90 transition-colors group-hover:text-white">
                {uc.title}
              </h3>
              <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-white/40">
                {uc.subtitle}
              </p>

              {/* Persona info */}
              <div className="mt-3 flex items-center gap-2 text-xs text-white/30">
                <span className="font-medium text-white/60">{uc.name}</span>
                <span>·</span>
                <span>{uc.persona}</span>
              </div>

              {/* Stats */}
              <div className="mt-4 flex gap-6">
                {uc.stats.map((stat) => (
                  <div key={stat.label}>
                    <div className={`text-lg font-bold ${uc.colorText}`}>
                      {stat.value}
                    </div>
                    <div className="text-[10px] text-white/30">
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
                    className="inline-flex items-center gap-1 rounded-md border border-white/5 bg-white/5 px-2 py-0.5 text-[10px] text-white/40"
                  >
                    <CheckCircle2 className="h-2.5 w-2.5" />
                    {h}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-5 flex items-center gap-1 text-sm font-medium text-white/0 transition-all duration-300 group-hover:text-white/80">
                查看配置指南
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </motion.div>
      </a>
    </motion.div>
  );
}

/* ── Main Page ── */
export default function ActivitiesPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Ambient background gradients */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute left-1/4 top-0 h-[600px] w-[600px] rounded-full bg-purple-600/8 blur-[120px]" />
        <div className="absolute right-1/4 top-1/3 h-[500px] w-[500px] rounded-full bg-blue-600/6 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-pink-600/5 blur-[120px]" />
      </div>

      {/* ── Hero Section with 3D Scene ── */}
      <section className="relative min-h-[90vh] overflow-hidden">
        {/* 3D Background */}
        <Suspense
          fallback={
            <div className="absolute inset-0 bg-gradient-to-b from-purple-950/20 to-transparent" />
          }
        >
          <Hero3DScene />
        </Suspense>

        {/* Vignette overlay for readability */}
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-[#0a0a0f]/30 via-transparent to-[#0a0a0f]" />

        {/* Content overlay */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="relative z-10 flex min-h-[90vh] flex-col items-center justify-center px-4 py-16 sm:py-24"
        >
          <motion.div variants={fadeUp}>
            <Badge
              variant="outline"
              className="mb-6 gap-1.5 border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/70 backdrop-blur-sm"
            >
              <Sparkles className="h-3.5 w-3.5 text-purple-400" />
              OpenClaw 实践挑战
            </Badge>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="max-w-4xl text-center text-4xl font-bold tracking-tight sm:text-5xl lg:text-7xl"
          >
            <span className="text-white/90">用 AI Agent 重新定义</span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
              你的工作方式
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-6 max-w-2xl text-center text-lg leading-relaxed text-white/40"
          >
            8 个真实用户案例，8 种 AI Agent 配置方案。
            <br />
            选择你的角色，跟随配置指南，亲手搭建属于自己的 OpenClaw
            自动化工作流。
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25 transition-shadow hover:shadow-xl hover:shadow-purple-500/30"
              asChild
            >
              <a href="#cases">
                浏览案例
                <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/10 bg-white/5 text-white/70 backdrop-blur-sm hover:bg-white/10 hover:text-white"
              asChild
            >
              <a
                href="https://openclaw.ai"
                target="_blank"
                rel="noopener noreferrer"
              >
                了解 OpenClaw
                <ExternalLink className="ml-1 h-4 w-4" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/10 bg-white/5 text-white/70 backdrop-blur-sm hover:bg-white/10 hover:text-white"
              asChild
            >
              <Link href="/challenges/openclaw">
                参与挑战
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          {/* Stats with glassmorphism */}
          <motion.div
            variants={fadeUp}
            className="mx-auto mt-16 grid max-w-lg grid-cols-3 gap-8"
          >
            {[
              { value: "8", label: "用户案例" },
              { value: "30+", label: "Agent配置" },
              { value: "60%+", label: "平均效率提升" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center"
              >
                <div className="bg-gradient-to-br from-white to-white/60 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-white/30">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            variants={fadeUp}
            className="mt-12"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center gap-2 text-white/20"
            >
              <span className="text-xs">向下滚动</span>
              <div className="h-8 w-[1px] bg-gradient-to-b from-white/20 to-transparent" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── How to Participate — Glass Cards ── */}
      <section className="relative z-10 px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="text-center"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2">
              <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-purple-500/50" />
              <span className="text-sm font-medium uppercase tracking-wider text-purple-400/70">
                How to participate
              </span>
              <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-purple-500/50" />
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="mt-4 text-2xl font-bold tracking-tight text-white/90 sm:text-4xl"
            >
              如何参与挑战
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mt-3 text-white/40"
            >
              四步完成你的 OpenClaw 实践之旅
            </motion.p>
          </motion.div>

          {/* Steps flow line */}
          <div className="relative mt-14">
            {/* Connecting line (visible on lg) */}
            <div className="pointer-events-none absolute left-0 right-0 top-10 z-0 hidden h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent lg:block" />

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
              className="relative z-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            >
              {steps.map((step) => (
                <GlassStepCard key={step.num} step={step} />
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── User Cases Grid — Glowing Cards ── */}
      <section id="cases" className="relative z-10 px-4 py-20 sm:py-28">
        {/* Section background glow */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[1px] w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="text-center"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2">
              <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-amber-500/50" />
              <span className="text-sm font-medium uppercase tracking-wider text-amber-400/70">
                User Cases
              </span>
              <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-amber-500/50" />
            </motion.div>

            <motion.h2
              variants={fadeUp}
              className="mt-4 text-2xl font-bold tracking-tight text-white/90 sm:text-4xl"
            >
              选择你的角色，开始挑战
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mt-3 text-white/40"
            >
              每个案例都包含完整的 Agent 配置方案和实施指南
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {userCases.map((uc) => (
              <GlowingCaseCard key={uc.id} uc={uc} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA Section — Glow Button ── */}
      <section className="relative z-10 px-4 py-20 sm:py-28">
        {/* Divider */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-[1px] w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="mx-auto max-w-2xl text-center"
        >
          {/* Animated glow orb */}
          <motion.div variants={fadeUp} className="relative mx-auto mb-8 h-20 w-20">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 blur-xl"
            />
            <div className="relative flex h-full w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-4xl backdrop-blur-sm">
              🦞
            </div>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="text-2xl font-bold tracking-tight text-white/90 sm:text-4xl"
          >
            准备好开始你的{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              OpenClaw
            </span>{" "}
            之旅了吗？
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-4 leading-relaxed text-white/40"
          >
            OpenClaw（小龙虾 🦞）是 2026 年 GitHub
            增长最快的开源 AI Agent 项目。
            <br />
            无论你是开发者、营销人、创业者还是自由职业者，
            都能找到属于你的 AI 自动化方案。
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            {/* Primary CTA with pulse glow */}
            <div className="group relative">
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -inset-1 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 blur-lg transition-opacity group-hover:opacity-100"
              />
              <Button
                size="lg"
                className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25"
                asChild
              >
                <a
                  href="https://openclaw.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  访问 OpenClaw 官网
                  <ExternalLink className="ml-1 h-4 w-4" />
                </a>
              </Button>
            </div>

            <Button
              size="lg"
              variant="outline"
              className="border-white/10 bg-white/5 text-white/70 backdrop-blur-sm hover:bg-white/10 hover:text-white"
              asChild
            >
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
            className="mt-8 text-xs text-white/20"
          >
            加入 OpenClaw 社区：openclaw.ai · Discord
          </motion.p>
        </motion.div>
      </section>

      {/* Shimmer animation keyframes */}
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
