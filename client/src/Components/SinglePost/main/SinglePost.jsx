import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  setInitLoadingFalse,
  setInitLoadingTrue,
  setSinglePost,
} from "../../../Context/features/Reducer";
import CustomCardDesktop from "../../../Hooks/Cards/CustomCardDesktop";
import ReactLoading from "react-loading";

const SinglePost = () => {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const initLoading = useSelector((state) => state.Reducer.initLoading);
  const [loading, setLoading] = useState(true);
  const singlePost = useSelector((state) => state.Reducer.singlePost);
  const fetchPost = async () => {
    dispatch(setInitLoadingTrue());
    try {
      const getPostRes = await axios.get(`/api/p/p_s?postId=${postId}`);
      if (getPostRes.data.data !== null) {
        dispatch(setSinglePost([getPostRes.data.data]));
      }
    } catch (error) {}
    setLoading(false);
    dispatch(setInitLoadingFalse());
  };
  useEffect(() => {
    if (loading === true) fetchPost();
  }, [loading]);

  return (
    <div className="global--container">
      {initLoading ? (
        <ReactLoading
          type="spin"
          color="#0000FF"
          width={30}
          className="react-loader"
        />
      ) : singlePost?.length > 0 ? (
        singlePost?.map((item) => (
          <CustomCardDesktop key={item?._id} data={item} isSinglePost={true} />
        ))
      ) : (
        <>Post Unavailable</>
      )}
    </div>
  );
};

export default SinglePost;
