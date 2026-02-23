import { defineLoader } from "vitepress";
import { loadSynthesisFile } from "../.vitepress/utils";

export interface InterviewQuestion {
  question: string;
  context: string;
  evidence: string[];
  priority: "essential" | "important" | "nice-to-have";
}

export interface InterviewQuestionsData {
  kaze: InterviewQuestion[];
  biobak: InterviewQuestion[];
  badub: InterviewQuestion[];
  kaze_zeina: InterviewQuestion[];
}

export default defineLoader({
  async load(): Promise<InterviewQuestionsData | null> {
    return loadSynthesisFile<InterviewQuestionsData>(
      "interview-questions.json",
    );
  },
});
