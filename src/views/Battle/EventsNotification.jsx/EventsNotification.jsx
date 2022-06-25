import { useEffect, useState } from "react";

// prop types
import PropTypes from "prop-types";

// @emotion/css
import { css } from "@emotion/css";

// tippy
import Tippy from "@tippyjs/react";

// own components
import SitoContainer from "sito-container";
import Badge from "./Badge/Badge";

// react-icons
import { MdInfo } from "react-icons/md";

// contexts
import { useLanguage } from "../../../context/Language";
import { useBattle } from "../../../context/BattleProvider";

const EventsNotification = (props) => {
  const { battleState, setBattleState } = useBattle();
  const { languageState } = useLanguage();

  const [notification, setNotification] = useState(0);
  const [shake, setShake] = useState(false);
  const [hide, setHide] = useState(false);

  const { action } = props;

  useEffect(() => {
    if (battleState.notifications) {
      let newNotifications = 0;
      battleState.notifications.forEach((item) => {
        if (!item.read) newNotifications += 1;
      });
      if (notification === newNotifications) {
        setTimeout(() => {
          activateShake();
        }, 600);
      }
      setNotification(newNotifications);
      setTimeout(() => {
        setBattleState({ type: "check" });
      }, 5000);
    }
  }, [battleState]);

  const activateShake = () => {
    setShake(true);
    setTimeout(() => {
      setShake(false);
    }, 500);
  };

  useEffect(() => {
    if (notification > 0) {
      setHide(false);
      setTimeout(() => {
        activateShake();
      }, 600);
    } else setHide(true);
  }, [notification]);

  const openNotification = () => {
    action();
  };

  const eventButtonCss = css({
    border: "none",
    background: "aliceblue",
    color: "#f57c00",
    width: 27,
    height: 27,
    transition: "all 400ms ease",
    borderRadius: "100%",
    padding: 0,
    "&:hover": {
      width: 30,
      height: 30,
    },
  });

  const eventIconCss = css({
    transition: "all 400ms ease",
    margin: -4,
    fontSize: 35,
    "&:hover": {
      fontSize: 40,
    },
  });

  return (
    <SitoContainer
      className={shake ? "shake" : ""}
      sx={{
        position: "fixed",
        top: "10px",
        left: "10px",
      }}
    >
      <SitoContainer
        sx={{
          transition: "all 400ms ease",
          transform: hide ? "scale(0)" : "scale(1)",
        }}
      >
        <Badge count={notification} />
        <Tippy content={languageState.texts.Battle.Events.Tooltip}>
          <button onClick={openNotification} className={eventButtonCss}>
            <MdInfo className={eventIconCss} />
          </button>
        </Tippy>
      </SitoContainer>
    </SitoContainer>
  );
};

EventsNotification.propTypes = {
  action: PropTypes.func.isRequired,
};

export default EventsNotification;
