import React from "react";
import { connect } from "react-redux";
import {
  withStyles,
  AppBar as MuiAppBar,
  Avatar,
  Toolbar,
  Typography,
  IconButton,
  MenuItem,
  Menu,
  Button,
  Badge,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useLocation as withRouter } from "react-router";
import { compose } from "redux";
import classNames from "classnames";
import PropTypes from "prop-types";
import {
  Inbox as InboxIcon,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";
import axios from "axios";

import DisabledIconButtonWrapper from "../icons/DisabledIconButtonWrapper";
import ModalView from "../modal/ModalView";
import AddPostForm from "../post/AddPostForm";
import { updateMboxNotif } from "../../actions/auth";

class AppBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null,
      mBoxUnreadCount: null,
    };
  }

  async componentDidMount() {
    try {
      if (this.props.auth) {
        const { data } = await axios.get("/api/message/count");
        if (data.size === 0) {
          return;
        }
        this.props.updateMboxNotif(data.size);
        // this.setState({ mBoxUnreadCount: res.data.size }, () => {});
      }
    } catch (e) {
      console.log(e);
    }
  }

  async componentDidUpdate(prevProps) {
    if (this.props.auth !== prevProps.auth) {
      try {
        this.setState({ mBoxUnreadCount: this.props.auth.mboxNotif }, () => {});
      } catch (e) {
        console.log(e);
      }
    }
  }

  handleMenu = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  selectPostFormView = () => {
    const { auth, classes } = this.props;
    if (
      window.screen.width < 600 ||
      window.innerWidth < 600 ||
      !auth.registered
    ) {
      return (
        <DisabledIconButtonWrapper
          component={Link}
          to="/upload"
          isDisabled={!auth.registered}
        >
          <CloudUploadIcon />
        </DisabledIconButtonWrapper>
      );
    }

    return (
      <ModalView
        togglerComponent={
          <IconButton>
            <CloudUploadIcon classes={{ root: classes.iconRoot }} />
          </IconButton>
        }
        modalComponent={<AddPostForm view="modal" />}
      />
    );
  };

  renderNavButtons() {
    const { auth, classes } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return auth ? (
      <div className={classes.nav}>
        {this.selectPostFormView()}

        {auth.registered ? (
          <Link to="/mbox">
            <IconButton>
              <Badge badgeContent={auth.mBoxNotif || 0} color="secondary">
                <InboxIcon classes={{ root: classes.iconRoot }} />
              </Badge>
            </IconButton>
          </Link>
        ) : (
          <div className={classes.disabledNavButton}>
            <IconButton disabled>
              <Badge badgeContent={auth.mBoxNotif || 0} color="secondary">
                <InboxIcon classes={{ root: classes.iconRoot }} />
              </Badge>
            </IconButton>
          </div>
        )}

        <IconButton
          aria-owns={open ? "menu-appbar" : null}
          aria-haspopup="true"
          onClick={this.handleMenu}
          color="inherit"
        >
          <Avatar alt="avatar" src={auth.profilePhoto} />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={open}
          onClose={this.handleClose}
        >
          {auth.registered && [
            <MenuItem
              key={1}
              to={{
                pathname: `/profile/${auth.displayName}`,
                state: { profileTabPos: 0 },
              }}
              component={Link}
              onClick={this.handleClose}
            >
              Faves
            </MenuItem>,
            <MenuItem
              key={2}
              to={{
                pathname: `/profile/${auth.displayName}`,
                state: { profileTabPos: 1 },
              }}
              component={Link}
              onClick={this.handleClose}
            >
              Posts
            </MenuItem>,
            <MenuItem
              key={3}
              to={{
                pathname: `/profile/${auth.displayName}`,
                state: { profileTabPos: 2 },
              }}
              component={Link}
              onClick={this.handleClose}
            >
              Albums
            </MenuItem>,
            <MenuItem
              key={4}
              to={{
                pathname: `/profile/${auth.displayName}`,
                state: { profileTabPos: 1 },
              }}
              component={Link}
              onClick={this.handleClose}
            >
              My Profile
            </MenuItem>,
          ]}
          {!auth.registered && [
            <MenuItem
              key={5}
              to={`/`}
              component={Link}
              onClick={this.handleClose}
            >
              Home
            </MenuItem>,
            <MenuItem
              key={6}
              to={`/register_user/`}
              component={Link}
              onClick={this.handleClose}
            >
              Register
            </MenuItem>,
          ]}
          <MenuItem
            href="/auth/logout"
            component="a"
            onClick={this.handleClose}
          >
            Log Out
          </MenuItem>
        </Menu>
      </div>
    ) : (
      <div className={classes.nav}>
        <Button to="/login" component={Link} variant="text" color="inherit">
          &nbsp;Sign In
        </Button>
        {this.props.location.pathname !== "/" && (
          <Button
            to="/register"
            component={Link}
            variant="contained"
            color="secondary"
          >
            &nbsp;Sign Up
          </Button>
        )}
      </div>
    );
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <MuiAppBar
          className={
            !this.props.auth && this.props.location.pathname === "/"
              ? classes.heroStylesAppBar
              : classes.root
          }
          position="static"
        >
          <Toolbar>
            <div>
              <Link to="/" className={classNames(classes.logo, classes.aTag)}>
                <Typography
                  variant="h6"
                  color="inherit"
                  className={classes.grow}
                >
                  SnapsApp
                </Typography>
              </Link>
            </div>

            {this.renderNavButtons()}
          </Toolbar>
        </MuiAppBar>
      </div>
    );
  }
}

AppBar.propTypes = {
  classes: PropTypes.object.isRequired,
  auth: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  updateMboxNotif: PropTypes.func,
  useHeroStyles: PropTypes.bool,
};

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  heroStylesAppBar: {
    backgroundColor: "transparent",
    boxShadow: "none",
    position: "absolute",
    zIndex: "1000",
    width: "100%",
  },
  grow: {
    flexGrow: 1,
  },
  logo: {
    display: "flex",
  },
  nav: {
    display: "flex",
    marginLeft: "auto",
    alignItems: "center",
  },
  iconRoot: {
    color: "#fff",
  },
  disabledNavButton: {
    opacity: "0.54",
  },
  aTag: {
    padding: 0,
    color: "inherit",
    textDecoration: "none",
  },
});

const mapStateToProps = (auth) => ({
  auth,
});

export default compose(
  withRouter,
  withStyles(styles),
  connect(mapStateToProps, { updateMboxNotif })
)(AppBar);
