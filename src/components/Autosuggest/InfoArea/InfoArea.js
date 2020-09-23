import React from "react";
import PropTypes from "prop-types";

import classes from "./InfoArea.module.css";

const InfoArea = props => {
	const heroObject = props.heroObject;

	return (
		<table className={classes.infoArea}>
			<tbody>
				<tr>
					<td className={classes.nameRow} colSpan={"2"}>
						<strong>
							{heroObject.name ||
								"Find & select a hero to display its properties!"}
						</strong>
					</td>
				</tr>
				<tr>
					<td>
						<strong>Gender</strong>
					</td>
					<td>{heroObject.gender || "-"}</td>
				</tr>
				<tr>
					<td>
						<strong>Birth Year</strong>
					</td>
					<td>{heroObject.birth_year || "-"}</td>
				</tr>
				<tr>
					<td>
						<strong>Height</strong>
					</td>
					<td>{heroObject.height || "-"}</td>
				</tr>
				<tr>
					<td>
						<strong>Mass</strong>
					</td>
					<td>{heroObject.mass || "-"}</td>
				</tr>
				<tr>
					<td>
						<strong>Hair color</strong>
					</td>
					<td>{heroObject.hair_color || "-"}</td>
				</tr>
				<tr>
					<td>
						<strong>Skin color</strong>
					</td>
					<td>{heroObject.skin_color || "-"}</td>
				</tr>
				<tr>
					<td>
						<strong>Eye color</strong>
					</td>
					<td>{heroObject.eye_color || "-"}</td>
				</tr>
			</tbody>
		</table>
	);
};

InfoArea.propTypes = {
	heroObject: PropTypes.object
};

export default React.memo(InfoArea);
