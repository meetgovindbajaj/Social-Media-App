import { Grid, Skeleton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

const CustomSkeleton = ({ isComment = false }) => {
  return (
    <Box
      sx={{
        width: "100%",
        my: 1,
      }}
    >
      <Grid container spacing={1.5} alignItems="center">
        <Grid item xs={2} sx={{ display: "grid", placeItems: "center" }}>
          <Skeleton
            variant="circular"
            sx={{
              width: isComment ? "45px" : "30px",
              height: isComment ? "45px" : "30px",
            }}
          />
        </Grid>
        <Grid item xs={10} sx={{ padding: 1 }}>
          <Typography sx={{ display: "flex", flexDirection: "row" }}>
            <Skeleton
              variant="rectangular"
              sx={{ width: "25%", height: "10px", borderRadius: "5px", mr: 1 }}
            />
            <Skeleton
              variant="rectangular"
              sx={{ width: "20%", height: "10px", borderRadius: "5px" }}
            />
          </Typography>

          <Typography>
            <Skeleton
              variant="rectangular"
              sx={{ my: 1, borderRadius: "5px", width: "90%", height: "10px" }}
            />
            <Skeleton
              variant="rectangular"
              sx={{ mt: 1, borderRadius: "5px", width: "80%", height: "10px" }}
            />
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomSkeleton;
