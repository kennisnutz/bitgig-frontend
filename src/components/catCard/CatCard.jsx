import React from 'react';
import { Link } from 'react-router-dom';

import './CatCard.scss';

const CatCard = ({ item }) => {
  return (
    <Link to="/gigs?cat=design">
      <div className="catCard">
        <img src={item.img} alt="category item" />
        <span className="description">{item.description}</span>
        <span className="title">{item.title}</span>
      </div>
    </Link>
  );
};

export default CatCard;
