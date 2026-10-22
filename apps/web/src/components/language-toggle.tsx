import { Languages } from "lucide-react";
import { Button } from "#/components/ui/button";
import { useI18n } from "#/lib/i18n";

export default function LanguageToggle() {
  const { locale, toggleLocale } = useI18n();
  const label =
    locale === "en"
      ? "Language: English. Click to switch to Chinese (切换到中文)."
      : "当前语言：中文。点击切换到英文 (Switch to English).";

  return (
    <Button
      aria-label={label}
      onClick={toggleLocale}
      size="sm"
      title={label}
      type="button"
      variant="outline"
    >
      <Languages />
      {locale === "en" ? "EN / 中文" : "中文 / EN"}
    </Button>
  );
}
