import { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import { JAVA_API_URL } from './Variables'

export default function Ingredient() {
  const [name, setName] = useState("")
  const [ingredientFile, setIngredientFile] = useState("")


  //Ingredient Picture Preview
  const [ingredientPreview, setIngredientPreview] = useState("")
  const [PreviewStyle, setPreviewStyle] = useState(false)

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
    ingredientForm: {
      position: "absolute",
      left: "40%"
    },
    ingredientImagePreview: {
      height: "100px",
      width: "100px",
    }
  }));

  const handleIngredient = (event) => {
    let tempIngredient = event.target.value
    setName(tempIngredient)
  }

  const handleIngredientImage = (e) => {
    setIngredientFile(e.target.files[0])
    setIngredientPreview(URL.createObjectURL(e.target.files[0]))
    setPreviewStyle(true)
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    let formData = new FormData()
    formData.append('file', ingredientFile)
    formData.append('name', name)
    axios({
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: formData,
      url: `${JAVA_API_URL}/addingredient`,
    })
      .then(res => {
        //Reset Ingredient Form
        setName("")
        setIngredientFile("")
        setIngredientPreview("")
        setPreviewStyle(false)

        //Popup message
        alert("Ingredient Added")
      })
      .catch(err => {
        alert(err.response.data)
      })
  }

  const handleGetIngredients = () => {
    axios.get(`${JAVA_API_URL}/allingredients`)
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
  }
  const classes = useStyles();
  return (
    <div>
      Ingredient
      <form className={classes.ingredientForm} onSubmit={handleSubmit}>
        <h2 className={classes.taskFormTitle} >Add Ingredient</h2>
        <div className={classes.margin}>
          <Grid container direction="column" spacing={3}>
            <Grid npm xs={12}>
              <TextField
                id="standard-basic"
                required
                value={name}
                name="IngredientName"
                label="Ingredient Name"
                autoComplete="off"
                InputProps={{ className: classes.textForm }}
                InputLabelProps={{ className: classes.textFont }}
                onChange={event => handleIngredient(event)} />
            </Grid>
            <Grid item>
              <img id="preview" src={ingredientPreview} alt="" className={PreviewStyle ? classes.ingredientImagePreview : ""} />
              <input type="file" id="myFile" name={name} accept="image/png" onChange={handleIngredientImage} />
            </Grid>

            <Grid item xs={12} margin="10">
              <Button className={classes.createTaskButton} type="submit" variant="outlined" >Add Ingredient</Button>
            </Grid>

          </Grid>
        </div>
      </form>

    </div>
  )
}