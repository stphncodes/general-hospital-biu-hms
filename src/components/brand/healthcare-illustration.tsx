import { cn } from "@/lib/utils";

/*
 * Original flat illustrations for public/auth pages. Colours come only from
 * design tokens: backdrop shapes use semantic tokens (so they follow the
 * theme), people and equipment use the fixed brand palette. Decorative only:
 * every scene is hidden from assistive technology.
 */

type Outfit = "coat" | "scrubs";

const ECG_PATH = "M14 50 H40 L48 32 L58 66 L66 40 L72 50 H116";

/**
 * A standing clinician holding a tablet, drawn in a 120×290 box with the
 * feet on the bottom edge. Position with `transform`.
 */
function Clinician({ outfit, transform }: { outfit: Outfit; transform: string }) {
  const coat = outfit === "coat";
  const top = "fill-hms-primary";
  const trousers = coat ? "fill-hms-navy" : "fill-hms-primary-hover";
  const sleeve = coat ? "stroke-hms-surface" : "stroke-hms-primary";
  const forearm = coat ? "stroke-hms-surface" : "stroke-hms-skin";

  return (
    <g transform={transform}>
      {/* Legs and shoes */}
      <rect x="35" y="190" width="22" height="92" rx="6" className={trousers} />
      <rect x="63" y="190" width="22" height="92" rx="6" className={trousers} />
      <rect x="29" y="276" width="30" height="12" rx="6" className="fill-hms-navy" />
      <rect x="61" y="276" width="30" height="12" rx="6" className="fill-hms-navy" />

      {/* Neck and torso */}
      <rect x="52" y="50" width="16" height="18" rx="4" className="fill-hms-skin-shade" />
      <path d="M26 72 Q60 56 94 72 L100 200 L20 200 Z" className={top} />
      <path d="M50 62 L60 84 L70 62 Z" className="fill-hms-skin-shade" />

      {coat && (
        <g className="fill-hms-surface stroke-hms-border-strong" strokeWidth="1.5">
          <path d="M24 72 Q38 62 52 60 L60 92 L58 212 L16 212 L12 124 Z" />
          <path d="M96 72 Q82 62 68 60 L60 92 L62 212 L104 212 L108 124 Z" />
        </g>
      )}

      {/* Arms bent towards the tablet (outline stroke under coat sleeves) */}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {coat && (
          <g className="stroke-hms-border-strong" strokeWidth="19">
            <path d="M28 80 L18 142 L50 132" />
            <path d="M92 80 L102 142 L72 134" />
          </g>
        )}
        <g className={sleeve} strokeWidth="16">
          <path d="M28 80 L18 142" />
          <path d="M92 80 L102 142" />
        </g>
        <g className={forearm} strokeWidth={coat ? 16 : 12}>
          <path d="M18 142 L50 132" />
          <path d="M102 142 L72 134" />
        </g>
      </g>

      {/* Stethoscope */}
      <g fill="none" className="stroke-hms-navy" strokeWidth="3" strokeLinecap="round">
        <path d="M50 60 Q44 88 58 98" />
        <path d="M70 60 Q76 88 62 98" />
      </g>
      <circle cx="60" cy="101" r="4.5" className="fill-hms-navy" />

      {/* Tablet */}
      <g transform="rotate(-8 62 128)">
        <rect x="42" y="106" width="40" height="50" rx="4" className="fill-hms-navy" />
        <rect
          x="46"
          y="110"
          width="32"
          height="42"
          rx="2"
          className="fill-hms-primary-light"
        />
        <g className="fill-hms-surface">
          <rect x="50" y="116" width="18" height="3" rx="1.5" />
          <rect x="50" y="123" width="24" height="3" rx="1.5" opacity="0.7" />
          <rect x="50" y="130" width="14" height="3" rx="1.5" opacity="0.7" />
        </g>
      </g>
      <circle cx="50" cy="133" r="7" className="fill-hms-skin" />
      <circle cx="72" cy="135" r="7" className="fill-hms-skin" />

      {/* Head */}
      <circle cx="60" cy="32" r="22" className="fill-hms-skin" />
      {coat ? (
        <path
          d="M38 30 C37 12 50 5 62 5 C76 5 85 14 83 30 C78 21 70 17 60 18 C50 19 42 24 38 30 Z"
          className="fill-hms-hair"
        />
      ) : (
        <g className="fill-hms-hair">
          <circle cx="60" cy="4" r="10" />
          <path d="M37 38 C33 14 48 8 60 8 C74 8 88 14 83 38 C80 26 72 20 60 20 C48 20 40 26 37 38 Z" />
        </g>
      )}
    </g>
  );
}

