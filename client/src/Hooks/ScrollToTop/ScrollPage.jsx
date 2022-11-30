import { Box, Fab, Fade, useScrollTrigger } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

export const handleScroll = (refer) => {
  refer.current.scrollIntoView({
    top: refer.current.getBoundingClientRect().top + window.pageYOffset,
    behavior: "smooth",
  });
};

const ScrollPage = ({ refer, referParent }) => {
  let trigger = useScrollTrigger({
    target: referParent?.current,
    disableHysteresis: true,
    threshold: 100,
  });
  return (
    <Fade in={trigger}>
      <Box
        onClick={() => handleScroll(refer)}
        role="presentation"
        sx={{ position: "fixed", bottom: 60, right: 16, zIndex: 1000 }}
      >
        <Fab size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </Box>
    </Fade>
  );
};
export default ScrollPage;
