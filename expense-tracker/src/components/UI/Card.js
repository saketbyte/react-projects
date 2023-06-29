import "./Card.css";

const Card = (props) => {
  const classes = "card " + props.className;
  // Do not miss the whitespace after the card.

  return <div className={classes}>{props.children}</div>;
};
export default Card;
