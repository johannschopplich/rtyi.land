import type { FindingTopic } from "../../src/schemas";

const TOPIC_LABELS: Record<FindingTopic, string> = {
  design: "Design",
  technical: "Technical",
  milestone: "Milestone",
  philosophy: "Philosophy",
  personal: "Personal",
  team: "Team",
  "legal-nintendo": "Legal / Nintendo",
  community: "Community",
  business: "Business",
};

export const TOPIC_KEYS = Object.keys(TOPIC_LABELS) as FindingTopic[];

export function formatTopicLabel(topic: FindingTopic) {
  return TOPIC_LABELS[topic];
}

export function formatDateFromYYYYMMDD(dateString: string) {
  if (dateString.length !== 8) {
    return dateString;
  }

  const year = dateString.substring(0, 4);
  const month = dateString.substring(4, 6);
  const day = dateString.substring(6, 8);

  const date = new Date(
    Number.parseInt(year),
    Number.parseInt(month) - 1,
    Number.parseInt(day),
  );

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function capitalizeInitialLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
