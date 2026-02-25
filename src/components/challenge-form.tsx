"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createChallenge, updateChallenge } from "@/actions/challenges";
import { useTranslations } from "next-intl";

type Category = {
  id: string;
  slug: string;
  name: string;
};

type DefaultValues = {
  title: string;
  description: string;
  difficulty: string;
  categoryId: string | null;
  tags: string[];
  objectives: string[];
  hints: string[];
  resources: string[];
  estimatedTime: string | null;
};

type Props = {
  categories: Category[];
  defaultValues?: DefaultValues;
  challengeId?: string;
};

export function ChallengeForm({ categories, defaultValues, challengeId }: Props) {
  const isEdit = !!challengeId;
  const t = useTranslations("challengeForm");
  const td = useTranslations("difficulty");

  const [objectives, setObjectives] = useState<string[]>(
    defaultValues?.objectives.length ? defaultValues.objectives : [""]
  );
  const [hints, setHints] = useState<string[]>(
    defaultValues?.hints.length ? defaultValues.hints : [""]
  );
  const [resources, setResources] = useState<string[]>(
    defaultValues?.resources.length ? defaultValues.resources : [""]
  );

  const addItem = (setter: typeof setObjectives) => {
    setter((prev) => [...prev, ""]);
  };

  const removeItem = (setter: typeof setObjectives, index: number) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  const updateItem = (setter: typeof setObjectives, index: number, value: string) => {
    setter((prev) => prev.map((item, i) => (i === index ? value : item)));
  };

  const handleAction = isEdit
    ? updateChallenge.bind(null, challengeId!)
    : createChallenge;

  return (
    <form action={handleAction} className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1.5">
          {t("titleLabel")} {t("required")}
        </label>
        <Input
          id="title"
          name="title"
          required
          defaultValue={defaultValues?.title}
          placeholder={t("titlePlaceholder")}
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1.5">
          {t("descriptionLabel")} {t("required")}
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          defaultValue={defaultValues?.description}
          placeholder={t("descriptionPlaceholder")}
          className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
        />
      </div>

      {/* Difficulty + Category row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium mb-1.5">
            {t("difficultyLabel")} {t("required")}
          </label>
          <select
            id="difficulty"
            name="difficulty"
            required
            defaultValue={defaultValues?.difficulty || ""}
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="" disabled>{t("selectDifficulty")}</option>
            <option value="BEGINNER">{td("BEGINNER")}</option>
            <option value="INTERMEDIATE">{td("INTERMEDIATE")}</option>
            <option value="ADVANCED">{td("ADVANCED")}</option>
            <option value="EXPERT">{td("EXPERT")}</option>
          </select>
        </div>

        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium mb-1.5">
            {t("categoryLabel")}
          </label>
          <select
            id="categoryId"
            name="categoryId"
            defaultValue={defaultValues?.categoryId || ""}
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="">{t("noCategory")}</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tags */}
      <div>
        <label htmlFor="tags" className="block text-sm font-medium mb-1.5">
          {t("tagsLabel")}
        </label>
        <Input
          id="tags"
          name="tags"
          defaultValue={defaultValues?.tags.join(", ")}
          placeholder={t("tagsPlaceholder")}
        />
      </div>

      {/* Estimated Time */}
      <div>
        <label htmlFor="estimatedTime" className="block text-sm font-medium mb-1.5">
          {t("estimatedTimeLabel")}
        </label>
        <Input
          id="estimatedTime"
          name="estimatedTime"
          defaultValue={defaultValues?.estimatedTime || ""}
          placeholder={t("estimatedTimePlaceholder")}
        />
      </div>

      {/* Objectives */}
      <DynamicList
        label={t("objectivesLabel")}
        addLabel={t("addObjective")}
        name="objectives"
        items={objectives}
        placeholder={t("objectivesPlaceholder")}
        onAdd={() => addItem(setObjectives)}
        onRemove={(i) => removeItem(setObjectives, i)}
        onChange={(i, v) => updateItem(setObjectives, i, v)}
      />

      {/* Hints */}
      <DynamicList
        label={t("hintsLabel")}
        addLabel={t("addHint")}
        name="hints"
        items={hints}
        placeholder={t("hintsPlaceholder")}
        onAdd={() => addItem(setHints)}
        onRemove={(i) => removeItem(setHints, i)}
        onChange={(i, v) => updateItem(setHints, i, v)}
      />

      {/* Resources */}
      <DynamicList
        label={t("resourcesLabel")}
        addLabel={t("addResource")}
        name="resources"
        items={resources}
        placeholder={t("resourcesPlaceholder")}
        onAdd={() => addItem(setResources)}
        onRemove={(i) => removeItem(setResources, i)}
        onChange={(i, v) => updateItem(setResources, i, v)}
      />

      {/* Submit */}
      <div className="flex justify-end pt-4">
        <Button type="submit" size="lg">
          {isEdit ? t("updateButton") : t("createButton")}
        </Button>
      </div>
    </form>
  );
}

function DynamicList({
  label,
  addLabel,
  name,
  items,
  placeholder,
  onAdd,
  onRemove,
  onChange,
}: {
  label: string;
  addLabel: string;
  name: string;
  items: string[];
  placeholder: string;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, value: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <Input
              name={name}
              value={item}
              onChange={(e) => onChange(i, e.target.value)}
              placeholder={placeholder}
            />
            {items.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onRemove(i)}
                className="shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onAdd}
        className="mt-2 gap-1"
      >
        <Plus className="h-3.5 w-3.5" />
        {addLabel}
      </Button>
    </div>
  );
}
