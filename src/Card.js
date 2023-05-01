import React, { useEffect, useRef } from "react";
import './Card.css';

const Card = ({ img, style }) => {


    return (
        <img className="Card" src={img} style={style}></img>
    )

}

export default Card