import React from "react";
import { connect } from "react-redux";
import { withStyles, Typography, Button, Tooltip } from "@mui/material";
import { compose } from "redux";
import classNames from "classnames";
import PropTypes from "prop-types";
import {
  PersonAddOutlined,
  Undo as UndoIcon,
  DoneOutlined as DoneOutlinedIcon,
} from "@mui/icons-material";
export const ProfileNetwork = (props) => {
  const { classes, auth, ownProfile } = props;

  return (
    <div className={classes.root}>
      <div className={classes.info}>
        <div>{props.followers}</div>
        <div>
          {props.following}
          <Typography className={classes.isFollowingText} variant="caption">
            {props.clientFollows && (
              <React.Fragment>
                <DoneOutlinedIcon fontSize="inherit" /> Following{" "}
              </React.Fragment>
            )}
          </Typography>
        </div>
      </div>
      {auth && auth.registered && !ownProfile && (
        <div
          className={
            props.clientFollows
              ? classNames(classes.buttonControls, classes.reversedButtons)
              : classes.buttonControls
          }
        >
          <div>
            {props.clientFollows ? (
              <Tooltip title="Unfollow" placement="bottom">
                <Button
                  classes={{ root: classes.buttonRoot }}
                  size="small"
                  onClick={props.onUnfollow}
                  className={classes.topIcon}
                  disabled={props.isUpdatingNetwork}
                >
                  <UndoIcon className={classes.unFollowedIcon} />
                </Button>
              </Tooltip>
            ) : (
              <Button
                classes={{ root: classes.buttonRoot }}
                size="small"
                variant="contained"
                color="primary"
                onClick={props.onFollow}
                disabled={props.isUpdatingNetwork}
              >
                <PersonAddOutlined />
              </Button>
            )}
          </div>
          {props.messageForm}
        </div>
      )}
    </div>
  );
};

ProfileNetwork.propTypes = {
  onFollow: PropTypes.func.isRequired,
  onUnfollow: PropTypes.func.isRequired,
  isUpdatingNetwork: PropTypes.bool.isRequired,
  ownProfile: PropTypes.bool.isRequired,
  clientFollows: PropTypes.bool.isRequired,
  followers: PropTypes.element.isRequired,
  following: PropTypes.element.isRequired,
  messageForm: PropTypes.element.isRequired,
};

const styles = (theme) => ({
  root: {
    display: "flex",
    flexDirection: "row",
    padding: `${theme.spacing.unit}px`,
  },
  info: {
    display: "flex",
    width: "80%",
    justifyContent: "center",
    alignItems: "baseline",
  },
  buttonControls: {
    display: "flex",
    flexDirection: "column",
    margin: `0 ${theme.spacing.unit}px`,
  },
  reversedButtons: {
    flexDirection: "column-reverse",
  },
  topIcon: {
    marginBottom: `${theme.spacing.unit}px`,
  },
  unFollowedIcon: {
    color: "rgba(0,0,0,.7)",
  },
  isFollowingText: {
    color: "#00a152",
  },
});

const mapStateToProps = (auth) => ({
  auth,
});

export default compose(
  withStyles(styles),
  connect(mapStateToProps)
)(ProfileNetwork);
