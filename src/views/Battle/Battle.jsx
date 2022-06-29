import { useState, useEffect, useReducer, useCallback } from "react";
import Tippy from "@tippyjs/react";

// models
import Character, { NPCEnum } from "../../models/Character";
import Field from "../../models/Field";

// own components
import Animation from "../../components/Animation/Animation";
import CombatPortrait from "../../components/CharacterPortrait/CombatPortrait/CombatPortrait";
import SitoContainer from "sito-container";
import ActionMenu from "./ActionMenu/ActionMenu";
import EventsNotification from "./EventsNotification.jsx/EventsNotification";
import EventList from "./EventList/EventList";
import ActionBeep from "./ActionBeep/ActionBeep";

// contexts
import { useLanguage } from "../../context/Language";
import { useBattle } from "../../context/BattleProvider";
import { GetActionTargetType } from "../../models/Action";

// utils
import { parseNodeUnit, validTarget } from "../../utils/functions";
import { isABot } from "../../utils/bots";

// icons
import { AllIcons } from "../../assets/icons/icons";

// styles
import { actionSelected as actionSelectedStyle } from "./ActionMenu/style";

const Battle = () => {
  const { battleState, setBattleState } = useBattle();
  const { languageState } = useLanguage();

  // turns
  const [turns, setTurns] = useState(1);
  // actions
  const [currentAction, setCurrentAction] = useState("");
  const [selectingTargets, setSelectingTargets] = useState(false);

  // error
  const [errorCode, setErrorCode] = useState("");

  const cleanSelectionVars = () => {
    setSelectingTargets(false);
    setCurrentAction("");
    setPlayingUnit(undefined);
  };

  useEffect(() => {
    console.log(errorCode);
    if (errorCode !== "")
      setTimeout(() => {
        setErrorCode("");
      }, 2000);
  }, [errorCode]);

  const unitActionsReducer = (unitActionsState, action) => {
    switch (action.type) {
      case "init": {
        const { goodUnits, badUnits } = action;
        const newActions = [];
        let row = [];
        for (let i = 0; i < badUnits; i += 1) row.push(-1);
        newActions.push(row);
        row = [];
        for (let i = 0; i < goodUnits; i += 1) row.push(-1);
        newActions.push(row);
        return newActions;
      }
      case "set": {
        const newActions = unitActionsState;
        const { unit, team, newAction, target } = action;
        newActions[team === "good" ? 1 : 0][unit] = {
          action: newAction,
          target,
        };
        console.log(newActions);
        return newActions;
      }
      default:
        return [[], []];
    }
  };

  const [unitActions, setUnitActions] = useReducer(unitActionsReducer, [
    [],
    [],
  ]);

  // modals
  const [showAction, setShowAction] = useState(false);
  const onCloseAction = () => {
    setShowAction(false);
  };

  useEffect(() => {
    if (!showAction && playingUnit && !selectingTargets) {
      console.log("hola");
      setCurrentAction("awaitingOrders");
      setShowActionBeep(true);
    }
  }, [showAction]);

  const [enemies, setEnemies] = useState([]);
  const [players, setPlayers] = useState([]);
  const [allUnits, setAllUnits] = useState([]);

  const [showActionBeep, setShowActionBeep] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [showEventList, setShowEventList] = useState(false);
  const [showCharacterAction, setShowCharacterAction] = useState(false);
  const [target, setTarget] = useState({ offsetLeft: 0, offsetTop: 0 });

  // units
  const [playingUnit, setPlayingUnit] = useState();

  useEffect(() => {
    if (!playingUnit) {
      let selected = false;
      for (let i = 0; i < players.length && !selected; i += 1)
        if (!players[i].busy) {
          setPlayingUnit(players[i]);
          setShowAction(true);
          selected = true;
        }
      if (!selected) {
        setCurrentAction("opponentThinking");
        setShowActionBeep(true);
      }
    }
  }, [playingUnit]);

  const onClickEnemyUnit = (e) => {
    const node = parseNodeUnit(e.target);
    const [, index] = node.id.split("-");
    const numberIndex = Number(index);
    if (selectingTargets) {
      const selectingResult = validTarget(
        "enemy",
        players[numberIndex],
        currentAction
      );
      if (selectingResult.error) setErrorCode(selectingResult.error);
      else {
        setUnitActions({
          type: "set",
          unit: playingUnit.index,
          team: "good",
          newAction: currentAction,
          target: index,
        });
        return cleanSelectionVars();
      }
    }
  };

  const onClickPlayerUnit = (e) => {
    const node = parseNodeUnit(e.target);
    const [, index] = node.id.split("-");
    const numberIndex = Number(index);
    if (selectingTargets) {
      const selectingResult = validTarget(
        "player",
        players[numberIndex],
        currentAction
      );
      if (selectingResult.error) setErrorCode(selectingResult.error);
      else {
        setUnitActions({
          type: "set",
          unit: playingUnit.index,
          team: "good",
          newAction: currentAction,
          target: index,
        });
        return cleanSelectionVars();
      }
    }
    if (players) setPlayingUnit(players[numberIndex]);
    if (!showAction) setShowAction(true);
  };

  const order = (localUnits = undefined) => {
    let newOrder = allUnits;
    if (localUnits) newOrder = localUnits;
    console.log(newOrder);
  };

  const doAttack = () => {
    setShowAnimation(true);
    const currentTarget = document.getElementById("Hola");
    setTarget({
      x: currentTarget.offsetLeft + 70, // + currentTarget.offsetWidth / 2,
      y: currentTarget.offsetTop + 85, // + currentTarget.offsetHeight / 2,
      class: "",
      player: 0,
      index: 0,
    });
    setTimeout(() => {
      setShowAnimation(false);
      setTarget({
        x: currentTarget.offsetLeft + 70, // + currentTarget.offsetWidth / 2,
        y: currentTarget.offsetTop + 85, // + currentTarget.offsetHeight / 2,
        subclass: "hit",
        class: "red",
        player: 0,
        index: 0,
      });
      setTimeout(() => {
        setTarget({
          x: currentTarget.offsetLeft + 70, // + currentTarget.offsetWidth / 2,
          y: currentTarget.offsetTop + 85, // + currentTarget.offsetHeight / 2,
          class: "",
          index: -1,
        });
      }, 301);
    }, 500);
  };

  const doRun = (unitIndex) => {};

  const doBasic = (basicName, unitIndex, team) => {
    switch (basicName) {
      case "attack":
        setShowActionBeep(true);
        setSelectingTargets(true);
        setCurrentAction(basicName);
        break;
      default: // wait - run
        setUnitActions({
          type: "set",
          unit: unitIndex,
          team,
          newAction: basicName,
          target: -1,
        });
        return cleanSelectionVars();
    }
  };

  const actionSelected = (e) => {
    let node = e.target;
    while (node.id === "") node = node.parentNode;
    const [type, name] = node.id.split("-");
    players[playingUnit.index].busy = true;
    switch (type) {
      default: // basic
        return doBasic(name, playingUnit.index, "good");
    }
  };

  useEffect(() => {
    const dataUser = localStorage.getItem("btw-user-data");
    const player = new Character({
      ...JSON.parse(dataUser),
      ...NPCEnum.character,
    });
    const player1 = new Character({
      ...JSON.parse(dataUser),
      ...NPCEnum.character,
    });
    player1.Name = "Locol";
    player.SetAttribute("index", 0);
    player.SetAttribute("busy", false);
    player.SetAttribute("team", 1);
    player1.SetAttribute("index", 1);
    player1.SetAttribute("busy", false);
    player1.SetAttribute("team", 1);

    const enemy = new Character(NPCEnum.dummy);
    enemy.SetAttribute("team", 2);
    enemy.SetAttribute("bot", true);
    // local test
    const localPlayers = [player, player1];
    const localEnemies = [enemy];
    setPlayingUnit(player);
    setShowAction(true);
    setPlayers([player, player1]);
    setEnemies([enemy]);
    setAllUnits([player, player1, enemy]);
    setUnitActions({
      type: "init",
      goodUnits: localPlayers.length,
      badUnits: localEnemies.length,
    });
    order([player, enemy]);
    setBattleState({
      type: "init",
      field: new Field(),
      goodTeam: [player],
      evilTeam: [enemy],
    });
  }, []);

  useEffect(() => {
    if (enemies) {
      enemies.forEach((item, i) => {
        if (isABot(item) && item.busy) {
          item.busy = true;
          setUnitActions({
            type: "set",
            unit: i,
            team: "enemy",
            newAction: "attack",
            target: 0,
          });
        }
      });
    }
    console.log(unitActions);
  }, [unitActions]);

  useEffect(() => {
    if (battleState.action) {
      setShowCharacterAction(false);
      setShowActionBeep(true);
    } else setShowActionBeep(false);
  }, [battleState.action]);

  const action = (e) => {
    let node = e.target;
    if (node.nodeName === "path") node = node.parentNode;
    if (node.nodeName === "svg") node = node.parentNode;
    const actionType = GetActionTargetType(node.id.substring(1));
    setBattleState({ type: "selecting-action", actionType });
  };

  const keyHandlers = useCallback(
    (e) => {
      console.log(e);
      if (e.key === "Escape") {
        if (showAction) setShowAction(false);
        else if (showActionBeep) {
          setShowActionBeep(false);
          setShowAction(true);
          players[playingUnit.index].busy = false;
        }
      }
    },
    [showAction, showActionBeep, players, playingUnit]
  );

  useEffect(() => {
    window.addEventListener("keydown", keyHandlers);
    return () => {
      window.removeEventListener("keydown", keyHandlers);
    };
  }, [keyHandlers]);

  return (
    <SitoContainer
      justifyContent="space-between"
      flexDirection="column"
      sx={{ padding: "18px 20px 10px 20px", height: "95vh" }}
      id="battle"
    >
      <ActionMenu
        visible={showAction}
        onClose={onCloseAction}
        playing={playingUnit}
        action={actionSelected}
      />
      <EventsNotification action={() => setShowEventList(true)} />
      {players.length > 0 && (
        <ActionMenu
          action={action}
          playing={players[0]}
          visible={showCharacterAction}
        />
      )}
      <ActionBeep
        visible={showActionBeep}
        action={currentAction}
        errorCode={errorCode}
      />
      <EventList visible={showEventList} />
      {/* <SpeakDialog visible={true} /> */}
      <SitoContainer justifyContent="right">
        {enemies.map((item, i) => {
          return (
            <SitoContainer
              key={`${item.Name}${i}`}
              id={`enemy-${i}`}
              className={
                target.player === 0 && target.index === i ? target.subclass : ""
              }
              extraProps={{
                onClick: onClickEnemyUnit,
              }}
            >
              <CombatPortrait
                id="Dummy"
                character={item}
                className={selectingTargets ? "possible-target" : ""}
              />
            </SitoContainer>
          );
        })}
      </SitoContainer>
      <button onClick={doAttack}>Hola</button>
      <SitoContainer>
        {showAnimation && (
          <Animation
            which="slash"
            target={{
              x: target.x,
              y: target.y,
            }}
          />
        )}
      </SitoContainer>
      <SitoContainer justifyContent="left">
        {players.map((item, i) => {
          return (
            <SitoContainer
              key={`${item.Name}${i}`}
              id={`good-${i}`}
              className={
                target.player === 1 && target.index === i ? target.subclass : ""
              }
              extraProps={{
                onClick: onClickPlayerUnit,
              }}
            >
              <SitoContainer
                sx={{
                  position: "absolute",
                  width: "232px",
                  zIndex: 2,
                  transition: "all 500ms ease",
                  transform:
                    playingUnit && playingUnit.index === i && selectingTargets
                      ? "translateY(-20px)"
                      : "translateY(0)",
                }}
                justifyContent="flex-end"
              >
                <Tippy content={languageState.texts.Battle.CancelAction}>
                  <button
                    style={{
                      transition: "all 300ms ease",
                      transform: AllIcons[unitActions[1][i].action]
                        ? "scale(1)"
                        : "scale(0)",
                    }}
                    className={actionSelectedStyle}
                  >
                    {AllIcons[unitActions[1][i].action]}
                  </button>
                </Tippy>
              </SitoContainer>
              <CombatPortrait
                id={item.Name}
                character={item}
                className={`${
                  target.player === 1 && target.index === i ? target.class : ""
                } ${!item.busy ? "unit-ready" : ""} ${
                  playingUnit && playingUnit.index === i && selectingTargets
                    ? "targeter"
                    : ""
                }`}
              />
            </SitoContainer>
          );
        })}
      </SitoContainer>
    </SitoContainer>
  );
};

export default Battle;
