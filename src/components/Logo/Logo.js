import React from "react";

import classes from "./Logo.module.css";

import LogoImage from "../../assets/Star_wars2.svg";

const Logo = props => (
	<img src={LogoImage} className={classes.Logo} alt={"Star Wars Logo"} />
);

export default Logo;
