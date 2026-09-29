import { Reveal, RevealGroup, RevealItem, SpotlightCard } from "@/components/motion";
import { HMS_MODULES } from "@/config/modules";

/**
 * What the system will cover, with an honest status on every module.
 * Nothing here is shipped yet, so every card says so.
 */
export function ModulesSection() {
  return (
    <section
      aria-labelledby="modules-heading"
      id="modules"
      className="flex min-h-svh items-center border-b bg-card py-20"
    >
      <div className="mx-auto w-full max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-2xl space-y-4">
          <h2
            id="modules-heading"
            className="text-3xl font-bold tracking-tight sm:text-4xl"
          >
            What the system covers
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Every module works from the same patient record and the same staff
            permissions. The foundation (sign-in, access control and the application
            shell) is in place; the modules below are being built one at a time.
          </p>
        </Reveal>

        <RevealGroup
          as="ul"
          stagger={0.05}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {HMS_MODULES.map(({ icon: Icon, title, summary }) => (
            <RevealItem as="li" key={title}>
              <SpotlightCard className="flex h-full flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <Icon aria-hidden className="size-6 text-primary" />
                  <span className="rounded-sm border px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
                    Planned
                  </span>
                </div>
                <h3 className="mt-4 text-base font-semibold">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {summary}
                </p>
              </SpotlightCard>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
