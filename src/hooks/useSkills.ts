"use client";

import { useQuery } from "@tanstack/react-query";
import { skillsKey, fetchSkills } from "@/services/skills";

export function useSkills() {
  return useQuery({
    queryKey: skillsKey(),
    queryFn: fetchSkills,
  });
}
