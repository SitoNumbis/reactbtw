import React from "react";

// prop types
import PropTypes from "prop-types";

// @emotion/css
import { css } from "@emotion/css";

// own components
import Container from "../../Container/Container";

// context
import { useLanguage } from "../../../context/Language";

// icons
import { ClassIcons } from "../../../assets/icons/icons";

// images
import femaleHighElf from "../../../img/portrait/femalehighelf.webp";

const CombatPortrait = (props) => {
  const { languageState } = useLanguage();
  const { character, id, className } = props;

  const combatPortrait = {
    padding: "10px",
    background: "#222222",
    border: "1px solid #383838",
    borderRadius: "1rem",
    width: "200px",
    height: "250px",
    zIndex: 1,
    h3: {
      color: "#aeb4b9",
    },
    color: "#5e6264",
    transition: "all 200ms ease",
  };

  const portraitRow = {
    marginTop: "10px",
    alignItems: "center",
    transition: "all 400ms ease",
  };

  const label = css({
    marginRight: "10px",
    fontWeight: "500",
  });

  const imageContainer = css({
    borderRadius: "100%",
    backgroundColor: "#22244e",
    width: "130px",
    zIndex: 1,
    transition: "all 1000ms ease",
  });

  const characterClass = css({
    fontSize: "12rem",
    position: "absolute",
    opacity: 0.1,
  });

  return (
    <Container
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={combatPortrait}
      id={id}
      className={className}
    >
      <span className={characterClass}>{ClassIcons[character.Class]}</span>
      <Container>
        <img
          src={character.Photo ? character.Photo : femaleHighElf}
          className={imageContainer}
          alt="character-portrait"
        />
      </Container>
      <Container sx={portraitRow} id="name-row">
        <span className={label}>
          {languageState.texts.CharacterPortrait.Labels.Name}{" "}
        </span>
        <span>{character.Name}</span>
      </Container>
      <Container sx={portraitRow} id="level-row">
        <span className={label}>
          {languageState.texts.CharacterPortrait.Labels.Level}{" "}
        </span>
        <span>{character.Level}</span>
      </Container>
    </Container>
  );
};

CombatPortrait.defaultProps = {
  character: {},
  id: "",
  className: "",
};

CombatPortrait.propTypes = {
  character: PropTypes.object,
  id: PropTypes.string,
  className: PropTypes.string,
};

export default CombatPortrait;