import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Modal from '@material-ui/core/Modal';


import { JAVA_API_URL, S3_BUCKET } from './Variables'

export default function MealSearch(props) {
  const [Meals, setMeals] = useState([])
  const [open, setOpen] = React.useState(false);
  const [name, setName] = useState()
  const [currentIngredientImg, setCurrentIngredientImg] = useState()
  const [amount, setAmount] = useState()
  const [unit, setUnit] = useState()
  const [ingredientId, setIngredientId] = useState()

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
    menu1: {
      position: "absolute",
      left: "40%",
    },
    ingredientFormModal2: {
      backgroundColor: theme.palette.background.paper,
      position: "absolute",
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
      height: "100px",
      width: "100px",
    },
    addIngredientImagePreview: {
      height: "200px",
      width: "200px",
    },
    IngredientRender: {
      width: "300px"
    },
    addIngredientInput: {
    }
  }));

  const addToMeal = () => {
    let ingredient = { name, amount, unit, ingredientId }
    console.log("Add to Meal", ingredient)
    props.addIngredient(ingredient)
    handleClose()
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

  const removeMeal = (id) => {
    console.log("Removing meai with id of " + id)
    axios.post(`${JAVA_API_URL}/removeMeal`, { id })
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const renderMeals = (value) => {
    console.log("Meal id of " + value.id)
    let fullS3Key = S3_BUCKET + "Meal/" + value.name + ".png"
    return (
      <Card className={classes.IngredientRender} key={value.id}>
        <CardHeader title={value.name} />
        <img className={classes.ingredientImagePreview} src={fullS3Key} />
        <Button onClick={() => removeMeal(value.id)}>Remove</Button>
        <CardContent>{value.name}</CardContent>
      </Card>
    )
  }


  const search = (event) => {
    if (event.target.value !== "") {
      axios.post(`${JAVA_API_URL}/getMeals`, { name: event.target.value })
        .then(res => {
          console.log("search meal ", res.data)
          setMeals(res.data)
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
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div className={classes.ingredientFormModal}>
          <Grid container justify="center" alignItems="center" className={classes.addIngredientInput} direction="column">
            <h1>{name}</h1>
            <Grid item>
              <img className={classes.addIngredientImagePreview} src={currentIngredientImg} />
            </Grid>
          </Grid>
          <Button onClick={addToMeal}>Add</Button>
        </div>
      </Modal>
      <Grid container direction="column">
        <Grid item>
          <input onChange={search} type="text" id="header-search" />
          <Button>Search</Button>
        </Grid>
        <Grid item>
          <Grid container direction="row">
            {Meals === null ? <div></div> :
              Meals.map(item => {
                return (
                  renderMeals(item)
                )
              })}

          </Grid>

        </Grid>
      </Grid>
    </div>
  )
}