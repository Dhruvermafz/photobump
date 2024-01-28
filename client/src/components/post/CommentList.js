import React from "react";
import {
  withStyles,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import Comment from "./Comment";

export const CommentList = (props) => {
  const {
    classes,
    comments,
    commentsPage,
    hasMoreComments,
    fetchingComments,
    onLoadNext,
    onLoadPrevious,
  } = props;
  return (
    <div className={classes.root}>
      <div className={classes.paginationControls}>
        <Button
          classes={{ root: classes.buttonRoot }}
          variant="outlined"
          size="small"
          className={classes.leftButton}
          onClick={onLoadPrevious}
          disabled={
            !hasMoreComments || !comments || (comments && comments.length < 20)
          }
        >
          <ArrowBackIcon
            classes={{ root: classes.iconRoot }}
            className={classes.leftIcon}
          />
        </Button>
        <Button
          classes={{ root: classes.buttonRoot }}
          variant="outlined"
          size="small"
          onClick={onLoadNext}
          disabled={commentsPage === 0}
        >
          <ArrowForwardIcon
            classes={{ root: classes.iconRoot }}
            className={classes.rightIcon}
          />
        </Button>
      </div>
      {fetchingComments && (
        <CircularProgress
          className={classes.circularProgress}
          color="primary"
        />
      )}
      {comments &&
        comments.map((comment, i) => <Comment key={i} comment={comment} />)}
      {!comments.length && !fetchingComments && (
        <Typography>No comments yet.</Typography>
      )}
    </div>
  );
};

CommentList.propTypes = {
  comments: PropTypes.array,
  commentsPage: PropTypes.number.isRequired,
  fetchingComments: PropTypes.bool.isRequired,
  onLoadNext: PropTypes.func.isRequired,
  onLoadPrevious: PropTypes.func.isRequired,
  hasMoreComments: PropTypes.bool.isRequired,
};

const styles = (theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  circularProgress: {
    margin: `${theme.spacing.unit * 3}px auto`,
  },
  paginationControls: {
    marginBottom: `${theme.spacing.unit}px`,
  },
  buttonRoot: {
    minWidth: `48px`,
  },
  leftButton: {
    marginRight: `${theme.spacing.unit}px`,
  },
  leftIcon: {
    marginRight: "4px",
  },
  iconRoot: {
    fontSize: "16px",
  },
  rightIcon: {
    marginLeft: "4px",
  },
});

export default withStyles(styles)(CommentList);
