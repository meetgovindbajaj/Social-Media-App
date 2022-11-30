import { Box, Divider } from "@mui/material";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setReply } from "../../Context/features/Reducer";
import CustomReply from "./CustomReply";
import CustomSkeleton from "./CustomSkeleton";

const CustomReplyDialog = ({ visible, comId = null }) => {
  const dispatch = useDispatch();
  const replies = useSelector((state) => state.Reducer.replies);
  const lightMode = useSelector((state) => state.Reducer.lightMode);
  const [loading, setLoading] = useState(true);

  const controller = new AbortController();
  const getReplies = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/p/p_c_r?comId=${comId}`, {
        signal: controller.signal,
      });
      if (res.data.status === 200) {
        dispatch(setReply(res.data.data));
      }
    } catch (error) {}
    setLoading(false);
  };
  useEffect(() => {
    if (comId) getReplies();
    return () => {
      controller.abort();
    };
  }, [comId]);

  return (
    <Box
      sx={{
        height: visible ? "auto" : "0",
        flexDirection: "column",
        width: "98%",
        background: lightMode ? "var(--neutral-10)" : "black",
        borderRadius: "8px",
        py: visible ? 1 : 0,
        transition: "all .3s ease-in-out",
      }}
    >
      {visible ? (
        loading ? (
          <CustomSkeleton />
        ) : replies.length === 0 ? (
          <div
            style={{
              display: "grid",
              width: "100%",
              height: "30px",
              placeItems: "center",
              textAlign: "center",
            }}
          >
            No replies
          </div>
        ) : (
          replies?.map((reply, index) => {
            return (
              <>
                <CustomReply key={reply._id} reply={reply} />
                {replies?.length !== index + 1 ? (
                  <Divider
                    variant="fullWidth"
                    sx={{
                      my: 0.5,
                      background: lightMode
                        ? "var(--lm-border-c)"
                        : "var(--dm-border-c)",
                    }}
                  />
                ) : (
                  <></>
                )}
              </>
            );
          })
        )
      ) : (
        <></>
      )}
    </Box>
  );
};

export default CustomReplyDialog;
