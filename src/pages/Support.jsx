import { useState } from "react";
import { api, formatApiError } from "../lib/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { toast } from "sonner";
import { MessageCircle, Mail, Send, ShieldCheck } from "lucide-react";
import { useI18n } from "../contexts/I18nContext";

export default function Support() {
  const { t } = useI18n();
  const FAQ = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
    { q: t("faq.q4"), a: t("faq.a4") },
  ];
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/contact", form);
      toast.success(t("common.send"));
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="support-page" className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10">
      <div className="border-b border-zinc-200 pb-10 mb-12">
        <div className="label-eyebrow mb-2">{t("support.eyebrow")}</div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight">{t("support.title")}</h1>
        <p className="text-zinc-600 mt-3 max-w-2xl">{t("support.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-5 space-y-4">
          <ContactCard
            icon={MessageCircle}
            label={t("support.tg_label")}
            value="@xiaoya_ai"
            desc={t("support.tg_desc")}
          />
          <ContactCard
            icon={Mail}
            label={t("support.email_label")}
            value="support@xiaoya-ai.com"
            desc={t("support.email_desc")}
          />
          <ContactCard
            icon={ShieldCheck}
            label={t("support.guarantee")}
            value={t("support.guarantee_v")}
            desc={t("support.guarantee_d")}
          />

          <div className="border border-zinc-200 p-6">
            <div className="label-eyebrow mb-4">{t("faq.eyebrow")}</div>
            <Accordion type="single" collapsible data-testid="support-faq">
              {FAQ.map((f, i) => (
                <AccordionItem key={i} value={`f-${i}`}>
                  <AccordionTrigger className="text-sm font-bold text-left hover:no-underline">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-zinc-600">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        <form
          onSubmit={submit}
          data-testid="contact-form"
          className="md:col-span-7 border border-zinc-200 p-8 space-y-5"
        >
          <h2 className="font-black text-2xl">{t("support.form_title")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-xs label-eyebrow">{t("common.name")}</Label>
              <Input
                id="name"
                data-testid="contact-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="rounded-none border-zinc-300 mt-2 h-11"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-xs label-eyebrow">{t("common.email")}</Label>
              <Input
                id="email"
                type="email"
                data-testid="contact-email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="rounded-none border-zinc-300 mt-2 h-11"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="subject" className="text-xs label-eyebrow">{t("common.subject")}</Label>
            <Input
              id="subject"
              data-testid="contact-subject"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              required
              className="rounded-none border-zinc-300 mt-2 h-11"
            />
          </div>
          <div>
            <Label htmlFor="message" className="text-xs label-eyebrow">{t("common.message")}</Label>
            <Textarea
              id="message"
              data-testid="contact-message"
              rows={6}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
              className="rounded-none border-zinc-300 mt-2"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            data-testid="contact-submit"
            className="rounded-none bg-zinc-900 hover:bg-blue-600 text-white h-12 w-full sm:w-auto px-8"
          >
            {loading ? t("common.loading") : (<><Send className="w-4 h-4 mr-2" /> {t("common.send")}</>)}
          </Button>
        </form>
      </div>
    </div>
  );
}

function ContactCard({ icon: Icon, label, value, desc }) {
  return (
    <div className="border border-zinc-200 p-5 flex items-start gap-4">
      <div className="w-10 h-10 bg-zinc-900 text-white grid place-items-center shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="label-eyebrow">{label}</div>
        <div className="font-bold text-base mt-1">{value}</div>
        <div className="text-xs text-zinc-500 mt-0.5">{desc}</div>
      </div>
    </div>
  );
}
