import React, { useState } from 'react'
import { withStyles, makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';


import { JAVA_API_URL, S3_BUCKET } from './Variables'

export default function IngredientSearch(props) {
  const [ingredientQuery, setIngredientQuery] = useState([])
  const [open, setOpen] = React.useState(false);
  const [name, setName] = useState()
  const [currentIngredientImg, setCurrentIngredientImg] = useState()
  const [amount, setAmount] = useState()
  const [unit, setUnit] = useState()
  const [ingredientId, setIngredientId] = useState()
  const [searchIngredient, setSearchIngredient] = useState()

  const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);

  const StyledTableRow = withStyles((theme) => ({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }))(TableRow);

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
    ingredientFormModal: {
      backgroundColor: theme.palette.background.paper,
      position: "absolute",
      left: "35%",
      top: "20%",
      height: "400px",
      width: "500px"
    },
    ingredientAddForm: {
      position: "relative",
      left: "40%",
      top: "30%"
    },
    ingredientImagePreview: {
      height: "50px",
      width: "50px",
    },
    addIngredientImagePreview: {
      height: "200px",
      width: "200px",
    },
    IngredientRender: {
      width: "300px"
    },
    title: {
      flex: '1 1 100%',
    },

    tableIngredients: {
      width: '675px',
      height: '200px'
    },
  }));

  const addToMeal = (selecteds3Key, selectedIngredient) => {
    if (amount === undefined) {
      alert("Enter an Amount")
    } else if (unit === undefined) {
      alert("Enter a Unit")
    } else {
      let ingredient = { name: selectedIngredient.name, amount, unit, ingredientId: selectedIngredient.id, image: selecteds3Key }
      setSearchIngredient("")
      setAmount("")
      setIngredientQuery([])
      props.addIngredient(ingredient)
      handleClose()
    }

  }


  const removeIngredient = (id, s3Key) => {
    axios.post(`${JAVA_API_URL}/removeIngredient`, { id, s3Key })
      .then(res => {
        console.log(res.data)

      })
      .catch(err => {
        console.log(err)
      })
  }
  const handleOpen = (ingredient) => {
    setName(ingredient.name)
    setIngredientId(ingredient.id)
    setCurrentIngredientImg(S3_BUCKET + ingredient.s3Key)
    setOpen(true);
  };

  const handleClose = () => {
    console.log("Closing............")
    setOpen(false);
  };

  const renderIngredients = (value) => {
    console.log("Justin ", value)
    let fullS3Key = S3_BUCKET + value.s3Key
    return (
      // <Card className={classes.IngredientRender}>
      //   <CardHeader title={value.name} />
      //   {props.type === "Meal" ?
      //     <button onClick={() => removeIngredient(value.id, value.s3Key)}>Remove</button> :
      //     <button onClick={() => handleOpen(value)}>Add to Meal</button>}
      //   <img className={classes.ingredientImagePreview} src={fullS3Key} />
      //   <CardContent>{value.name}</CardContent>
      // </Card>
      <StyledTableRow>
        <StyledTableCell><img className={classes.ingredientImagePreview} src={fullS3Key} /></StyledTableCell>
        <StyledTableCell>{value.name}</StyledTableCell>
        <StyledTableCell>
          <TextField
            id="standard-basic"
            required
            value={amount}
            name="amount"
            label="amount"
            autoComplete="off"
            InputProps={{ className: classes.textForm }}
            InputLabelProps={{ className: classes.textFont }}
            onChange={handleQuantity}
          />
        </StyledTableCell>
        <StyledTableCell>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={unit}
            onChange={handleUnit}
          >
            <MenuItem value={0}>None</MenuItem>
            <MenuItem value={1}>Each</MenuItem>
            <MenuItem value={3}>Peice</MenuItem>
            <MenuItem value={4}>Bag</MenuItem>
            <MenuItem value={5}>Bottle</MenuItem>
            <MenuItem value={6}>Box</MenuItem>
            <MenuItem value={7}>Pack</MenuItem>
            <MenuItem value={8}>Jar</MenuItem>
            <MenuItem value={9}>Can</MenuItem>
            <MenuItem value={10}>Bunch</MenuItem>
            <MenuItem value={11}>Roll</MenuItem>
            <MenuItem value={12}>Dozen</MenuItem>
            <MenuItem value={13}>Small</MenuItem>
            <MenuItem value={14}>Large</MenuItem>
            <MenuItem value={15}>Lbs</MenuItem>
            <MenuItem value={16}>Qt</MenuItem>
            <MenuItem value={17}>Oz</MenuItem>
            <MenuItem value={18}>Cup</MenuItem>
            <MenuItem value={19}>Dallon</MenuItem>
            <MenuItem value={20}>Tbsp</MenuItem>
            <MenuItem value={21}>Tsp</MenuItem>
            <MenuItem value={22}>G</MenuItem>
            <MenuItem value={23}>Kg</MenuItem>
            <MenuItem value={24}>Liter</MenuItem>
            <MenuItem value={25}>Milliliter</MenuItem>
            <MenuItem value={26}>Pis</MenuItem>
          </Select>
        </StyledTableCell>
        <StyledTableCell>
          <Button onClick={() => addToMeal(fullS3Key, value)}>Add</Button>
        </StyledTableCell>
      </StyledTableRow>
    )
  }


  const search = (event) => {
    console.log(event.target.value)
    setSearchIngredient(event.target.value)
    if (event.target.value !== "") {
      axios.post(`${JAVA_API_URL}/getIngredients`, { name: event.target.value })
        .then(res => {
          console.log("searchjda ", res.data)
          setIngredientQuery(res.data)
        })
        .catch(err => {
          console.log(err)
        })
    }
  }

  const handleQuantity = (event) => {
    setAmount(parseInt(event.target.value))
  }

  const handleUnit = (event) => {
    setUnit(parseInt(event.target.value))
  }

  const classes = useStyles();
  return (
    <div>
      <Grid container justify="center" alignItems="center" direction="column">

        <Grid item>
          <input onChange={search} type="text" value={searchIngredient} id="ingredientSearch" />
          <Button>Search</Button>
        </Grid>
        <Grid item>
          <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
            Available Ingredients
          </Typography>
          <TableContainer className={classes.tableIngredients}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell align="left"></StyledTableCell>
                  <StyledTableCell align="left">Ingredient</StyledTableCell>
                  <StyledTableCell>Quantity</StyledTableCell>
                  <StyledTableCell align="left">Units</StyledTableCell>
                  <StyledTableCell align="left"></StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ingredientQuery === null ? <div></div> :
                  ingredientQuery.map(item => {
                    return (
                      renderIngredients(item)
                    )
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>


    </div>
  )
}