"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { CompletionResult } from "@/actions/completions";
import { useTranslations } from "next-intl";

type Props = {
  open: boolean;
  onClose: () => void;
  result: CompletionResult | null;
  onSubmitReflection: (reflection: string, isPublic: boolean) => void;
};

export function CompletionModal({ open, onClose, result, onSubmitReflection }: Props) {
  const t = useTranslations("gamification");
  const tl = useTranslations("levels");
  const [reflection, setReflection] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  if (!result) return null;

  const handleSubmit = () => {
    if (reflection.trim()) {
      onSubmitReflection(reflection.trim(), isPublic);
    }
    onClose();
  };

  const handleClose = () => {
    setReflection("");
    setIsPublic(true);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="text-center sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            {t("challengeCompleted")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* XP gained */}
          <AnimatePresence>
            {result.xpGained > 0 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", duration: 0.5, delay: 0.1 }}
                className="text-4xl font-bold text-primary"
              >
                +{result.xpGained} {t("xp")}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Level info */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-1"
          >
            {result.leveledUp ? (
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">{t("levelUp")}</div>
                <div
                  className="text-lg font-bold"
                  style={{ color: result.levelColor }}
                >
                  Lv.{result.newLevel} {tl(String(result.newLevel))}
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                Lv.{result.newLevel}{" "}
                <span style={{ color: result.levelColor }}>
                  {tl(String(result.newLevel))}
                </span>{" "}
                &middot; {result.newXP} {t("xp")}
              </div>
            )}
          </motion.div>

          {/* New achievements */}
          {result.newAchievements.length > 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="space-y-3"
            >
              <div className="text-sm font-medium text-muted-foreground">
                {t("achievementsUnlocked")}
              </div>
              <div className="space-y-2">
                {result.newAchievements.map((a) => (
                  <motion.div
                    key={a.slug}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-center justify-center gap-2 rounded-lg border border-primary/20 bg-primary/5 p-2"
                  >
                    <span className="text-xl">{a.icon}</span>
                    <span className="text-sm font-medium">{a.name}</span>
                    <span className="text-xs text-primary">+{a.xpReward} {t("xp")}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Reflection input */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="space-y-3 text-left"
          >
            <Textarea
              placeholder={t("reflectionPlaceholder")}
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              rows={3}
              className="resize-none"
            />
            <div className="flex items-center gap-2">
              <Checkbox
                id="isPublic"
                checked={isPublic}
                onCheckedChange={(checked) => setIsPublic(checked === true)}
              />
              <Label htmlFor="isPublic" className="text-sm text-muted-foreground cursor-pointer">
                {t("sharePublicly")}
              </Label>
            </div>
          </motion.div>
        </div>

        <DialogFooter className="sm:justify-center gap-2">
          <Button variant="outline" onClick={handleClose}>
            {t("skipReflection")}
          </Button>
          <Button onClick={handleSubmit}>
            {reflection.trim() ? t("submitReflection") : t("skipReflection")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
