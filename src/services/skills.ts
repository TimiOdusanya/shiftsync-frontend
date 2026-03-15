import { apiClient } from "./api";
import type { Skill } from "@/types";

const SKILLS_KEY = "skills" as const;

export function skillsKey() {
  return [SKILLS_KEY] as const;
}

export async function fetchSkills(): Promise<Skill[]> {
  return apiClient.get<Skill[]>("/skills");
}