function WardScene() {
  return (
    <>
      {/* Room */}
      <path
        d="M72 110 C72 56 118 30 186 30 L476 30 C540 30 580 66 580 130 L580 340 C580 400 546 430 480 430 L130 430 C74 430 40 398 40 342 Z"
        className="fill-primary-soft"
      />
      <line
        x1="40"
        y1="420"
        x2="580"
        y2="420"
        className="stroke-primary/15"
        strokeWidth="2"
      />

      {/* Window */}
      <rect x="96" y="70" width="150" height="130" rx="6" className="fill-card" />
      <g className="stroke-primary/20" strokeWidth="3">
        <rect x="96" y="70" width="150" height="130" rx="6" fill="none" />
        <line x1="171" y1="70" x2="171" y2="200" />
        <line x1="96" y1="135" x2="246" y2="135" />
      </g>

      {/* Patient monitor */}
      <g transform="translate(420 66)">
        <rect x="60" y="86" width="10" height="20" className="fill-hms-navy" />
        <rect width="130" height="88" rx="8" className="fill-hms-navy" />
        <rect
          x="16"
          y="14"
          width="26"
          height="4"
          rx="2"
          className="fill-hms-primary-light/60"
        />
        <circle
          cx="112"
          cy="16"
          r="3.5"
          className="animate-pulse fill-hms-primary-light"
        />
        <g fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Faint static trace keeps the screen readable between sweeps. */}
          <path d={ECG_PATH} className="stroke-hms-primary-light/25" />
          <path
            d={ECG_PATH}
            pathLength={1}
            className="animate-ecg stroke-hms-primary-light"
          />
        </g>
      </g>

      {/* IV stand */}
      <g className="stroke-hms-muted" strokeWidth="4" strokeLinecap="round">
        <line x1="330" y1="108" x2="330" y2="408" />
        <line x1="314" y1="108" x2="346" y2="108" />
        <line x1="306" y1="410" x2="354" y2="410" />
      </g>
      <rect
        x="316"
        y="116"
        width="28"
        height="46"
        rx="6"
        className="fill-hms-surface stroke-hms-primary-light"
        strokeWidth="1.5"
      />
      <rect
        x="320"
        y="134"
        width="20"
        height="24"
        rx="4"
        className="fill-hms-primary-light/40"
      />
      <path
        d="M330 162 C330 220 380 236 430 290"
        fill="none"
        strokeWidth="2"
        className="stroke-hms-primary-light/60"
      />

      {/* Bed */}
      <rect x="548" y="222" width="18" height="150" rx="6" className="fill-hms-primary" />
      <rect x="352" y="262" width="16" height="110" rx="6" className="fill-hms-primary" />
      <rect x="372" y="346" width="8" height="46" className="fill-hms-muted" />
      <rect x="536" y="346" width="8" height="46" className="fill-hms-muted" />
      <circle cx="376" cy="398" r="9" className="fill-hms-navy" />
      <circle cx="540" cy="398" r="9" className="fill-hms-navy" />
      <rect
        x="352"
        y="330"
        width="214"
        height="18"
        rx="5"
        className="fill-hms-primary-light"
      />
      <rect
        x="366"
        y="300"
        width="184"
        height="32"
        rx="10"
        className="fill-hms-surface stroke-hms-border-strong"
        strokeWidth="1.5"
      />

      {/* Patient */}
      <rect
        x="490"
        y="258"
        width="58"
        height="40"
        rx="14"
        transform="rotate(-14 519 278)"
        className="fill-hms-surface stroke-hms-border-strong"
        strokeWidth="1.5"
      />
      <path
        d="M468 304 C466 274 488 260 510 264 L522 304 Z"
        className="fill-hms-primary-soft stroke-hms-primary-light"
        strokeWidth="1.5"
      />
      <circle cx="512" cy="246" r="17" className="fill-hms-skin" />
      <path
        d="M495 244 C494 229 505 225 514 226 C525 227 531 236 529 246 C524 238 516 234 507 236 C501 237 497 240 495 244 Z"
        className="fill-hms-hair"
      />
      <path
        d="M372 304 C404 284 452 282 486 292 C500 298 504 316 500 332 L372 332 Z"
        className="fill-hms-primary-light"
      />
      <path
        d="M392 304 C420 292 452 290 480 298"
        fill="none"
        strokeWidth="2"
        className="stroke-hms-primary-soft/60"
      />
      <path
        d="M482 296 Q456 300 434 302"
        fill="none"
        strokeWidth="9"
        strokeLinecap="round"
        className="stroke-hms-skin"
      />

      {/* Plant */}
      <g className="fill-hms-primary-light">
        <path d="M108 372 C90 340 80 300 92 268 C108 298 114 340 108 372 Z" />
        <path d="M108 372 C94 356 70 346 56 316 C84 320 102 344 108 372 Z" />
      </g>
      <path
        d="M108 372 C112 330 130 300 152 290 C148 326 132 356 108 372 Z"
        className="fill-hms-primary"
      />
      <path d="M84 372 L132 372 L126 420 L90 420 Z" className="fill-hms-primary-hover" />

      <Clinician outfit="coat" transform="translate(196 130)" />
    </>
  );
}

