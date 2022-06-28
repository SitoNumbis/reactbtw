import { AllActions } from "../models/Action";

// errors
export const Errors = {
  InvalidTarget: "InvalidTarget",
};

export const parseNodeUnit = (domElement) => {
  let node = domElement;
  while (
    node.id === "" ||
    node.id === "name-row" ||
    node.id.indexOf("-") === -1
  )
    node = node.parentNode;
  return node;
};

const isJustATeam = (targetType) => {
  return targetType === "enemy" || targetType === "player";
};

export const validTarget = (team, unit, action) => {
  if (
    AllActions[action].affect !== team &&
    isJustATeam(AllActions[action].affect)
  )
    return { error: Errors.InvalidTarget };
  return true;
};