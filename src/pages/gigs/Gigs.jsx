import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';

import newRequest from '../../utils/newRequest.js';
import './Gigs.scss';
import GigCard from '../../components/gigCard/GigCard';

const Gigs = () => {
  const [sort, setSort] = useState('sales');
  const [open, setOpen] = useState(false);

  const minRef = useRef();
  const maxRef = useRef();

  const { search } = useLocation();

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ['gigs'],
    queryFn: () =>
      newRequest
        .get(
          `/gigs?${search}&min=${minRef.current.value}&max=${maxRef.current.value}&sort=${sort}`
        )
        .then((res) => {
          return res.data;
        }),
  });

  const apply = () => {
    refetch();
  };

  const reSort = (type) => {
    setSort(type);
    setOpen(false);
  };

  useEffect(() => {
    refetch();
  }, [sort]);

  return (
    <div className="gigs">
      <div className="container">
        <span className="breadcrumbs">
          BITGIGGS {'>'} GRAPHICS & DESIGN {'>'}
        </span>
        <h1>AI Artists</h1>
        <p>
          Explore the boundaries of art and technology with Bitggig's AI artists
        </p>
        <div className="menu">
          <div className="left">
            <span>Budget</span>
            <input ref={minRef} type="text" placeholder="min price" />
            <input ref={maxRef} type="text" placeholder="max price" />
            <button onClick={apply}>Apply</button>
          </div>
          <div className="right">
            <span className="sortBy">Sort By</span>
            <span className="sortType">
              {sort === 'sales' ? 'Best Selling' : 'Newest'}
            </span>
            <img
              src="./img/down.png"
              alt="down"
              onClick={() => setOpen(!open)}
            />
            {open && (
              <div className="rightMenu">
                {sort === 'sales' ? (
                  <span onClick={() => reSort('createdAt')}>Newest</span>
                ) : (
                  <span onClick={() => reSort('sales')}>Best Selling</span>
                )}
                <span onClick={() => reSort('sales')}>Popular</span>
              </div>
            )}
          </div>
        </div>
        <div className="cards">
          {isLoading
            ? 'Loading...'
            : error
            ? 'Something went wrong while fetching gigs!'
            : data.map((gig) => <GigCard item={gig} key={gig._id} />)}
        </div>
      </div>
    </div>
  );
};

export default Gigs;
