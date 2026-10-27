export type IntroState = "initial" | "playing" | "handoff" | "completed" | "skipped";

export function introActive(state: IntroState) {
  return state === "initial" || state === "playing" || state === "handoff";
}
