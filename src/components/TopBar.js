import React from 'react'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Link } from 'react-router-dom';

export default function TopBar() {

  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    title: {
      flexGrow: 1,
      height: 150,
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
    },
    menu: {
      position: "absolute",
      left: "40%",
    },
  }));
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography className={classes.title} variant="h6" noWrap>
            Shopping 4 Chow
        </Typography>
          <Grid container className={classes.menu} spacing={3}>
            <Grid item >
              <Link to="/ingredient">
                <Typography>
                  Ingredients
                </Typography>
              </Link>

            </Grid>
            <Grid item>
              <Link to="/meal">
                <Typography>
                  Meals
                </Typography>
              </Link>
            </Grid>
            <Grid item>
              <Typography>
                Shopping List
              </Typography>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </div>

  )
}