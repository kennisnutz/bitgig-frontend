import React, { useReducer, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import './Add.scss';
import { INITIAL_STATE, gigReducer } from '../../reducers/gigReducer';
import upload from '../../utils/upload.js';
import newRequest from '../../utils/newRequest';

const Add = () => {
  const [singleFile, setSigleFile] = useState(undefined);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [state, dispatch] = useReducer(gigReducer, INITIAL_STATE);

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const handleChange = (e) => {
    dispatch({
      type: 'CHANGE_INPUT',
      payload: { name: e.target.name, value: e.target.value },
    });
  };

  const handleFeature = (e) => {
    e.preventDefault();
    dispatch({
      type: 'ADD_FEATURE',
      payload: e.target[0].value !== '' && e.target[0].value,
    });

    e.target[0].value = '';
  };

  const handleUploads = async () => {
    setUploading(true);
    try {
      const cover = await upload(singleFile);

      const images = await Promise.all(
        [...files].map(async (file) => {
          const url = await upload(file);
          return url;
        })
      );
      setUploading(false);
      dispatch({
        type: 'ADD_IMAGES',
        payload: { cover: cover, images: images },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const mutation = useMutation({
    mutationFn: (gig) => {
      return newRequest.post('/gigs', gig);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['myGigs']);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(state);
    navigate('/mygigs');
  };

  console.log(state);

  return (
    <div className="add">
      <div className="container">
        <h1>Add New</h1>
        <div className="sections">
          <div className="left">
            <label htmlFor="">Tittle</label>
            <input
              type="text"
              name="title"
              placeholder="e.g I will do something I'm really goog at"
              onChange={handleChange}
            />
            <label htmlFor="">Category</label>
            <select name="cat" id="cat" onChange={handleChange}>
              <option value="design">Design</option>
              <option value="web development">Web Development</option>
              <option value="animation"> Animation</option>
              <option value="music">Music</option>
            </select>
            <div className="images">
              <div className="imagesInputs">
                <label htmlFor="">Cover Image</label>
                <input
                  type="file"
                  onChange={(e) => setSigleFile(e.target.files[0])}
                />
                <label htmlFor="">Upload Images</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                />
              </div>
              <button onClick={handleUploads}>
                {uploading ? 'Uploading..' : 'Uplodoad'}
              </button>
            </div>
            <label htmlFor="">Description</label>
            <textarea
              name="desc"
              id=""
              cols="30"
              rows="16"
              placeholder="Breif description of your service to customers"
              onChange={handleChange}
            ></textarea>
            <button onClick={handleSubmit}>Create</button>
          </div>
          <div className="rigth">
            <label htmlFor="">Service Title</label>
            <input
              type="text"
              name="shortTitle"
              placeholder="e.g one page web-design"
              onChange={handleChange}
            />
            <textarea
              name="shortDesc"
              id=""
              cols="30"
              rows="16"
              placeholder="Short description of your required service"
              onChange={handleChange}
            ></textarea>
            <label htmlFor="">Delivery Time (eg, 3 days)</label>
            <input
              type="number"
              min={1}
              name="deliveryTime"
              onChange={handleChange}
            />
            <label htmlFor="">Revision Number</label>
            <input
              type="number"
              min={1}
              name="revisionTime"
              onChange={handleChange}
            />
            <label htmlFor="">Add Features</label>
            <form action="" className="add" onSubmit={handleFeature}>
              <input type="text" name="feature" placeholder="e.g page design" />
              <button type="submit">add</button>
            </form>
            <div className="addedFeatures">
              {state.features?.map((f) => (
                <div className="item" key={f}>
                  <button
                    onClick={() =>
                      dispatch({
                        type: 'REMOVE_FEATURE',
                        payload: f,
                      })
                    }
                  >
                    {f}
                    <span>X</span>
                  </button>
                </div>
              ))}
            </div>
            <label htmlFor="">Price</label>
            <input type="number" name="price" min={1} onChange={handleChange} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Add;
