import './App.css';
import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import axios from "axios";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';

const App = () => {
}

const baseURL = "https://restcountries.com/v3.1";

export function Service() {
  const [post, setPost] = React.useState(null);
  const [data, setdata] = React.useState(null);
  const [basicDataValue, setdataValue] = React.useState(null);
  const [countriesOfTheRegion, setCountriesOfTheRegion] = React.useState(null);
  var [languages, setlanguages] = React.useState([]);
  const [value, setValue] = useState(null);
  const basicDataTag = ['Nombre', 'Código', 'Capital', 'Region', 'Bandera', 'Languages'];

  React.useEffect(() => {
    axios.get(baseURL + '/all').then((response) => {
      setPost(response.data);
    });
  }, []);

  React.useEffect(() => {
    if (value != null) {
      axios.get(baseURL + '/name/' + value).then((response) => {
        setdata(response.data);
        setdataValue((response.data[0].languages != null && (Object.keys(response.data[0].languages)?.map(() => {
          setlanguages(Object.keys(response.data[0].languages)?.map((key) => response.data[0].languages[key]))
        })),
          [response.data[0].name.common, response.data[0].idd.root + response.data[0].idd.suffixes[0], response.data[0].capital[0],
          response.data[0].region, response.data[0].flag, languages]
        ))
      }
      )
    }
  });

  if (!post) return null;

  return (
    <div>
      <h3 className='component'>Info Países</h3>
      <div className='component'>
        <Autocomplete
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          options={listOfCountries(post)}
          style={{ width: 300 }}
          renderInput={(params) =>
            <TextField {...params} label="Countries" variant="outlined" />}
        />
      </div>
      <div className='component'>

        {(data != null && basicDataTag != null && basicDataValue != null) && (Object.keys(basicDataTag).map((i) => (

          <Accordion key={i}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>{basicDataTag[i]}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                {(basicDataTag[i] != null && basicDataTag[i] === 'Languages') ?
                  (basicDataValue != null && (
                    basicDataValue[i] != null && (Object.keys(basicDataValue[i]).map((j) => (
                      <li key={j}>
                        {(basicDataValue[i][j] != null) ? basicDataValue[i][j] : 'No se encuentra idioma'}
                      </li>
                    ))))
                  ) : basicDataValue[i]
                }
              </Typography>
            </AccordionDetails>
          </Accordion>
        )))}
      </div>

      <div className='component'>
        <Autocomplete
          onChange={(event, newSelectedRegion) => {
            getRegionCountries(newSelectedRegion).then(
              (countries) => setCountriesOfTheRegion(countries)
            )
          }}
          options={getRegions(post)}
          style={{ width: 300 }}
          renderInput={(params) =>
            <TextField {...params} label="Regions" variant="outlined" />}
        />
      </div>

      <div className='component'>
        <List>
          {(countriesOfTheRegion != null) && (
            countriesOfTheRegion.map((i) => (
              <ListItem component="div" disablePadding>
                <ListItemText> {i} </ListItemText>
              </ListItem>
            ))
          )}
        </List>
      </div>
    </div>
  );
}

function listOfCountries(countList) {
  const listCount = [];
  if (countList && countList.length > 0) {
    countList.forEach(element => {
      listCount.push(element.name.common);
    })
  }
  return listCount.sort();
}

function getRegions(contList) {
  const regionList = [];
  contList.forEach(element => {
    if (!regionList.includes(element.region)) {
      regionList.push(element.region);
    }
  })
  return regionList;
}

function getRegionCountries(region) {
  if (region !== null) {
    return axios.get(baseURL + `/region/${region}`).then(
      response => {
        return listOfCountries(response.data);
      }
    )
  } else return null;
}

export default Service;