function CorridorScene() {
  return (
    <>
      <line
        x1="0"
        y1="460"
        x2="520"
        y2="460"
        className="stroke-primary/15"
        strokeWidth="2"
      />
      <rect x="0" y="328" width="520" height="14" className="fill-primary/10" />

      {/* Notice board */}
      <rect x="70" y="112" width="112" height="82" rx="4" className="fill-card" />
      <g className="fill-primary/15">
        <rect x="84" y="128" width="54" height="6" rx="3" />
        <rect x="84" y="144" width="84" height="6" rx="3" />
        <rect x="84" y="160" width="70" height="6" rx="3" />
        <rect x="84" y="176" width="40" height="6" rx="3" />
      </g>

      {/* Ward door and sign */}
      <rect
        x="370"
        y="150"
        width="120"
        height="310"
        rx="4"
        className="fill-hms-primary-light/25 stroke-hms-primary-light/60"
        strokeWidth="3"
      />
      <rect x="444" y="182" width="26" height="76" rx="2" className="fill-card" />
      <rect x="384" y="290" width="6" height="28" rx="3" className="fill-hms-primary" />
      <rect x="372" y="100" width="104" height="34" rx="4" className="fill-hms-primary" />
      <text
        x="388"
        y="123"
        className="fill-hms-surface"
        fontSize="15"
        fontWeight="600"
        letterSpacing="1.5"
      >
        WARD
      </text>
      <path
        d="M446 117 H462 M456 111 L462 117 L456 123"
        fill="none"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-hms-surface"
      />

      {/* Waiting chairs */}
      <g>
        {[70, 126, 182].map((x) => (
          <g key={x}>
            <rect
              x={x}
              y="318"
              width="48"
              height="36"
              rx="6"
              className="fill-hms-primary-light/50"
            />
            <rect
              x={x}
              y="356"
              width="48"
              height="12"
              rx="4"
              className="fill-hms-primary-light/80"
            />
          </g>
        ))}
        <rect
          x="66"
          y="368"
          width="168"
          height="6"
          rx="3"
          className="fill-hms-primary/60"
        />
        <rect x="80" y="374" width="5" height="44" className="fill-hms-primary/60" />
        <rect x="214" y="374" width="5" height="44" className="fill-hms-primary/60" />
      </g>

      {/* Plant */}
      <g className="fill-hms-primary-light">
        <path d="M34 412 C20 384 14 350 24 322 C38 348 42 384 34 412 Z" />
        <path d="M34 412 C40 378 54 354 70 346 C66 376 54 400 34 412 Z" />
      </g>
      <path d="M16 412 L52 412 L48 460 L20 460 Z" className="fill-hms-primary-hover" />

      <Clinician outfit="scrubs" transform="translate(228 170)" />
    </>
  );
}

const SCENES = {
  ward: { viewBox: "0 0 600 460", Scene: WardScene },
  clinician: { viewBox: "0 0 520 480", Scene: CorridorScene },
} as const;

interface HealthcareIllustrationProps {
  /** `ward`: clinician at a patient's bedside. `clinician`: nurse outside a ward. */
  scene: keyof typeof SCENES;
  className?: string;
}

export function HealthcareIllustration({
  scene,
  className,
}: HealthcareIllustrationProps) {
  const { viewBox, Scene } = SCENES[scene];
  return (
    <svg
      viewBox={viewBox}
      aria-hidden
      focusable="false"
      className={cn("h-auto w-full", className)}
    >
      <Scene />
    </svg>
  );
}
