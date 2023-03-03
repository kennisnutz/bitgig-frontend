import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import './Message.scss';
import newRequest from '../../utils/newRequest.js';

const Message = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const { id } = useParams();

  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ['messages'],
    queryFn: () =>
      newRequest.get(`/messages/${id}`).then((res) => {
        return res.data;
      }),
  });

  const mutation = useMutation({
    mutationFn: (message) => {
      return newRequest.post(`/messages/`, message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['messages']);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      conversationId: id,
      desc: e.target[0].value,
    });
    e.target[0].value = '';
  };
  return (
    <div className="message">
      <div className="container">
        <span className="breadcrumbs">
          <Link to="/messages"> MESSAGES</Link> {'>'} KENNY SHILLZ {'>'}
        </span>
        {isLoading ? (
          'Loading...'
        ) : error ? (
          'Somethng went wrong while fetching message'
        ) : (
          <div className="messages">
            {data.map((m) => (
              <div
                className={m.userId === currentUser._id ? 'owner item' : 'item'}
                key={m._id}
              >
                <img
                  src="https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=1600"
                  alt=""
                />
                <p>{m.desc}</p>
              </div>
            ))}
          </div>
        )}
        <form className="write" onSubmit={handleSubmit}>
          <textarea
            name=""
            id=""
            placeholder="write a message"
            cols="30"
            rows="10"
          ></textarea>
          <button>Send</button>
        </form>
      </div>
    </div>
  );
};

export default Message;
