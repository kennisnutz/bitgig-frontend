import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import './Navbar.scss';
import newRequest from '../../utils/newRequest.js';

const Navbar = () => {
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const isActive = () => {
    window.scrollY > 0 ? setActive(true) : setActive(false);
  };

  const handleLogout = async () => {
    try {
      await newRequest.post('/auth/logout');
      localStorage.setItem('currentUser', null);
      navigate('/');
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', isActive);
    return () => {
      window.addEventListener('scroll', isActive);
    };
  }, []);

  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  const { pathname } = useLocation();

  return (
    <div className={active || pathname !== '/' ? 'navbar active' : 'navbar'}>
      <div className="container">
        <div className="logo">
          <Link to="/" className="link">
            <span className="text">BitGiggs</span>
          </Link>
          <span className="dot">.</span>
        </div>
        <div className="links">
          <span className="text">BitGigg Business</span>
          <Link to="/gigs">
            <span className="text">Explore</span>
          </Link>
          <span className="text">English</span>

          {!currentUser?.isSeller && (
            <span className="text">Become a seller</span>
          )}

          {currentUser ? (
            <div className="user" onClick={() => setOpen(!open)}>
              <img src={currentUser.img || '/img/noavatar.jpg'} alt="" />
              <span>{currentUser?.username}</span>
              {open && (
                <div className="options">
                  {currentUser.isSeller && (
                    <>
                      <Link className="link" to="/mygigs">
                        Gigs
                      </Link>
                      <Link className="link" to="/add">
                        Add New Gig
                      </Link>
                    </>
                  )}
                  <Link className="link" to="/orders">
                    Orders
                  </Link>
                  <Link className="link" to="/messages">
                    Messages
                  </Link>
                  <Link className="link" onClick={handleLogout}>
                    Logout
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="link">
                Sign in
              </Link>
              <Link className="link" to="/register">
                <button>Join</button>
              </Link>
            </>
          )}
        </div>
      </div>
      {active && (
        <>
          <hr />
          <div className="menu">
            <span>Test</span>
            <span>Test2</span>
          </div>
        </>
      )}
    </div>
  );
};

export default Navbar;
