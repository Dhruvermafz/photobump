import React from "react";
import { connect } from "react-redux";
import {
  withStyles,
  OutlinedInput,
  InputAdornment,
  IconButton,
  ClickAwayListener,
  Grow,
  Paper,
  Popper,
  MenuItem,
  MenuList,
} from "@mui/material";
import { compose } from "redux";
import {
  Search as SearchIcon,
  Group as GroupIcon,
  ImageSearch as ImageSearchIcon,
} from "@mui/icons-material";

export class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchTerms: "",
      popperOpen: false,
    };
  }

  popperOpen = (e) => {
    if (!e.target.value) {
      return this.setState({ popperOpen: false });
    }
    this.setState({ popperOpen: true });
  };

  popperClose = (event) => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }
    this.setState({ popperOpen: false });
  };

  onSearchChange = (e) => {
    this.setState({ searchTerms: e.target.value }, () => {});
  };

  scrubSearchTerms(searchTerms) {
    return searchTerms
      .replace(/[^\w\s]/gi, "")
      .trim()
      .replace(/\s\s+/g, " ")
      .toLowerCase()
      .split(" ");
  }

  onSearchPosts = async (e) => {
    const searchTermsArr = this.scrubSearchTerms(this.state.searchTerms);
    this.setState({ popperOpen: false, searchTerms: "" }, () => {});
    // this.props.setSearch('searchPosts', searchTermsArr);
    this.props.onSwitchContext("searchPosts", searchTermsArr);
  };

  onSearchPeople = (e) => {
    const searchTermsArr = this.scrubSearchTerms(this.state.searchTerms);
    this.setState({ popperOpen: false, searchTerms: "" }, () => {});
    // this.props.setSearch('searchUsers', searchTermsArr);
    this.props.onSwitchContext("searchUsers", searchTermsArr);
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <OutlinedInput
          inputRef={(node) => {
            this.anchorEl = node;
          }}
          className={classes.input}
          placeholder="#tags, posts, user..."
          aria-owns={this.state.popperOpen ? "menu-list-grow" : null}
          aria-haspopup="true"
          endAdornment={
            <InputAdornment position="end">
              <IconButton>
                <SearchIcon className={classes.searchIcon} />
              </IconButton>
            </InputAdornment>
          }
          labelWidth={-25}
          label="Search"
          onKeyUp={this.popperOpen}
          onFocus={this.popperOpen}
          onBlur={this.popperClose}
          onChange={this.onSearchChange}
          value={this.state.searchTerms}
        />
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
                <ClickAwayListener onClickAway={this.popperClose}>
                  <MenuList className={classes.menuList}>
                    <MenuItem onClick={this.onSearchPosts}>
                      <ImageSearchIcon className={classes.searchIcons} />
                      Search posts
                    </MenuItem>
                    <MenuItem onClick={this.onSearchPeople}>
                      <GroupIcon className={classes.searchIcons} />
                      Search people
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    );
  }
}

const styles = (theme) => ({
  root: {
    width: "250px",
    zIndex: "1000",
    [theme.breakpoints.up("sm")]: {
      width: "300px",
    },
  },
  input: {
    margin: `${theme.spacing.unit * 2}px 0`,
  },
  popper: {
    width: "250px",
    [theme.breakpoints.up("sm")]: {
      width: "285px",
    },
  },
  paper: {
    width: "100%",
    background: "#fafafa",
  },
  searchIcons: {
    paddingRight: `${theme.spacing.unit}px`,
  },
});

export default compose(withStyles(styles), connect(null))(Search);
