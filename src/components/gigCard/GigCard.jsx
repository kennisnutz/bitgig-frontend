import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import './GigCard.scss';
import newRequest from '../../utils/newRequest.js';

const GigCard = ({ item }) => {
  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ['gigUser'],
    queryFn: () =>
      newRequest.get(`/users/${item.userId}`).then((res) => {
        return res.data;
      }),
  });
  return (
    <Link to={`/gig/${item._id}`}>
      <div className="gigCard">
        <img src={item.cover} alt="image" />
        <div className="info">
          {isLoading ? (
            'Loading'
          ) : error ? (
            'Cant access user data'
          ) : (
            <div className="user">
              <img src={data.img || '/img/noavatar.jpg'} alt="user_image" />
              <span>{data.username}</span>
            </div>
          )}
          <p>{item.desc}</p>
          <div className="star">
            <img src="./img/star.png" alt="star" />
            <span>
              {!isNaN(item.totalStars / item.starNumber) &&
                Math.round(item.totalStars / item.starNumber)}
            </span>
          </div>
        </div>
        <hr />
        <div className="detail">
          <img src="./img/heart.png" alt="likes" />
          <div className="price">
            <span>STARTING AT</span>
            <h2>${item.price}</h2>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GigCard;
