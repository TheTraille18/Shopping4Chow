import { useState } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import Modal from '@material-ui/core/Modal';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import IngredientSearch from './IngredientSearch'
import MealSearch from './MealSearch'
import axios from 'axios';

import { JAVA_API_URL } from './Variables'

export default function Meal() {
  const [name, setName] = useState("")
  const [ingredients, setIngredients] = useState([])
  const [mealFile, setMealFile] = useState("")
  const [mealPreview, setMealPreview] = useState()
  const [PreviewStyle, setPreviewStyle] = useState(false)
  const [website, setWebsite] = useState()

  const [open, setOpen] = useState(false)

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
    tableIngredients: {
      width: '475px',
      height: '200px'
    },
    menu: {
      position: "absolute",
      left: "40%",
    },
    mealForm: {
      position: "relative",
      left: "5%",
    },
    createMealFormModal: {

    },
    createMealFormElements: {
      backgroundColor: 'white',
      position: "absolute",
      left: "35%",
      top: "20%",
      height: "700px",
      width: "500px",
      padding: '10px'
    },
    mealImagePreview: {
      height: "100px",
      width: "100px",
    },
    ingredientImagePreview: {
      height: "50px",
      width: "50px",
    },
  }));

  const addIngredient = (ingredient) => {
    setIngredients([...ingredients, ingredient])
  }

  const handleMeal = (event) => {
    setName(event.target.value)
  }

  const mealIngredientList = (ingredient) => {
    return (
      <StyledTableRow>
        <StyledTableCell>
          <img className={classes.ingredientImagePreview} src={ingredient.image} />
        </StyledTableCell>
        <StyledTableCell>{ingredient.name}</StyledTableCell>
        <StyledTableCell>{ingredient.amount}</StyledTableCell>
        <StyledTableCell>{ingredient.unit}</StyledTableCell>
        <StyledTableCell>Remove</StyledTableCell>
      </StyledTableRow>
    )
  }

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

  const handleMealImage = (event) => {
    setMealFile(event.target.files[0])
    setMealPreview(URL.createObjectURL(event.target.files[0]))
    setPreviewStyle(true)
  }

  const handleWebsite = (event) => {
    setWebsite(event.target.value)
  }

  const createMealOpen = (formOpen) => {
    setOpen(formOpen)
  }

  const addMeal = () => {
    let meal = { name, user: "DEV", recipes: ingredients, website, }
    const mealJSON = JSON.stringify(meal);
    console.log("Meal", meal)
    let formData = new FormData()
    formData.append('file', mealFile)
    formData.append('meal', mealJSON)
    axios({
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: formData,
      url: `${JAVA_API_URL}/addmeal`,
    })
      .then(res => {
        alert("Meal Added")

        //Reset form properties
        setName("")
        setIngredients([])
        setMealFile("")
        setMealPreview()
        setPreviewStyle(false)
        setWebsite()

        //Close Form
        setOpen(false)

      })
      .catch(err => {
        alert(err)
      })
    // axios.post(`${JAVA_API_URL}/addmeal`, meal)
    //   .then(res => {
    //     console.log(res.data)

    //   })
    //   .catch(err => {
    //     console.log(err)
    //   })
  }


  const classes = useStyles();
  return (
    <div>
      <Modal
        open={open}
        close={!open}
        className={classes.createMealFormModal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Grid container className={classes.createMealFormElements} direction="column" >
          <Grid item>
            <h2 className={classes.taskFormTitle} >Add Meal</h2>
          </Grid>
          <Grid item>
            <Grid item>
              <img id="preview" src={mealPreview} alt="" className={PreviewStyle ? classes.mealImagePreview : ""} />
              <input type="file" id="myFile" name="name" accept="image/png" onChange={handleMealImage} />
            </Grid>
            <Grid container direction="row" spacing={3}>
              <Grid item>
                <TextField
                  id="standard-basic"
                  required
                  value={name}
                  name="MealName"
                  label="Meal Name"
                  autoComplete="off"
                  InputProps={{ className: classes.textForm }}
                  InputLabelProps={{ className: classes.textFont }}
                  onChange={handleMeal}
                />
              </Grid>
              <Grid item>
                <TextField
                  id="standard-basic"
                  value={website}
                  name="Website"
                  label="Website"
                  autoComplete="off"
                  InputProps={{ className: classes.textForm }}
                  InputLabelProps={{ className: classes.textFont }}
                  onChange={handleWebsite}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container direction="row" spacing={3}>
              <Grid item xs={12} margin="10">
                <Button variant="contained" color="primary" onClick={addMeal} >Add Meal</Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <TableContainer className={classes.tableIngredients}>
              <Typography variant="h6" id="tableTitle" component="div">
                Current Meal Ingredients
              </Typography>
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
                  {ingredients === null ?
                    <div></div> :
                    ingredients.map(ingredient => {
                      return (
                        mealIngredientList(ingredient)
                      )
                    })
                  }
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid items>
            <IngredientSearch addIngredient={addIngredient} type="meal" />
          </Grid>
          <Grid item>
            <Button onClick={() => createMealOpen(false)}>Close</Button>
          </Grid>
        </Grid>
      </Modal>
      <Grid container direction="row" id="MealSearch">
        <Grid item>
          <Typography variant="h6" id="tableTitle" component="div">
            Meal Search
          </Typography>
        </Grid>
        <MealSearch />
        <Grid item>
          <Button onClick={() => createMealOpen(true)}>Create Meal</Button>
        </Grid>
      </Grid>
    </div>
  )
}