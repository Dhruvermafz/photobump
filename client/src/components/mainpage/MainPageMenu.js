import React from "react";
import {
  withStyles,
  IconButton,
  Grow,
  Paper,
  Popper,
  MenuItem,
  MenuList,
  ClickAwayListener,
} from "@mui/material";
import PropTypes from "prop-types";
import {
  ArrowDropDown as ArrowDropDownIcon,
  FiberNew,
  PeopleOutlined as PeopleOutlinedIcon,
  WhatshotOutlined as WhatshotOutlinedIcon,
} from "@mui/icons-material";

export class MainPageMenu extends React.Component {
  constructor() {
    super();

    this.state = {
      context: "popular",
      popperOpen: false,
    };
  }

  togglePopper = (e) => {
    this.setState({ popperOpen: !this.state.popperOpen }, () => {});
  };

  popperOpen = (e) => {
    this.setState({ popperOpen: true });
  };

  popperClose = (event) => {
    this.setState({ popperOpen: false });
  };

  onFollowing = () => {
    this.setState({ context: "following" });
    this.props.onSwitchContext("following");
  };

  onNew = () => {
    this.setState({ context: "new" });
    this.props.onSwitchContext("new");
  };

  onPopular = () => {
    this.setState({ context: "popular" });
    this.props.onSwitchContext("popular");
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <div>
          <ClickAwayListener onClickAway={this.popperClose}>
            <IconButton
              buttonRef={(node) => {
                this.anchorEl = node;
              }}
              aria-owns={this.state.popperOpen ? "menu-list-grow" : null}
              aria-haspopup="true"
              variant="contained"
              size="small"
              className={classes.button}
              onClick={this.togglePopper}
            >
              <ArrowDropDownIcon />
            </IconButton>
          </ClickAwayListener>

          <Popper
            className={classes.popper}
            open={this.state.popperOpen}
            anchorEl={this.anchorEl}
            transition
            disablePortal
            placement="bottom-start"
          >
            {({ TransitionProps }) => (
              <Grow
                {...TransitionProps}
                id="menu-list-grow"
                style={{ transformOrigin: "center top" }}
              >
                <Paper className={classes.paper}>
                  <MenuList className={classes.menuList}>
                    {this.props.auth && this.props.auth.registered && (
                      <MenuItem onClick={this.onFollowing}>
                        <PeopleOutlinedIcon className={classes.leftIcon} />
                        Following
                      </MenuItem>
                    )}
                    <MenuItem onClick={this.onNew}>
                      <FiberNew className={classes.leftIcon} />
                      New
                    </MenuItem>
                    <MenuItem onClick={this.onPopular}>
                      <WhatshotOutlinedIcon className={classes.leftIcon} />
                      Popular
                    </MenuItem>
                  </MenuList>
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>
      </div>
    );
  }
}

MainPageMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  auth: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
};

const styles = (theme) => ({
  root: {},
  button: {
    marginLeft: "2%",
    textTransform: "capitalize",
  },
  leftIcon: {
    marginRight: `${theme.spacing.unit}px`,
  },
  popper: {
    zIndex: 2000,
  },
});

export default withStyles(styles)(MainPageMenu);
