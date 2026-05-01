export function ContactForm() {
  return (
    <section id="trial-form" className="panel-dark grid gap-4 p-6 sm:p-8">
      <div>
        <p className="eyebrow">Get In Touch</p>
        <h3 className="font-heading text-3xl uppercase tracking-[0.12em] text-[color:var(--chalk)]">
          Contact the academy directly.
        </h3>
      </div>
      <p className="text-base leading-7 text-[color:var(--fog)]">
        This site no longer sends form submissions anywhere. To book a trial or ask a question, contact Attic Jiu Jitsu directly using the details below.
      </p>
      <div className="grid gap-3 text-base text-[color:var(--fog)]">
        <a href="tel:+353858447393" className="button-primary w-full sm:w-fit">
          Call 085 844 7393
        </a>
        <a href="mailto:bconnolly85@hotmail.com" className="button-secondary w-full sm:w-fit">
          Email bconnolly85@hotmail.com
        </a>
      </div>
    </section>
  );
}
