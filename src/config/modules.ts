import {
  BedDoubleIcon,
  CalendarDaysIcon,
  ChartColumnIcon,
  FlaskConicalIcon,
  PackageIcon,
  PillIcon,
  ReceiptTextIcon,
  UsersRoundIcon,
  type LucideIcon,
} from "lucide-react";

export interface HmsModule {
  icon: LucideIcon;
  title: string;
  summary: string;
}

/**
 * Clinical and administrative modules on the product roadmap. Used for
 * marketing copy and the dashboard roadmap. Not navigation: real routes are
 * added to `components/navigation/nav-config.ts` as modules ship.
 */
export const HMS_MODULES: readonly HmsModule[] = [
  {
    icon: UsersRoundIcon,
    title: "Patients",
    summary: "Registration, demographics and a single longitudinal record.",
  },
  {
    icon: CalendarDaysIcon,
    title: "Appointments",
    summary: "Clinic scheduling, queues and follow-up visits.",
  },
  {
    icon: BedDoubleIcon,
    title: "Wards & admissions",
    summary: "Bed occupancy, transfers and discharge planning.",
  },
  {
    icon: PillIcon,
    title: "Pharmacy",
    summary: "Prescriptions, dispensing and stock levels.",
  },
  {
    icon: FlaskConicalIcon,
    title: "Laboratory",
    summary: "Test requests, sample tracking and results.",
  },
  {
    icon: ReceiptTextIcon,
    title: "Billing",
    summary: "Invoices, payments and insurance claims.",
  },
  {
    icon: PackageIcon,
    title: "Inventory",
    summary: "Consumables, equipment and reordering.",
  },
  {
    icon: ChartColumnIcon,
    title: "Reports",
    summary: "Operational and statutory reporting across departments.",
  },
];
